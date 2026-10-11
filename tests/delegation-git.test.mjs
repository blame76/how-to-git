import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

function withScratchRepo(callback) {
  const dir = mkdtempSync(join(tmpdir(), "git-delegation-"));
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore","pipe","pipe"] }).trim();
  try {
    git("init", "-b", "main");
    git("config", "user.name", "Lernprojekt");
    git("config", "user.email", "learn@example.invalid");
    callback({ dir, git });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("Fingerübung erhält main und zeigt den isolierten Feature-Patch", () => {
  withScratchRepo(({ dir, git }) => {
    const path = join(dir, "notiz.txt");
    writeFileSync(path, "Start\n");
    git("add", "notiz.txt");
    git("commit", "-m", "Start");
    const initial = git("rev-parse", "main");
    git("switch", "-c", "feat/notiz");
    writeFileSync(path, "Start und Versuch\n");
    assert.match(git("status", "--short"), /notiz\.txt/);
    assert.match(git("diff"), /Start und Versuch/);
    git("add", "notiz.txt");
    assert.match(git("diff", "--staged"), /Start und Versuch/);
    git("commit", "-m", "Notiz ergänzen");
    assert.equal(git("status", "--short"), "");
    const branchDiff = git("diff", "main...feat/notiz");
    assert.match(branchDiff, /Start und Versuch/);
    const commits = git("log", "--oneline", "main..feat/notiz");
    assert.match(commits, /Notiz ergänzen/);
    assert.equal(git("rev-parse", "main"), initial);
    assert.equal(readFileSync(path, "utf8"), "Start und Versuch\n");
    assert.equal(git("remote"), "");
  });
});

test("Übergabevorlage fordert Grenzen, Testevidenz und menschliche Entscheidung", () => {
  const doc = readFileSync(new URL("../docs/AGENT_HANDOFF_TEMPLATE.md", import.meta.url), "utf8");
  for (const expected of ["Erwartetes Ergebnis", "Nicht beauftragt", "Stopp-Regel",
    "Testresultate", "Nicht durchgeführte Prüfungen", "Draft-PR", "muss der Mensch"]) {
    assert.ok(doc.includes(expected), "Vorlage: " + expected);
  }
  assert.ok(!doc.includes("secret_value=") && !doc.includes("api_key="));
});

test("Abschlusskapitel verlangt für jeden Antwortvorschlag eine begründete Entscheidung", () => {
  const course = JSON.parse(readFileSync(new URL("../content/course.json", import.meta.url), "utf8"));
  assert.equal(course.modules.length, 8);
  const chapter = course.modules[7];
  const questions = chapter.steps.filter(s => s.type === "quiz");
  assert.equal(questions.length, 12);
  const count = [0,0,0];
  for (const question of questions) {
    assert.equal(question.mode, "single");
    assert.equal(question.choices.length, 3);
    count[question.choices.findIndex(c => c.id === question.correct[0])]++;
    assert.ok(question.choices.every(c => question.explanations?.[c.id]));
  }
  assert.deepEqual(count, [4,4,4]);
  assert.ok(chapter.steps.some(s => s.type === "expert"));
});
