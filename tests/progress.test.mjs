import test from "node:test";
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

test("Drei Kapitel behalten unabhängig voneinander ihren Lernfortschritt", () => {
  assert.equal(course.modules.length, 3);
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
