# Kapitel 04 – Quellen und redaktionelle Prüfung

Stand: 10. Oktober 2026. Fachliche Aussagen wurden anhand der offiziellen GitHub-Dokumentation (Produktanbieter) geprüft. Die eigenständige didaktische Prüfung erfolgt mit [LEARNING_PRINCIPLES.md](LEARNING_PRINCIPLES.md) und [CONTENT_GUIDE.md](CONTENT_GUIDE.md). Technisches Review ersetzt keinen Nutzertest.

## Primärquellen (GitHub)

- [About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/about-issues): Aufgaben, Diskussionen, Verantwortlichkeiten.
- [About pull requests](https://docs.github.com/en/pull-requests/get-started/about-pull-requests): Head-/Base-Branches, Vergleich, Reviews und Merge-Ablauf.
- [Draft pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request): Entwurf, Ready for review und Einschränkungen beim Merge.
- [Reviewing proposed changes](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request): Comment, Approve und Request changes.
- [Approving with required reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews): Review-Bedingungen und Unterschiede zwischen Rückmeldung und technischem Blocker.
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks): Status/Checks, verpflichtende Prüfungen und deren Grenzen.
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): Review-Pflicht, Pflichtchecks, Regeln abhängig von Konfiguration.
- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges): Merge-Commit, Squash, Rebase mit konkreten Konsequenzen für Commit-Historien.
- [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners): Weiterführung für Teams; bewusst nicht als Pflichtwissen in Kapitel 04.

## Prüfung an Gegenbeispielen

- Ein PR muss nicht zwingend ein Issue haben.
- Ein Issue ändert nicht automatisch den Code.
- Ein Draft-PR kann frühzeitig Feedback und Checks bekommen, kann aber noch nicht gemergt werden.
- Die Review-Aktion „Request changes“ muss ohne aktive entsprechende Schutzregel nicht zwingend jeden Merge blockieren.
- Erfolgreiche Checks sind nicht automatisch eine vorgeschriebene Merge-Bedingung und keine Garantie für fachliche Richtigkeit.
- Merge-Methode ist abhängig von den erlaubten Repository-Optionen; Squash fasst Commits zusammen, Rebase nicht.
- Nach Löschung eines Remote-Feature-Branches kann der lokale Branch weiter existieren.

## Lernziel-/Frage-Review

Alle Pflichtfragen enthalten `learningObjective`, `sourceSections` mit vorangegangenem Lesetext und erklärende Rückmeldung zu jeder Antwort. Die freiwillige Praxisübung erfolgt in einem eigenen Übungsrepository und ist ohne weiteren Benutzeraccount nicht für die Lektüre erforderlich. Vor Merge: Testdurchlauf ohne Git-Vorwissen, Mobil-/Tastaturcheck, Fortschritts-Export/Import und konkrete Review-Fragen prüfen.
