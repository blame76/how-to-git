# Fachprüfung – Kapitel 05: Fehler retten statt vertuschen

**Stand: Oktober 2026.** Grundlage sind offizielle Git-Handbücher und eine Gegenprüfung anhand von GitHub Docs. Das [Quiz-Qualitätsgate](QUIZ_QUALITY_GATE.md) gilt auch für die neuen Fragen. Ein erfolgreicher technischer Test ist noch keine didaktische Freigabe.

## Git-Primärquellen

- [git-status](https://git-scm.com/docs/git-status): Arbeitsdateien, Staging-Bereich und ungetrackte Pfade.
- [git-diff](https://git-scm.com/docs/git-diff): Lesen nicht gestagter und vorgemerkter Änderungen.
- [git-restore](https://git-scm.com/docs/git-restore): Unterschied zwischen `--staged` und Wiederherstellen des Arbeitsverzeichnisses; mögliche Datenverluste.
- [git-revert](https://git-scm.com/docs/git-revert): Gegen-Commit, ohne frühere Commits aus der geteilten Geschichte zu löschen.
- [git-commit](https://git-scm.com/docs/git-commit): `--amend` ersetzt den letzten Commit; vor geteilter Veröffentlichung besonders vorsichtig einsetzen.
- [git-reset](https://git-scm.com/docs/git-reset): `--soft`, `--mixed` und `--hard` haben unterschiedliche Auswirkungen auf Commit-Zeiger, Index und Arbeitsdateien.
- [git-reflog](https://git-scm.com/docs/git-reflog): Historie lokaler Referenzbewegungen und Grenzen durch Ablauf/Bereinigung.
- [git-bisect](https://git-scm.com/docs/git-bisect): Reproduzierbare good-/bad-Tests, Eingrenzung, `git bisect reset`.
- [Pro Git: Debugging with Git](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git): Praktische Fehlersuche und Bisect.

## GitHub – unabhängiger Gegencheck

- [Options for managing commits in GitHub Desktop](https://docs.github.com/en/desktop/managing-commits/options-for-managing-commits-in-github-desktop): Undo/Reset vor Veröffentlichung, Revert für gemeinsame Geschichte und Vorsicht vor nachträglichem Umschreiben.
- [Managing commits](https://docs.github.com/en/desktop/managing-commits): Abgrenzung zwischen Undo, Revert, Reset und weiteren Methoden.

## Safety / redaktionelle Grenzen

- `git restore -- datei` kann nicht gestagte Dateiänderungen verwerfen. Niemals als bloße Informationsabfrage beschreiben.
- `git restore --staged datei` nimmt Inhalt aus dem nächsten Commit, behält aber Änderungen der Arbeitsdatei.
- Die Reset-Varianten unterscheiden sich: `--hard` ist kein Standardreparaturweg. Geteilte Historie nicht ohne ausdrückliche Teamabstimmung umschreiben.
- Revert kann einen Konflikt erzeugen und ersetzt keine Prüfung der fachlichen Wirkung.
- Reflog ist eine lokale Spur, kein vollständiges Backup; nie erfasste Dateien und abgelaufene Objekte sind keine zugesicherte Rettung.
- Bisect verlangt bekannte gute/schlechte Commits und testbares Verhalten.
- Für jede praktische Git-Übung ein **separates neues Testrepository** verwenden.

## Review-Gate vor Merge

1. Fragen ohne Antwortoptionen lösen. Sind andere Optionen realistische, aber fachlich falsche Alternativen?
2. Didaktisch prüfen: Keine versteckten Voraussetzungen und keine Alternative, die unter den gegebenen Bedingungen ebenfalls funktioniert.
3. Beide Übungsabläufe im wegwerfbaren Git-Repository selbst durchspielen.
4. Lokal/Mobil durchklicken; Lesestand und Export/Import aus Kapitel 01–04 müssen erhalten bleiben.
5. Quiz-Positionen, Erklärungen und CI kontrollieren. Danach erst menschlichen Merge-Review durchführen.
