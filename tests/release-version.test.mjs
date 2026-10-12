import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sanitizeProgress } from "../src/progress.mjs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const course = JSON.parse(read("content/course.json"));
const pkg = JSON.parse(read("package.json"));
const app = read("src/app.mjs");
const readme = read("README.md");
const changelog = read("CHANGELOG.md");

function step(moduleId, stepId) {
  const module = course.modules.find(item => item.id === moduleId);
  assert.ok(module, "Modul fehlt: " + moduleId);
  const value = module.steps.find(item => item.id === stepId);
  assert.ok(value, "Schritt fehlt: " + moduleId + "/" + stepId);
  return value;
}

test("Paket-, Kurs- und angezeigte Version bleiben konsistent", () => {
  assert.match(pkg.version, /^\\d+\\.\\d+\\.\\d+$/);
  assert.equal(course.courseVersion, pkg.version);
  assert.equal(course.schemaVersion, 1, "Inhaltsformat ist unabhängig von der Release-Version");
  assert.match(app, /Ausgabe 01 · Oktober 2026 · v" \\+ course\\.courseVersion/);
  assert.match(changelog, /^## \\[Unreleased\\]/m);
  assert.match(changelog, /^## \\[0\\.1\\.0\\] - 2026-10-12/m);
});

test("Einsteiger-Voraussetzungen sind auf Website und im README klar", () => {
  assert.match(app, /Voraussetzungen für die praktischen Übungen/);
  assert.match(app, /mindestens Version 2\\.28/);
  assert.match(app, /ohne GitHub-Konto/);
  assert.match(readme, /Git 2\\.28 oder neuer/);
  assert.match(readme, /user\\.name/);
  assert.match(readme, /user\\.email/);
  assert.doesNotMatch(readme, /Einsteigerfreundlich und ohne vorausgesetzte Kommandozeilenkenntnisse/);
});

test("Drei Befehlsblöcke aus Kapitel 01 enthalten echte Zeilenumbrüche", () => {
  for (const id of ["bewusst-stagen", "ignore-ist-keine-freigabe", "remote-klar"]) {
    const command = step("git-modell", id).command;
    assert.ok(command.includes("\\n"), id + ": Kein echter Zeilenumbruch");
    assert.ok(!command.includes("\\\\n"), id + ": Literale Backslash-n-Zeichen");
  }
  assert.match(step("git-modell", "bewusst-stagen").body[1], /ungetrackte Dateien/);
  assert.match(step("git-mit-coding-agenten", "baseline-ist-ein-versprechen").body[2], /nicht automatisch sauber/);
});

test("Alter lokaler Lernfortschritt überlebt den Patch ohne Migration", () => {
  const old = {
    schemaVersion: 1,
    completed: {
      "git-modell": ["git-ist-nicht-cloud", "bewusst-stagen"],
      "git-mit-coding-agenten": ["baseline-ist-ein-versprechen"]
    },
    lastVisited: { moduleId: "git-mit-coding-agenten", stepId: "baseline-ist-ein-versprechen" },
    updatedAt: "2026-10-12T09:00:00.000Z"
  };
  const restored = sanitizeProgress(old, course);
  assert.deepEqual(restored, old);
});
