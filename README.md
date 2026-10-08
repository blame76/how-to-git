# How to Git & GitHub

**Git verstehen. GitHub sinnvoll nutzen. Gemeinsam besser entwickeln.**

Eine deutschsprachige, interaktive Lernanwendung mit kurzen Lektionen, echten Entscheidungssituationen und optionalen Expertenfragen.

> **Status: Pilot / privat.** Die erste Lektion entsteht auf einem Feature-Branch. Eine Veröffentlichung über GitHub Pages erfolgt erst später und bewusst.

## Idee

Nicht Befehle auswendig lernen, sondern verstehen, welche Handlung in einer konkreten Situation sinnvoll ist. Wir trennen Git von GitHub, verknüpfen beides aber dort, wo Entwicklerinnen und Entwickler tatsächlich damit arbeiten.

- Einsteigerfreundlich und ohne vorausgesetzte Kommandozeilenkenntnisse
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

Der Pilot enthält **„Die vier Stationen einer Änderung“** mit Lernkontrollen und einer optionalen Expertenfrage. Weitere Module (Synchronisation, Branches, Pull Requests, Teamarbeit, Sicherheit und KI-Agenten) sind als Vorschau enthalten, aber bewusst noch nicht freigeschaltet.

## Projektentscheidungen

- **Vanilla HTML/CSS/JS** statt Framework
- **JSON** für redaktionell prüfbare Lerninhalte
- **LocalStorage** mit Versionierung, Export und Import
- **Review vor Merge**: Änderungen entstehen auf Feature-Branches
- **Kein automatisches Deployment** aus dem privaten Pilot-Repository

Lizenzentscheidung für Quellcode und Lerntexte steht noch aus. Bis dahin gilt keine ausdrückliche Wiederverwendungslizenz.
