# Lerninhalte erstellen

Die Inhalte liegen in `content/course.json`. Die technische Struktur wird mit `npm run validate` geprüft.

## Konzept

Jede Lerneinheit beginnt mit einem Problem und erklärt anschließend das erforderliche Denkmodell. Lernkontrollen prüfen Entscheidungen, nicht die Fähigkeit, Befehlsnamen zu erraten. Optional `type: "expert"` kennzeichnet eine vertiefende, nicht zum Pflichtfortschritt zählende Frage.

### Schrittformate

- `reading`: `id`, `title`, `body` (Absätze), optional `command` und `takeaway`
- `quiz` oder `expert`: `id`, `title`, `prompt`, `mode` (`single` oder `multiple`), `choices` mit eindeutigen IDs, `correct` als ID-Liste, `success`, `retry` und `explanations`

Wähle stabile IDs: Fortschritt wird je Modul und Schritt-ID gespeichert. Wenn eine Frage ihre Bedeutung fundamental ändert, braucht sie eine neue ID.

## Didaktischer Standard

Für Pflicht-Lernkontrollen gilt: Alles notwendige Fachwissen muss vorher vermittelt worden sein. Eine neue Anwendungssituation ist erwünscht, ein neuer Fachbegriff als versteckte Voraussetzung nicht. Optionale Expertenfragen dürfen über den bisherigen Stoff hinausgehen und sind als solche gekennzeichnet.

Vor der Freigabe jeder Frage prüfen wir fünf Punkte:

1. **Lernziel:** Welche Fähigkeit prüft die Frage?
2. **Vorwissen:** Wo wurde das notwendige Wissen zuvor erklärt?
3. **Eindeutigkeit:** Ist die beste Antwort unter den genannten Bedingungen zweifelsfrei bestimmbar?
4. **Distraktoren:** Können falsche Antworten mit dem bereits vermittelten Stoff begründet ausgeschlossen werden?
5. **Feedback:** Erklären wir auch bei Fehlern die Entscheidung, nicht nur das Resultat?
6. **Positionsbias:** Stimmt die Verteilung richtiger Antworten? Die Oberfläche mischt bei jedem Aufruf; auch die redaktionellen Quelldaten dürfen kein Muster wie „immer A“ enthalten.
7. **Plausibilität:** Sind die falschen Optionen realistische Fehlannahmen statt alberner Ablenkungen? Zufällige Reihenfolge behebt nur Positionsraten, nicht Fragen, die ohne fachliches Nachdenken trivial sind.

Lernkontrollen dienen dem Lernen, nicht einer Zertifizierung. Sie dürfen Transfer verlangen, aber keine nicht vermittelten Voraussetzungen. Siehe [LEARNING_PRINCIPLES.md](LEARNING_PRINCIPLES.md).

## Redaktioneller Review

1. Ist die Aussage fachlich korrekt und aktuell?
2. Werden relevante Voraussetzungen erklärt (z. B. lokal vs. remote, gestaged vs. committet)?
3. Sind alle Antwortoptionen plausibel und eindeutig bewertet?
4. Erklärt das Feedback, *warum* die Antwort richtig oder falsch ist?
5. Ist der Abschnitt ohne Vorwissen verständlich?
6. Sind Beispiele sicher und auf einem Übungsrepository nachvollziehbar?
7. Sind GitHub-spezifische Aussagen und Versionsabhängigkeiten mit offiziellen Quellen belegbar?

Quellen gehören bei einer späteren Erweiterung direkt zu den betroffenen Inhalten; die erste Pilotlektion verwendet nur stabile Git-Grundkonzepte. Referenz: https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
