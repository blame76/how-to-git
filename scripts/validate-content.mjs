import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const course = JSON.parse(readFileSync(new URL("../content/course.json", import.meta.url), "utf8"));
assert.equal(course.schemaVersion, 1);
assert.ok(Array.isArray(course.modules) && course.modules.length, "Mindestens ein Modul erforderlich");
assert.ok(Array.isArray(course.plannedModules), "Vorschau fehlt");
const moduleIds = new Set();
let count = 0;
for (const module of course.modules) {
  assert.ok(typeof module.id === "string" && /^[a-z0-9-]+$/.test(module.id), "Ungültige Modul-ID");
  assert.ok(!moduleIds.has(module.id), "Doppelte Modul-ID: " + module.id);
  moduleIds.add(module.id);
  assert.ok(typeof module.title === "string" && module.title.trim());
  assert.ok(Array.isArray(module.steps) && module.steps.length, "Modul ohne Lernschritte");
  const stepIds = new Set();
  for (const step of module.steps) {
    count++;
    assert.ok(typeof step.id === "string" && /^[a-z0-9-]+$/.test(step.id), "Ungültige Schritt-ID");
    assert.ok(!stepIds.has(step.id), "Doppelte Schritt-ID: " + step.id);
    stepIds.add(step.id);
    assert.ok(typeof step.title === "string" && step.title.trim(), "Titel fehlt");
    assert.ok(["reading", "quiz", "expert"].includes(step.type), "Unbekannter Schritttyp");
    if (step.type === "reading") {
      assert.ok(Array.isArray(step.body) && step.body.length, "Lesetext fehlt");
      assert.ok(step.body.every(v => typeof v === "string" && v.trim()), "Leerer Absatz");
      if (step.diagram) assert.ok(Array.isArray(step.diagram) && step.diagram.every(v => v.name && v.note));
    } else {
      assert.ok(typeof step.prompt === "string" && step.prompt.trim(), "Quiz-Frage fehlt");
      assert.ok(typeof step.learningObjective === "string" && step.learningObjective.trim(), "Lernziel fehlt: " + step.id);
      assert.ok(Array.isArray(step.sourceSections) && step.sourceSections.length, "Quellabschnitt fehlt: " + step.id);
      for (const ref of step.sourceSections) {
        const idx = module.steps.findIndex(item => item.id === ref && item.type === "reading");
        assert.ok(idx >= 0 && idx < module.steps.indexOf(step),
          "Nicht zuvor vermittelter Lesetext: " + step.id + " -> " + ref);
      }
      assert.ok(["single", "multiple"].includes(step.mode), "Quiz-Modus ungültig");
      assert.ok(Array.isArray(step.choices) && step.choices.length >= 2, "Zu wenige Optionen");
      const choices = new Set(step.choices.map(v => v.id));
      assert.equal(choices.size, step.choices.length, "Doppelte Antwort-ID");
      assert.ok(step.choices.every(v => typeof v.text === "string" && v.text.trim()), "Antworttext fehlt");
      assert.ok(Array.isArray(step.correct) && step.correct.length, "Keine korrekte Antwort");
      assert.equal(new Set(step.correct).size, step.correct.length, "Korrekte Antwort doppelt");
      assert.ok(step.correct.every(id => choices.has(id)), "Korrekte Antwort-ID nicht vorhanden");
      if (step.mode === "single") assert.equal(step.correct.length, 1, "Single Choice braucht genau eine korrekte Antwort");
      assert.ok(step.success && step.retry, "Feedback fehlt");
      assert.ok(step.choices.every(v => typeof step.explanations?.[v.id] === "string" && step.explanations[v.id].trim()), "Antworterklärung fehlt");
    }
  }
}
console.log("Kursinhalt geprüft:", course.modules.length, "Modul(e),", count, "Schritte.");
