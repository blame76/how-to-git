import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PROGRESS_VERSION, emptyProgress, sanitizeProgress, completeStep,
  isComplete, lessonProgress, resumeIndex
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
