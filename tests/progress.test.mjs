import test from "node:test";
import { shuffleChoices, isCorrectSelection } from "../src/questions.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PROGRESS_VERSION, emptyProgress, sanitizeProgress, completeStep,
  isComplete, lessonProgress, resumeIndex, markVisited
} from "../src/progress.mjs";

const course = JSON.parse(readFileSync(new URL("../content/course.json", import.meta.url), "utf8"));
const module = course.modules[0];

test("Leerer Fortschritt hat keine erledigten Pflichtschritte", () => {
  const stats = lessonProgress(module, emptyProgress());
  assert.equal(stats.done, 0);
  assert.equal(stats.total, module.steps.length - 1); // Expertenfrage zählt nicht.
  assert.equal(resumeIndex(module, emptyProgress()), 0);
});

test("Abschluss eines Schrittes ist idempotent", () => {
  const first = completeStep(emptyProgress(), module.id, module.steps[0].id);
  const twice = completeStep(first, module.id, module.steps[0].id);
  assert.equal(first, twice);
  assert.equal(lessonProgress(module, twice).done, 1);
  assert.equal(resumeIndex(module, twice), 1);
  assert.equal(isComplete(twice, module.id, module.steps[0].id), true);
});

test("Expertenfrage zählt nicht zur Pflichtquote", () => {
  const expert = module.steps.at(-1);
  const done = completeStep(emptyProgress(), module.id, expert.id);
  assert.equal(lessonProgress(module, done).done, 0);
  assert.equal(lessonProgress(module, done).percent, 0);
});

test("Import entfernt unbekannte Modul- und Schritt-IDs", () => {
  const sanitized = sanitizeProgress({
    schemaVersion: PROGRESS_VERSION,
    completed: { [module.id]: [module.steps[0].id, module.steps[0].id, "fremd"], unbekannt: ["id"] },
    updatedAt: "2026-10-08T00:00:00Z"
  }, course);
  assert.deepEqual(sanitized.completed, { [module.id]: [module.steps[0].id] });
});

test("Import lehnt ungültige Formate und Werte ab", () => {
  for (const input of [null, [], {}, {schemaVersion: 100, completed: {}}, {schemaVersion: 1, completed: {[module.id]: "alles"}}]) {
    assert.throws(() => sanitizeProgress(input, course));
  }
});

test("Fortschritt kann als JSON gespeichert und erneut eingelesen werden", () => {
  const before = completeStep(emptyProgress(), module.id, module.steps[0].id);
  const after = sanitizeProgress(JSON.parse(JSON.stringify(before)), course);
  assert.deepEqual(after, before);
});

test("Ein vollständig abgeschlossener Pflichtkurs wird mit 100 Prozent angezeigt", () => {
  let done = emptyProgress();
  for (const step of module.steps.filter(s => s.type !== "expert")) {
    done = completeStep(done, module.id, step.id);
  }
  assert.equal(lessonProgress(module, done).percent, 100);
});

test("Zuletzt gelesener Abschnitt ist unabhängig von abgeschlossenen Fragen", () => {
  const updated = markVisited(emptyProgress(), module.id, module.steps[4].id);
  assert.equal(resumeIndex(module, updated), 4);
  assert.equal(lessonProgress(module, updated).done, 0);
  assert.equal(markVisited(updated, module.id, module.steps[4].id), updated);
  const restored = sanitizeProgress(JSON.parse(JSON.stringify(updated)), course);
  assert.deepEqual(restored.lastVisited, { moduleId: module.id, stepId: module.steps[4].id });
});

test("Alte Fortschrittsdateien ohne Leseposition bleiben gültig", () => {
  const old = { schemaVersion: PROGRESS_VERSION, completed: { [module.id]: [module.steps[0].id] }, updatedAt: null };
  const restored = sanitizeProgress(old, course);
  assert.equal(restored.lastVisited, null);
  assert.equal(resumeIndex(module, restored), 1);
});

test("Ungültige und nicht mehr vorhandene Abschnitts-Lesezeichen werden ignoriert", () => {
  const old = { schemaVersion: PROGRESS_VERSION, completed: {},
    lastVisited: { moduleId: module.id, stepId: "entfernt" }, updatedAt: null };
  const restored = sanitizeProgress(old, course);
  assert.equal(restored.lastVisited, null);
  assert.equal(resumeIndex(module, restored), 0);
});

test("Abschließen einer Lernkontrolle behält die zuletzt gelesene Stelle bei", () => {
  const visited = markVisited(emptyProgress(), module.id, module.steps[4].id);
  const done = completeStep(visited, module.id, module.steps[4].id);
  assert.deepEqual(done.lastVisited, { moduleId: module.id, stepId: module.steps[4].id });
  assert.equal(resumeIndex(module, done), 4);
});

test("Kapitel 01 und 02 speichern ihre Abschlüsse getrennt", () => {
  const second = course.modules[1];
  assert.ok(second, "Das zweite Kapitel ist veröffentlicht");
  let current = completeStep(emptyProgress(), module.id, module.steps[0].id);
  current = completeStep(current, second.id, second.steps[0].id);
  assert.equal(lessonProgress(module, current).done, 1);
  assert.equal(lessonProgress(second, current).done, 1);
  const roundtrip = sanitizeProgress(JSON.parse(JSON.stringify(current)), course);
  assert.equal(lessonProgress(module, roundtrip).done, 1);
  assert.equal(lessonProgress(second, roundtrip).done, 1);
});

test("Wiedereinstieg folgt dem zuletzt besuchten Kapitel", () => {
  const second = course.modules[1];
  const first = markVisited(emptyProgress(), module.id, module.steps[4].id);
  const visited = markVisited(first, second.id, second.steps[8].id);
  assert.equal(visited.lastVisited.moduleId, second.id);
  assert.equal(resumeIndex(second, visited), 8);
  assert.deepEqual(sanitizeProgress(visited, course).lastVisited, visited.lastVisited);
});

test("Fragen verweisen auf vorherige Erklärungen", () => {
  for (const section of course.modules) {
    for (const [index, step] of section.steps.entries()) {
      if (step.type === "reading") continue;
      assert.ok(step.learningObjective, "Lernziel fehlt: " + step.id);
      assert.ok(step.sourceSections.length, "Quelltext fehlt: " + step.id);
      for (const ref of step.sourceSections) {
        const earlier = section.steps.findIndex(s => s.id === ref && s.type === "reading");
        assert.ok(earlier >= 0 && earlier < index, step.id + " verweist auf " + ref);
      }
    }
  }
});

test("Die ersten drei Kapitel behalten unabhängig voneinander ihren Lernfortschritt", () => {
  assert.ok(course.modules.length >= 3);
  const chapter2 = course.modules[1];
  const chapter3 = course.modules[2];
  let p = completeStep(emptyProgress(), module.id, module.steps[0].id);
  p = completeStep(p, chapter2.id, chapter2.steps[0].id);
  p = completeStep(p, chapter3.id, chapter3.steps[0].id);
  assert.equal(lessonProgress(module, p).done, 1);
  assert.equal(lessonProgress(chapter2, p).done, 1);
  assert.equal(lessonProgress(chapter3, p).done, 1);
  const restored = sanitizeProgress(JSON.parse(JSON.stringify(p)), course);
  assert.deepEqual(restored.completed, p.completed);
  const visited = markVisited(restored, chapter3.id, chapter3.steps[4].id);
  assert.equal(resumeIndex(chapter3, visited), 4);
});

test("Lernkontrollen von Kapitel 03 beziehen sich auf vorher vermittelte Lesetexte", () => {
  const chapter = course.modules[2];
  for (const [position, step] of chapter.steps.entries()) {
    if (step.type === "reading") continue;
    assert.ok(step.learningObjective && step.sourceSections?.length, step.id);
    for (const id of step.sourceSections) {
      assert.ok(chapter.steps.findIndex(s => s.id === id && s.type === "reading") < position, step.id + " -> " + id);
    }
    assert.equal(step.choices.length, Object.keys(step.explanations).length, step.id);
  }
});

test("Die ersten vier Kapitel halten getrennte Lernergebnisse und Lesepositionen", () => {
  assert.ok(course.modules.length >= 4);
  const fourth = course.modules[3];
  const second = course.modules[1];
  let state = completeStep(emptyProgress(), module.id, module.steps[0].id);
  state = completeStep(state, second.id, second.steps[0].id);
  state = completeStep(state, fourth.id, fourth.steps[0].id);
  const visited = markVisited(state, fourth.id, fourth.steps[4].id);
  const restored = sanitizeProgress(JSON.parse(JSON.stringify(visited)), course);
  assert.equal(lessonProgress(module, restored).done, 1);
  assert.equal(lessonProgress(second, restored).done, 1);
  assert.equal(lessonProgress(fourth, restored).done, 1);
  assert.equal(resumeIndex(fourth, restored), 4);
});

test("Kapitel 04: Jede Lernkontrolle ist an vorherige Lesetexte gebunden", () => {
  const lesson = course.modules[3];
  for (const [index, step] of lesson.steps.entries()) {
    if (step.type === "reading") continue;
    assert.ok(step.learningObjective, "Lernziel fehlt " + step.id);
    assert.ok(step.sourceSections?.length, "Bezugswissen fehlt " + step.id);
    for (const id of step.sourceSections) {
      const ref = lesson.steps.findIndex(s => s.id === id && s.type === "reading");
      assert.ok(ref >= 0 && ref < index, step.id + " -> " + id);
    }
    assert.equal(step.choices.length, Object.keys(step.explanations).length);
  }
});

test("Antworten werden ohne Mutation der Quelldaten neu angeordnet", () => {
  const choices = [{id: "a"}, {id: "b"}, {id: "c"}];
  const original = choices.map(c => c.id);
  const first = shuffleChoices(choices, () => 0).map(c => c.id);
  const second = shuffleChoices(choices, () => 0.999).map(c => c.id);
  assert.notDeepEqual(first, second, "Unterschiedliche Zufallsfolgen müssen verschiedene Anordnungen erlauben");
  assert.deepEqual(choices.map(c => c.id), original, "Die Quelldaten bleiben unangetastet");
  assert.deepEqual([...first].sort(), [...original].sort(), "Alle Antwort-IDs bleiben erhalten");
  assert.deepEqual([...second].sort(), [...original].sort(), "Alle Antwort-IDs bleiben erhalten");
});

test("Bewertung und Erklärungen bleiben unabhängig von der angezeigten Position", () => {
  for (const lesson of course.modules) {
    for (const step of lesson.steps) {
      if (step.type === "reading") continue;
      for (const random of [() => 0, () => 0.5, () => 0.999]) {
        const shown = shuffleChoices(step.choices, random);
        assert.deepEqual(shown.map(c => c.id).sort(), step.choices.map(c => c.id).sort(), step.id);
        assert.equal(isCorrectSelection(step.correct, step.correct), true, step.id);
        assert.equal(isCorrectSelection([...step.correct, ...step.correct].slice(0, step.correct.length + 1), step.correct), false, step.id);
        for (const choice of shown) {
          assert.ok(step.explanations[choice.id], step.id + ": " + choice.id);
          if (step.mode === "single") {
            assert.equal(isCorrectSelection([choice.id], step.correct), step.correct.includes(choice.id),
              step.id + ": " + choice.id);
          }
        }
      }
    }
  }
});

test("Keine feste richtige Antwortposition in den Kursdaten", () => {
  for (const lesson of course.modules) {
    const quiz = lesson.steps.filter(s => s.type === "quiz" && s.mode === "single" && s.choices.length >= 3);
    if (quiz.length < 6) continue;
    const counts = [0, 0, 0];
    for (const step of quiz) counts[step.choices.findIndex(c => c.id === step.correct[0])]++;
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 1,
      lesson.id + ": Positionen der richtigen Antworten sind ungleich verteilt: " + counts.join("/"));
  }
});

test("Kapitel 05 speichert eigenständigen Fortschritt und Leseposition", () => {
  assert.ok(course.modules.length >= 5);
  const fifth = course.modules[4];
  let state = emptyProgress();
  for (const chapter of course.modules) state = completeStep(state, chapter.id, chapter.steps[0].id);
  state = markVisited(state, fifth.id, fifth.steps[8].id);
  const roundtrip = sanitizeProgress(JSON.parse(JSON.stringify(state)), course);
  for (const chapter of course.modules) assert.equal(lessonProgress(chapter, roundtrip).done, 1, chapter.id);
  assert.equal(resumeIndex(fifth, roundtrip), 8);
});

test("Kapitel 05: Lernziele, Voraussetzungen, Erklärungen und ID-Verweise", () => {
  const fifth = course.modules[4];
  for (const [position, step] of fifth.steps.entries()) {
    if (step.type === "reading") continue;
    assert.ok(step.learningObjective && step.sourceSections?.length, step.id);
    for (const reference of step.sourceSections) {
      const previous = fifth.steps.findIndex(s => s.id === reference && s.type === "reading");
      assert.ok(previous >= 0 && previous < position, step.id + " -> " + reference);
    }
    assert.ok(step.correct.every(id => step.choices.some(choice => choice.id === id)), step.id);
    for (const choice of step.choices) assert.ok(step.explanations[choice.id], step.id + " / " + choice.id);
  }
});
