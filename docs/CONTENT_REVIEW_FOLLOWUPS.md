# Fachliches Review – Follow-ups nach dem Pre-Release-Gate

Der Qualitätsreview vom 11.10.2026 durch ein zweites LLM hat acht Kapitel fachlich gesichtet; GitHub-Oberflächenangaben und echte Einsteiger-Nutzertests wurden dabei **nicht** vollständig geprüft.

## Im Release-Qualitäts-Branch korrigiert

- `git commit -am` kann einen Merge mit aufgelöstem Konflikt tatsächlich abschließen und prüft dabei keine Konfliktmarker. Konsequenz: Die bisherige fehlerhafte Falschantwort wurde ersetzt.
- Nicht gespeicherte Editor-Puffer erscheinen **nicht** in `git status`.
- `git range-diff`-Labor mit ausreichend ähnlichen zehnzeiligen Dateien und automatisierter Git-Ausführung; für dieses Beispiel erscheint `!`.
- Branch als Zeiger auf **einen** Commit erläutert; offene Änderungen beim Wechsel von Branches ausdrücklich erwähnt.
- Agent-Diff: `git diff`, `git diff --staged`, `git diff HEAD` und ungetrackte Dateien sauber unterschieden.
- Tags: in der Regel veränderbar, Ausnahme immutable releases gewürdigt.
- Normale/Nicht-Merge-Commits erklärt; Draft-PRs nicht als auf allen GitHub-Plänen verfügbar vorausgesetzt.
- Kapitel 4: Fragetitel an tatsächlichen Fall angepasst; Aufräumen nach Merge und Vorsicht bei Squash-Merge ergänzt.
- Schwierige Kapitel 6 und 7 als Vertiefung eingeordnet.

## Ergänzungen aus PR #11

- `git clone` und HTTPS-/SSH-Authentifizierung werden als Grundlagen in Kapitel 2 erklärt.
- `git commit --amend` ergänzt den sicheren Umgang mit dem letzten, noch nicht geteilten Commit in Kapitel 5.
- `git stash` ist als tatsächliche Vergleichsübung zu Worktrees in Kapitel 7 enthalten.
- Zwei Quizformulierungen und defekte Hash-Deeplinks wurden korrigiert; ergänzende Git- und Routing-Tests sichern diese Fälle.
- Die acht Kapitel behalten 181 Pflichtschritte und acht freiwillige Expertenfragen.

## Weitere didaktische Folgearbeiten

- Die neuen Grundlagen bei Bedarf mit einer vollständigen, anfängerfreundlichen interaktiven Klon-/Anmelde- und Amend-Übung vertiefen, *ohne* den Release zu blockieren. Für gepushte Rebase-Branches ist das Risiko und `--force-with-lease` bereits erläutert; eine gesonderte Übung bleibt optional.
- Multiple-Choice-Qualität: nur drei Antwortoptionen; auffällige Signalwörter wie „automatisch“ und „prüf…“, overly cautious correct answers; besseres Feedback bei häufig wiederholten Erklärungstexten; fragendes statt definitionsverratendes Wording. Alle 91 Fragen später redaktionell und gern mit echten Einsteigern prüfen.
- GitHub-UI- und Planspezifika gesondert gegen aktuelle Docs prüfen, bevor der Kurs öffentlich wird.
- Mobile, Tastatur, Screenreader und manuelle Nutzerstudie mit Menschen ohne Git-Erfahrung; automatisierte Validierung ersetzt das nicht.

**Keine** Änderung der Quiz-Antwortschlüssel außer dem redaktionellen Umbau der fehlerhaften Option. Das alte Falschwissen wird nicht fortgeschrieben.
