# Qualitätsgate für Lernkontrollen

**Pilotstandard für alle Kapitel – Stand Oktober 2026.** Der automatisierte Check prüft Struktur und Antwortverteilung, nicht den tatsächlichen Lerngewinn. Dieser braucht Menschen.

## Zwei unabhängige Prüfungen

**Fachlich:** Sind alle Optionen unter den ausdrücklich angegebenen Voraussetzungen tatsächlich richtig oder falsch? Ein Distraktor darf keine ebenfalls gültige Lösung enthalten. Quellen und Befehlssemantik prüfen.

**Didaktisch:** Muss man das Lernziel verstehen, um zwischen plausiblen Handlungen zu wählen? Sind die Voraussetzungen vorher erklärt? Keine erfundenen Zwänge, sprachliche Fallen oder unbekannte Fachbegriffe als verdeckte Hürde.

## Redaktions-Check je Frage

1. **Lernziel und Quelle:** `learningObjective` und `sourceSections` beschreiben das zu prüfende Verständnis und verweisen auf vorherige Lesetexte.
2. **Klarer Kontext:** Situation, vorhandene Arbeit und gewünschtes Ergebnis sind verständlich. Keinen Befehl voraussetzen, ohne Zweck und Zeitpunkt klarzustellen.
3. **One Best Answer:** Unter den genannten Bedingungen gibt es genau eine beste Single-Choice-Antwort. Eine tatsächlich gleichwertige Alternative macht die Frage ungültig.
4. **Plausible Irrtümer:** Distraktoren bilden typische Verwechslungen ab (zum Beispiel `git branch` gegenüber `git switch -c`) – keine absurden Handlungen wie „Projekt löschen“ als offensichtliches Ausschlussmaterial.
5. **Gleichwertige Sprache:** Die richtige Lösung darf nicht immer allein durch Länge, Höflichkeit, vollständige Argumentation oder besonders vorsichtige Formulierungen auffallen.
6. **Kein Kniff:** Nicht mit „immer“, „ausnahmslos“ oder unnötigen Negationen tricksen. Schwierigkeit soll aus Git-Verständnis entstehen.
7. **Feedback:** Für jede Antwort erklärt `explanations[id]`, warum sie in genau dieser Situation richtig oder falsch ist. IDs bleiben stabil; die Anzeige darf mischen.
8. **Verteilung:** Richtige Optionen stehen in den Quelldaten nicht systematisch an derselben Position; die Oberfläche mischt zusätzlich. Positionsverteilung ersetzt aber nicht didaktische Qualität.
9. **Transfer:** Mindestens ein Fall je Kapitel erfordert eine konkrete Entscheidung und nicht nur das Erkennen eines Befehlsnamens.
10. **Gegenprobe:** Eine fachkundige Person versucht bewusst, alternative Antworten als ebenfalls korrekt zu begründen. Anschließend prüft eine Person ohne Git-Vorwissen Verständlichkeit und notwendiges Vorwissen.

## Beispiele aus dem Review von Kapitel 01–04

- Schlecht: „Für einen Branch brauchst du einen neuen GitHub-Account.“ Die Option ist so offensichtlich unsinnig, dass sie kaum Verständnis prüft.
- Besser: „`git branch feature/formular`“ neben „`git switch -c feature/formular`“; beide sind sinnvolle Git-Befehle, aber nur der zweite erstellt den Branch **und** wechselt sofort dorthin.
- Schlecht: „`git reset --merge` ist immer die sicherste Lösung“. Die Übertreibung verrät den Ablenker und kann eine technisch in manchen Fällen funktionierende Alternative verdecken.
- Besser: „`git merge --quit`“ neben „`git merge --abort`“; beide sind real, doch nur der zweite versucht den Zustand vor dem Merge wiederherzustellen.

## Grenze der Automatisierung

Die CI kann ungültige IDs, fehlendes Feedback, Referenzen auf spätere Lesetexte und einseitige Antwortpositionen erkennen. Sie kann aber weder eine zweite fachlich richtige Option zuverlässig ausschließen noch die Schwierigkeit für einen Einsteiger messen. Deshalb bleibt ein manueller Review vor jedem Merge Pflicht.
