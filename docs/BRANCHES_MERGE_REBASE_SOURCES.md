# Quellen- und Faktenprüfung – Kapitel 03

**Stand: 10. Oktober 2026.** Quellenbasis sind die offiziellen Git-Handbücher und eine unabhängige Zweitprüfung relevanter Rebase-Aussagen anhand von GitHub Docs.

## Git (Primärquellen)

- [Pro Git: Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging): Branch-Anlage, Merge, Merge-Commit und Konfliktmarker.
- [git-switch](https://git-scm.com/docs/git-switch): Branch anlegen und wechseln; Verhalten bei uncommitteten Änderungen.
- [git-branch](https://git-scm.com/docs/git-branch): Branch als Referenz und Branch-Namen anzeigen.
- [git-merge](https://git-scm.com/docs/git-merge): Fast-Forward, Merge-Commit, `--no-ff`, Konfliktauflösung, `--continue`, `--abort` mit Einschränkungen bei uncommitteter Arbeit.
- [git-rebase](https://git-scm.com/docs/git-rebase): Commits auf neuer Basis neu anwenden, Stop bei Konflikt, `--continue` / `--abort`.
- [git-status](https://git-scm.com/docs/git-status): Lokale Änderungen und Konfliktzustände.
- [git-log](https://git-scm.com/docs/git-log): Graphische Textausgabe mit `--oneline --graph --all`.

## GitHub (Zweitprüfung)

- [About Git rebase](https://docs.github.com/en/get-started/using-git/about-git-rebase): Neuanwendung von Commits, Warnung vor Umschreiben bereits geteilter Geschichte.
- [Resolving merge conflicts after a Git rebase](https://docs.github.com/en/get-started/using-git/resolving-merge-conflicts-after-a-git-rebase): Rebase-Fortsetzung, -Abbruch, Gefahr von `--skip`.
- [About merge conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts): Konflikte als fachliche Entscheidungen.

## Didaktische Abgrenzung

Kapitel 03 ist kein Git-Befehlslexikon. Pflichtfragen prüfen zuvor erklärte Zusammenhänge: lokaler Branch, Merge-Richtung, Fast-Forward, Konflikte, Abbruch, Neuaufsetzen und Historienverantwortung. Eine freiwillige Expertenfrage führt `--no-ff` erstmals ein. Die abschließende Übung läuft ausschließlich in einem **neuen leeren Übungsrepository**; sie ist freiwillig und erzeugt bewusst nur einen Fast-Forward.

## Manuelles Review

- Können Lernende ohne Git-Vorerfahrung die Ausgangssituationen nachvollziehen?
- Wird ein Merge-Konflikt als überprüfbare Pause und nicht als Datenverlust erklärt?
- Wird `git merge --abort` nicht als universelle Garantie bei ungesicherten Änderungen dargestellt?
- Ist klar, dass Rebase Commit-Identitäten verändert und geteilte Historie besondere Vorsicht verlangt?
- Läuft der Beispielablauf in einem frisch angelegten Übungsrepository (nach Einrichten der Git-Identität)?
- Werden Merge und Rebase im UI nirgends fälschlich mit einem Push gleichgesetzt?
