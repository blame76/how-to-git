import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const course = JSON.parse(readFileSync(new URL("../content/course.json", import.meta.url), "utf8"));
const chapter = course.modules.find(m => m.id === "sicherheit-automation");

test("Sicheres Workflow-Beispiel steht nur im Dokumentationsordner", () => {
  assert.ok(chapter, "Kapitel 06 vorhanden");
  const yaml = readFileSync(new URL("../docs/examples/lerntest.yml", import.meta.url), "utf8");
  assert.match(yaml, /(^|\n)on:\s*\n\s+pull_request:\s*\n/);
  assert.match(yaml, /(^|\n)permissions:\s*\{\}/);
  assert.match(yaml, /(^|\n)jobs:\s*\n/);
  assert.match(yaml, /run:\s*echo /);
  assert.doesNotMatch(yaml, /pull_request_target|workflow_run|contents:\s*write|secrets\.|--force|curl\s|wget\s/);
  assert.ok(!yaml.includes("API_KEY") && !yaml.includes("PRIVATE_KEY"));
  const lesson = chapter.steps.find(s => s.id === "praxis-ohne-echte-zugangsdaten");
  assert.ok(lesson);
  assert.ok(lesson.command.includes("pull_request:"));
  assert.ok(lesson.command.includes("permissions: {}"));
});

test("Kapitel 06 trennt Sicherheitsprinzipien von der optionalen Expertenfrage", () => {
  const required = chapter.steps.filter(step => step.type === "quiz");
  assert.ok(required.length >= 10);
  assert.ok(chapter.steps.some(step => step.type === "expert"));
  for (const step of required) {
    assert.equal(step.mode, "single");
    assert.equal(step.choices.length, 3);
    assert.ok(step.learningObjective && step.sourceSections?.length, step.id);
  }
});
