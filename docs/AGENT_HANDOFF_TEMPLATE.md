# Muster für eine begrenzte Coding-Agenten-Aufgabe

> Vorlage, keine ausführbare Agentenkonfiguration. Nur für ein eigenes Projekt und nach Prüfung der tatsächlichen Berechtigungen verwenden.

## Ziel und beobachtetes Problem

**Beobachtung:** Auf einem schmalen Bildschirm überlappt die Speichern-Schaltfläche den Preis.

**Erwartetes Ergebnis:** Die Schaltfläche ist ohne Überlappung sichtbar und bedienbar.

## Erlaubter Bereich

- Nur die für diesen Darstellungsfehler erforderlichen Frontend-Dateien untersuchen und ändern.
- Bestehende Architektur und Projektrichtlinien lesen.
- Änderung auf einem **eigenen Feature-Branch** oder isolierten Git-Arbeitsstand vorbereiten.

## Nicht beauftragt

- Kein Merge nach `main`, kein Deployment und kein Force-Push.
- Keine neuen Dependencies, keine Zugriffsrechte, keine Secrets und keine Änderungen an `.github/workflows/`.
- Keine beiläufige Umgestaltung anderer Komponenten und kein globales Aufräumen.
- Bestehende lokale Nutzeränderungen weder überschreiben noch in eigene Commits aufnehmen.

## Prüfungen und Abnahme

- Änderungsumfang mit `git status --short` und geeignetem Diff prüfen.
- Vorhandene relevante Tests ausführen; neue Tests nur im vereinbarten Scope ergänzen.
- Falls Browser-/Mobiltest nicht möglich: ausdrücklich als **nicht durchgeführt** kennzeichnen, keinen Erfolg behaupten.
- Akzeptanz: Die ursprüngliche Überlappung ist im genannten Szenario beseitigt; der Diff enthält nur begründete Änderungen.

## Stopp-Regel

**Wenn** neue Rechte, Secrets, Abhängigkeiten, produktive Einstellungen, Architekturentscheidungen oder Dateien außerhalb des Scopes nötig werden: **stoppen** und Begründung sowie Alternativen zur Entscheidung vorlegen. Nicht selbst erweitern.

## Übergabe – vom Agenten auszufüllen

- Ausgangsstand / Branch:
- Geänderte Dateien:
- Was wurde warum verändert?
- Befehle und tatsächliche Testresultate:
- Nicht durchgeführte Prüfungen:
- Bekannte Risiken und Annahmen:
- Link zu Draft-PR oder Commit-ID:
- Was muss der Mensch noch abnehmen?

**Wichtig:** Eine gute Antwort auf diesen Auftrag ist nicht automatisch eine Merge-Freigabe. Der tatsächlich ausgeführte Code, seine Rechte und die Freigaberegeln liegen außerhalb dieser Textvorlage.
