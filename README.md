# How to Git & GitHub

**Git verstehen. GitHub sinnvoll nutzen. Gemeinsam besser entwickeln.**

Eine deutschsprachige, interaktive Lernanwendung mit kurzen Lektionen, echten Entscheidungssituationen und optionalen Expertenfragen.

> **Status: Lernpilot.** Acht Kapitel, lokale Fortschrittsspeicherung und eine manuell gesteuerte Veröffentlichung über GitHub Pages.

## Idee

Nicht Befehle auswendig lernen, sondern verstehen, welche Handlung in einer konkreten Situation sinnvoll ist. Wir trennen Git von GitHub, verknüpfen beides aber dort, wo Entwicklerinnen und Entwickler tatsächlich damit arbeiten.

- Einsteigerfreundlich und ohne vorausgesetzte Kommandozeilenkenntnisse
- Einsteiger-Einführung („Schon mal eine Datei kaputtverbessert?“) vor dem ersten Kapitel
- Direkt anwählbare Abschnitte, mobil aufklappbare Kapitelübersicht und stabile Abschnitts-Links
- Wissensfragen zwischen den Abschnitten, Feedback direkt nach der Antwort
- Freiwillige Expertenfragen für erfahrene Git-Nutzer
- Lernfortschritt ausschließlich im Browser (mit Export/Import)
- Kein Login, keine Telemetrie, kein Backend

## Gestaltung

Die Anwendung folgt dem Prinzip eines **redaktionellen Lernjournals**, nicht eines Dashboards: typografische Kapitel, nummerierter Lernpfad, wenige gezielte Farbakzente und Lernkontrollen direkt im Lesefluss. Die Gestaltungs- und Barrierefreiheitsregeln stehen in [docs/DESIGN_PRINCIPLES.md](docs/DESIGN_PRINCIPLES.md).

## Lokal starten

Voraussetzung: Node.js 20 oder neuer für Tests; die Anwendung selbst benötigt nur einen aktuellen Browser.

```bash
git clone https://github.com/blame76/how-to-git.git
cd how-to-git
python3 -m http.server 8000
```

Danach http://localhost:8000/ öffnen. Ein HTTP-Server ist notwendig, weil die Lerninhalte mit `fetch()` geladen werden.

## Prüfen

```bash
npm test
npm run validate
```

Es werden keine npm-Pakete installiert. Die Tests nutzen die Node.js-Standardbibliothek.

## Mitmachen

Korrekturen, gute Praxisfälle und unverständliche Stellen sind genauso wertvoll wie Code. Siehe [CONTRIBUTING.md](CONTRIBUTING.md). Für inhaltliche Ergänzungen siehe [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md).

## Lernpfad

Der Lernpfad umfasst **acht Kapitel**: 01 Die vier Stationen einer Änderung, 02 Synchronisieren ohne Überraschungen, 03 Branches/Merge/Rebase, 04 GitHub im Team, 05 Fehler retten statt vertuschen, 06 Sicherheit & Automation, 07 Werkzeuge für Git-Hasen und **08 Git mit Coding-Agenten**. Alle acht Kapitel haben unabhängig gespeicherten Lernfortschritt, kurze Lernkontrollen und optionale Expertenfragen. Kapitel 08 schließt den geplanten Pilot-Lernpfad ab.

## SEO & Auffindbarkeit (vor der Veröffentlichung)

Die Startseite hat allgemeine Metadaten für Suchmaschinen und Linkvorschauen (Open Graph, Twitter-Card, Canonical, JSON-LD als `WebSite` und `Course`). `llms.txt` verzeichnet Inhalte und verweist auf den Kursdatenbestand; `sitemap.xml` führt derzeit ausschließlich die kanonische Startseite. **Keine Share-Buttons, keine zusätzlichen Teil-Erfolgs-Karten, kein Tracking.**

Die bestehenden Hash-URLs sind keine einzeln indexierbaren Seiten; Social-Crawler sehen für alle Abschnitte dieselben allgemeinen Metadaten. Es gibt noch kein eigenes Social-Preview-Bild. Nach der Veröffentlichung sollten Indexierung und Vorschau real geprüft werden.

## Projektentscheidungen

- **Vanilla HTML/CSS/JS** statt Framework
- **JSON** für redaktionell prüfbare Lerninhalte
- **LocalStorage** mit Versionierung, letzter Leseposition, Export und Import
- **Review vor Merge**: Änderungen entstehen auf Feature-Branches
- **Kein automatisches Deployment** – Veröffentlichung nur nach bewusster Freigabe

**Lizenz: MIT** für den selbst erstellten Quellcode, die Kursinhalte und die Dokumentation dieses Repositories; ausgenommen sind fremde Inhalte und verlinkte Materialien. Siehe [LICENSE](LICENSE). Die Lizenz erlaubt ausdrücklich auch kommerzielle Weiterverwendung bei Beibehaltung des Urheberrechts- und Lizenzhinweises.

## Veröffentlichung vorbereiten

Das Projekt enthält Impressum und Datenschutzhinweise für das Hosting über GitHub Pages. `npm run publish:check` prüft, ob Entwurfskennzeichen oder Platzhalter vorhanden sind. Ein Deployment erfolgt ausschließlich nach manueller Freigabe über den Pages-Workflow auf `main`.

Checkliste und Datenschutz-/Hostinghinweise: [docs/PUBLISHING.md](docs/PUBLISHING.md).

Vor Publikation die Tests (`npm run check`) und die Kontaktangaben prüfen. Der Lernfortschritt bleibt lokal; GitHub Pages protokolliert Besucher-IP-Adressen zu Sicherheitszwecken.

## Danksagung

Danke an Linus Torvalds, Junio C Hamano und die vielen Menschen hinter Git; an die Teams und Mitwirkenden von GitHub, GitHub Pages, GitHub Actions, Node.js und offenen Webstandards. Ein besonderer Dank gilt **ChatGPT (OpenAI)** für die Unterstützung bei der Umsetzung und die intensiven Gespräche über Git, Didaktik und Lernen. Die Verantwortung für die Veröffentlichung liegt beim Projektinhaber.
