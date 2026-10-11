import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

function withGitRepo(callback) {
  const root = mkdtempSync(join(tmpdir(), "git-hasen-"));
  const repo = join(root, "repo");
  mkdirSync(repo);
  const git = (dir, ...args) => execFileSync("git", args, {
    cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_EDITOR: "true", GIT_TERMINAL_PROMPT: "0" }
  }).trim();
  try {
    git(repo, "init", "-b", "main");
    git(repo, "config", "user.name", "Git Hasen Test");
    git(repo, "config", "user.email", "git-hasen@example.invalid");
    writeFileSync(join(repo, "notiz.txt"), "Start\n");
    git(repo, "add", "notiz.txt");
    git(repo, "commit", "-m", "Start");
    callback({ root, repo, git });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("Worktree besitzt getrennten Checkout, gemeinsame Historie und bleibt aufräumbar", () => {
  withGitRepo(({root,repo,git}) => {
    const hot = join(root, "hotfix");
    const mainSha = git(repo, "rev-parse", "main");
    git(repo, "worktree", "add", "-b", "fix/hot", hot, "main");
    assert.equal(git(hot, "branch", "--show-current"), "fix/hot");
    assert.equal(git(repo, "branch", "--show-current"), "main");
    writeFileSync(join(hot, "notiz.txt"), "Hotfix\n");
    git(hot, "add", "notiz.txt");
    git(hot, "commit", "-m", "Fix");
    assert.equal(readFileSync(join(repo, "notiz.txt"), "utf8"), "Start\n");
    assert.equal(git(repo, "rev-parse", "main"), mainSha);
    assert.notEqual(git(repo, "rev-parse", "fix/hot"), mainSha);
    assert.ok(git(repo, "worktree", "list").includes("hotfix"));
    git(repo, "worktree", "remove", hot);
    assert.equal(git(repo, "rev-parse", "fix/hot"), git(repo, "show-ref", "-s", "refs/heads/fix/hot"));
  });
});

test("Cherry-Pick übernimmt eine einzelne Änderung als neuen Commit", () => {
  withGitRepo(({repo,git}) => {
    git(repo, "switch", "-c", "fix/hot");
    writeFileSync(join(repo, "notiz.txt"), "Hotfix\n");
    git(repo, "add", "notiz.txt");
    git(repo, "commit", "-m", "Hotfix");
    const original = git(repo, "rev-parse", "HEAD");
    git(repo, "switch", "main");
    // Give main a genuinely different parent history before cherry-pick.
    // With identical parent/tree/message/metadata, two commits can share a SHA.
    writeFileSync(join(repo, "andere-aufgabe.txt"), "Unabhängig\n");
    git(repo, "add", "andere-aufgabe.txt");
    git(repo, "commit", "-m", "Andere Aufgabe");
    git(repo, "cherry-pick", original);
    assert.equal(readFileSync(join(repo, "notiz.txt"), "utf8"), "Hotfix\n");
    assert.notEqual(git(repo, "rev-parse", "HEAD"), original);
    assert.equal(git(repo, "log", "-1", "--format=%s"), "Hotfix");
  });
});

test("Range-Diff vergleicht zwei Commit-Serien, ohne Branches zu verschieben", () => {
  withGitRepo(({repo,git}) => {
    git(repo, "switch", "-c", "feature-v1");
    writeFileSync(join(repo, "hinweis.txt"), "Hallo\n");
    git(repo, "add", "hinweis.txt");
    git(repo, "commit", "-m", "Hinweis");
    const v1 = git(repo, "rev-parse", "HEAD");
    git(repo, "switch", "main");
    git(repo, "switch", "-c", "feature-v2");
    writeFileSync(join(repo, "hinweis.txt"), "Hallo zusammen\n");
    git(repo, "add", "hinweis.txt");
    git(repo, "commit", "-m", "Hinweis");
    const v2 = git(repo, "rev-parse", "HEAD");
    const result = git(repo, "range-diff", "main..feature-v1", "main..feature-v2");
    assert.match(result, /Hinweis/);
    assert.equal(git(repo, "rev-parse", "feature-v1"), v1);
    assert.equal(git(repo, "rev-parse", "feature-v2"), v2);
  });
});

test("Rerere verwendet wiederkehrende Konfliktlösung, ohne automatisch zu stagen", () => {
  withGitRepo(({repo,git}) => {
    git(repo, "config", "rerere.enabled", "true");
    git(repo, "config", "rerere.autoupdate", "false");
    git(repo, "switch", "-c", "side");
    writeFileSync(join(repo, "notiz.txt"), "Side\n");
    git(repo, "commit", "-am", "Side");
    git(repo, "switch", "main");
    writeFileSync(join(repo, "notiz.txt"), "Main\n");
    git(repo, "commit", "-am", "Main");
    git(repo, "switch", "-c", "attempt1");
    assert.throws(() => git(repo, "merge", "side"), /Command failed/);
    writeFileSync(join(repo, "notiz.txt"), "Beide\n");
    git(repo, "add", "notiz.txt");
    git(repo, "-c", "core.editor=true", "merge", "--continue");
    git(repo, "switch", "main");
    git(repo, "switch", "-c", "attempt2");
    assert.throws(() => git(repo, "merge", "side"), /Command failed/);
    assert.equal(readFileSync(join(repo, "notiz.txt"), "utf8"), "Beide\n");
    assert.ok(git(repo, "ls-files", "-u").length > 0, "Konflikt bleibt ohne autoupdate ungestaged");
    git(repo, "add", "notiz.txt");
    git(repo, "-c", "core.editor=true", "merge", "--continue");
    assert.equal(git(repo, "status", "--porcelain"), "");
  });
});
