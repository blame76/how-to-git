# Kapitel 07 – Quellen und technischer Review

Stand: 11. Oktober 2026. Das Kapitel behandelt Git-Funktionen, deren Verhalten anhand offizieller Handbücher und ausführbarer Beispiele gegengeprüft wurde. Es gilt weiterhin das [Quiz-Qualitätsgate](QUIZ_QUALITY_GATE.md).

## Primärquellen

- [git-worktree](https://git-scm.com/docs/git-worktree): mehrere Arbeitsbäume je Repository, gemeinsame Git-Daten, separates HEAD/Index, Branch-Checkout-Schutz, `add -b`, `list`, `remove`, `prune`. Ein schmutziger Worktree wird normalerweise nicht ohne `--force` entfernt.
- [git-cherry-pick](https://git-scm.com/docs/git-cherry-pick): die Änderung einzelner Commits erneut anwenden, neue Commit-Identitäten, `--continue` und `--abort`. `-x` ergänzt einen Herkunftshinweis für unkomplizierte Cherry-Picks, vor allem bei öffentlich sichtbaren Branches; es ersetzt kein Review.
- [git-range-diff](https://git-scm.com/docs/git-range-diff): zwei Patch-Serien vergleichen, Einträge zuordnen, Veränderungssymbole, Grenzen der Zuordnung. Ausgabe ist ausdrücklich kein stabiles maschinenlesbares Format.
- [git-rerere](https://git-scm.com/docs/git-rerere): wiederkehrende Konfliktlösung erfassen und wiederverwenden. `rerere.enabled` aktivieren; standardmäßig den Index prüfen und `git add` verwenden, wenn `rerere.autoupdate` nicht eingeschaltet ist.
- [git-merge](https://git-scm.com/docs/git-merge): angehaltenen Merge nach fachlicher Konfliktlösung abschließen und sichere Abbruchoptionen.

## Sicherheits- und Didaktikgrenzen

- `worktree` schafft zusätzliche Arbeitsverzeichnisse, **keine** voneinander isolierten Git-Objektdatenbanken. Worktree-Ordner oder Branches nicht blind löschen.
- `cherry-pick` kann von anderen Commits abhängen oder Konflikte erzeugen. Ein neuer Commit kann dieselbe Änderung, aber eine andere ID besitzen.
- `range-diff` bleibt ein Prüfwerkzeug für Menschen. Eine alte Vergleichsreferenz bewusst sichern; bei veränderter Basis die Grenzen der Commit-Bereiche entsprechend wählen.
- `rerere` nutzt früher gespeicherte Auflösungen und kann fachlich unpassende Ergebnisse erneut anbieten. Diffs und Tests prüfen, statt still freizugeben.
- Alle Praxisbeispiele ausschließlich in einem frisch angelegten, wegwerfbaren Repository. Keine Force-Flags, produktiven Branches, Remote-Pushes oder Zugangsdaten.
- Tests führen Worktree, Cherry-Pick, Range-Diff und Rerere ausschließlich unter einem temporären Verzeichnis durch und entfernen es anschließend.

## Manuelle Review-Gates

1. Einsteiger: Begriffe Worktree, Commit-Serie, Herkunftsreferenz und Rerere werden vor ihrer ersten Verwendung erklärt.
2. Erfahrener: Sind die Alternativen realistisch, aber unter den genannten Voraussetzungen eindeutig falsch? Falls zwei Wege korrekt sind, Frage ändern.
3. Beide Übungen in einem separaten Verzeichnis ausprobieren, insbesondere Worktree-Lifecycle und Range-Diff-Ausgabe.
4. Rerere-Demonstration mit bewusst wiederholtem Konflikt durchführen; bei `rerere.autoupdate=false` muss das Staging gesondert erfolgen.
5. Mobil/Tastatur und Lesestand von Kapitel 01–07 überprüfen, Quiz-Feedback und Fortschritt exportieren/importieren.
6. Nach bestandenem CI und didaktischem Review den Draft-PR manuell freigeben; niemals automatisch mergen.
