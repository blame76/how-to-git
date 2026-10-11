# Teilen: Die Frage zählt, nicht die Erfolgszahl

## Produktverhalten

**Ein Klick**, ohne eigenes Dialogfenster. Wenn die Web Share API verfügbar ist, wird direkt die native Teilen-Funktion geöffnet. Sonst werden Frage, kurzer Projekthinweis und Link in die Zwischenablage kopiert; eine kleine Statusmeldung bestätigt das Kopieren. Nur falls beides technisch unmöglich ist, erscheint unter dem Button ein markierbares Textfeld.

Der Text lautet unabhängig vom Auslöser:

> Eine konkrete Frage zum Git-/GitHub-Thema.
>
> Eine Frage zum Weiterdenken. Mehr dazu im kostenlosen Lernprojekt How to Git & GitHub.
>
> Direkter Link zum Lerninhalt.

- **Je Schritt:** der vorhandene Quiz-Fragetext oder ein kurzer Hook aus der Überschrift; Link auf genau diesen Schritt.
- **Kapitelabschluss:** dieselbe schlichte Textform, mit einer Quizfrage aus dem Kapitel; Link zum **Kapiteleinstieg**. Die Fortschrittszahl (z. B. 25/25) bleibt auf der Seite sichtbar, ist aber **nicht Teil des geteilten Posts**.
- **Kursabschluss:** ebenfalls nur Frage + Projekthinweis + Link zur Kursstartseite; 181/181 wird auf der Lernseite gefeiert, nicht im Post.

Keine Antworten, Quiz-Ergebnisse oder Nutzerdaten werden mitgeschickt, keine lokalen Fortschrittswerte im Link, kein Tracking.

## Redaktionelle Qualität

Eine Quizfrage wird vollständig übernommen, auch wenn sie einen längeren Szenario-Kontext enthält. Bei Leseschritten formulieren wir einen Hook aus dem Titel. Optional kann ein Schritt `shareQuestion` enthalten, falls eine Redaktion den Hook gezielt verbessern möchte. Inhalt muss neugierig machen, ohne die Lösung zu verraten.

## Technische Grenzen

Die öffentliche URL ist zentral in `src/share.mjs` als `PUBLIC_COURSE_URL` hinterlegt. Sie muss beim Pages-Deployment stimmen. Die Share-Funktion ist bereits lokal testbar; ein Hinweisbanner zum noch unveröffentlichten Pages-Link ist absichtlich **nicht** enthalten.

Bei Hash-URLs wird der Fragmentteil `#/lektion/…` nicht an den Server geschickt. Social-Crawler erhalten dieselben Open-Graph-Metadaten wie für die Startseite. **Deeplink beim Klick: individuell. Automatische Linkvorschau: allgemein.** Auch über die Web Share API darf die Empfänger-App die vorformulierte `text`-Angabe ignorieren oder verändern; das liegt außerhalb unserer Kontrolle.

Pro-Abschnitt-OG-Karten wären ein separater Ausbau mit echten statischen Pfaden und passendem HTML je Pfad.

## Nicht-Ziele

Keine Social-SDKs, keine künstlichen Share-Anreize, kein Popup, keine Analytics, keine automatische Publikation, keine Accounts.
