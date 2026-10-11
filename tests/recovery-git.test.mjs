import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

test("Übungsrepository: Restore, Unstage, Revert und Reflog verhalten sich wie erklärt", () => {
  const dir = mkdtempSync(join(tmpdir(), "git-rettung-"));
  const path = join(dir, "notiz.txt");
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
  try {
    git("init", "-b", "main");
    git("config", "user.name", "Rettungsübung");
    git("config", "user.email", "test@example.invalid");
    writeFileSync(path, "Original\n");
    git("add", "notiz.txt");
    git("commit", "-m", "Start");
    writeFileSync(path, "Versuch\n");
    git("add", "notiz.txt");
    assert.match(git("diff", "--staged"), /Versuch/);
    git("restore", "--staged", "notiz.txt");
    assert.equal(readFileSync(path, "utf8"), "Versuch\n");
    assert.match(git("diff"), /Versuch/);
    git("restore", "--", "notiz.txt");
    assert.equal(readFileSync(path, "utf8"), "Original\n");

    writeFileSync(path, "Fehler\n");
    git("add", "notiz.txt");
    git("commit", "-m", "Fehlerhafter Versuch");
    const faulty = git("rev-parse", "HEAD");
    git("revert", "--no-edit", "HEAD");
    assert.equal(readFileSync(path, "utf8"), "Original\n");
    assert.equal(git("rev-list", "--count", "HEAD"), "3");
    assert.match(git("log", "--oneline", "-1"), /Revert/);

    writeFileSync(path, "Neu\n");
    git("add", "notiz.txt");
    git("commit", "-m", "Nur lokal");
    const before = git("rev-parse", "HEAD");
    git("reset", "--soft", "HEAD~1");
    assert.equal(readFileSync(path, "utf8"), "Neu\n");
    assert.match(git("diff", "--cached"), /Neu/);
    assert.match(git("reflog"), /Nur lokal/);
    git("branch", "rettung", before);
    assert.equal(git("rev-parse", "rettung"), before);
    assert.equal(git("cat-file", "-t", faulty), "commit");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Amend ersetzt den letzten lokalen Commit durch einen Commit mit neuer Identität", () => {
  const dir = mkdtempSync(join(tmpdir(), "git-amend-"));
  const path = join(dir, "notiz.txt");
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
  try {
    git("init", "-b", "main");
    git("config", "user.name", "Amend-Übung");
    git("config", "user.email", "amend@example.invalid");
    writeFileSync(path, "Basis\n");
    git("add", "notiz.txt");
    git("commit", "-m", "Start");
    writeFileSync(path, "Basis\nErste Änderung\n");
    git("add", "notiz.txt");
    git("commit", "-m", "Änderung");
    const original = git("rev-parse", "HEAD");

    writeFileSync(path, "Basis\nErste Änderung\nKorrektur\n");
    git("add", "notiz.txt");
    git("-c", "core.editor=true", "commit", "--amend", "--no-edit");

    assert.notEqual(git("rev-parse", "HEAD"), original);
    assert.equal(git("rev-list", "--count", "HEAD"), "2");
    assert.equal(git("show", "HEAD:notiz.txt"), "Basis\nErste Änderung\nKorrektur");
    assert.equal(git("status", "--porcelain"), "");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
