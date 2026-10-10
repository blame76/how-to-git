# Git-Quellen und Faktenprüfung – Kapitel 02

**Stand 10. Oktober 2026.** Die technische Basis stammt aus offiziellen Git-Handbüchern; menschliche didaktische Prüfung bleibt vor Merge erforderlich.

- [git-fetch](https://git-scm.com/docs/git-fetch): Abruf von Objekten und Referenzen, Aktualisierung von Remote-Tracking-Branches.
- [git-pull](https://git-scm.com/docs/git-pull): Fetch und Integration, ausdrücklich `--ff-only` zur Begrenzung.
- [git-push](https://git-scm.com/docs/git-push): Schutz vor Non-Fast-Forward-Updates, Force-with-Lease als eingeschränktes Werkzeug.
- [Remote Branches – Pro Git](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches): Lokal vs. Remote-Tracking-Referenzen wie `origin/main`.
- [git-branch](https://git-scm.com/docs/git-branch): Upstream und ahead/behind bei `git branch -vv`.
- [git-status](https://git-scm.com/docs/git-status): Status der lokalen Änderungen.
- [GitHub Docs: Getting changes from a remote](https://docs.github.com/en/get-started/using-git/getting-changes-from-a-remote-repository): Unabhängiger Abgleich der Erklärungen zu origin, Remote-Tracking, Fetch und Integration.
- [GitHub Docs: Dealing with non-fast-forward errors](https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors): Zweitprüfung der Push-Ablehnung als Schutz vor verlorenen Commits.
- [GitHub Docs: Pushing commits](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository): Veröffentlichungsrichtung und mögliche Schutzregeln.
- [git-merge](https://git-scm.com/docs/git-merge), [git-rebase](https://git-scm.com/docs/git-rebase): Integrationsvarianten, die erst in Kapitel 03 praktisch eingeübt werden.

## Didaktische Trennung

Kapitel 02 erklärt die **Entscheidungen beim Synchronisieren**. Konfliktlösung und praktische Merge-/Rebase-Durchführung gehören zu Kapitel 03. Pflicht-Lernkontrollen tragen `learningObjective` und `sourceSections` und dürfen nur zuvor vermittelte Begriffe voraussetzen.

## Vor dem Merge prüfen

- Kann ein Einsteiger jede Antwort aus den vorangegangenen Abschnitten begründen?
- Werden `origin/main` und lokales `main` nicht verwechselt?
- Bleibt der Unterschied zwischen Fetch und Integration konsequent?
- Sind `ahead`/`behind` Aussagen zu Commits (nicht Dateien)?
- Ist Force-Push klar keine pauschale Reparatur?
