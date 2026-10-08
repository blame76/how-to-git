# Lerninhalte erstellen

Die Inhalte liegen in `content/course.json`. Die technische Struktur wird mit `npm run validate` geprüft.

## Konzept

Jede Lerneinheit beginnt mit einem Problem und erklärt anschließend das erforderliche Denkmodell. Lernkontrollen prüfen Entscheidungen, nicht die Fähigkeit, Befehlsnamen zu erraten. Optional `type: "expert"` kennzeichnet eine vertiefende, nicht zum Pflichtfortschritt zählende Frage.

### Schrittformate

- `reading`: `id`, `title`, `body` (Absätze), optional `command` und `takeaway`
- `quiz` oder `expert`: `id`, `title`, `prompt`, `mode` (`single` oder `multiple`), `choices` mit eindeutigen IDs, `correct` als ID-Liste, `success`, `retry` und `explanations`

Wähle stabile IDs: Fortschritt wird je Modul und Schritt-ID gespeichert. Wenn eine Frage ihre Bedeutung fundamental ändert, braucht sie eine neue ID.

## Redaktioneller Review

1. Ist die Aussage fachlich korrekt und aktuell?
2. Werden relevante Voraussetzungen erklärt (z. B. lokal vs. remote, gestaged vs. committet)?
3. Sind alle Antwortoptionen plausibel und eindeutig bewertet?
4. Erklärt das Feedback, *warum* die Antwort richtig oder falsch ist?
5. Ist der Abschnitt ohne Vorwissen verständlich?
6. Sind Beispiele sicher und auf einem Übungsrepository nachvollziehbar?
7. Sind GitHub-spezifische Aussagen und Versionsabhängigkeiten mit offiziellen Quellen belegbar?

Quellen gehören bei einer späteren Erweiterung direkt zu den betroffenen Inhalten; die erste Pilotlektion verwendet nur stabile Git-Grundkonzepte. Referenz: https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
