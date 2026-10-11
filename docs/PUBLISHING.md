# Veröffentlichungs-Checkliste · How to Git & GitHub

**Status:** technisch vorbereitet, nicht freigegeben. Im Repository wird nichts automatisch veröffentlicht.

## Zwingende Freigaben vor dem Livegang

1. In `impressum.html` und `datenschutz.html` den Namen/Betreiber prüfen und alle Platzhalter `[[POSTAL_ADDRESS]]`, `[[POSTAL_CITY]]`, `[[CONTACT_EMAIL]]` durch eigene, zur Veröffentlichung freigegebene Kontaktdaten ersetzen. Eine **ladungsfähige Anschrift** verwenden – nicht bloß Postfach. Bei Unternehmen oder einem geschäftsmäßigen Auftritt prüfen, welche weiteren Angaben nach § 5 DDG erforderlich sind.
2. In beiden HTML-Dateien die Entwurfskennzeichnung entfernen. Ebenso `<meta name="robots" content="noindex, nofollow">` entfernen, **nachdem** die Seiten überprüft wurden.
3. Den Datenschutzhinweis für das reale Hosting und den aktuellen Funktionsumfang prüfen, einschließlich Drittlandverarbeitung, Anbieterrolle und Aufbewahrung der GitHub-Pages-Zugriffsdaten. Bei neuen Tracking-/Kontaktfunktionen erneut prüfen.
4. Den Kurs mit Einsteigern und auf dem Smartphone testen, speziell Fragen, Navigation, Fortschrittsimport/-export und Rückkehrlinks.
5. Entschieden: Lizenz für Quellcode und Lerninhalte sowie Freigabe für öffentlich einsehbaren Repository-Inhalt. Auch bei privatem Repository sind GitHub-Pages-Websites öffentlich zugänglich (wenn Pages für den Plan verfügbar ist).
6. Derzeit erwartete URL: `https://blame76.github.io/how-to-git/` – nach der Konfiguration überprüfen. Metadaten und `llms.txt` sind aktuell auf diese URL ausgerichtet.

## Technische Prüfung

```bash
npm run check
npm run publish:check
npm run build:pages
```

`npm run publish:check` **muss absichtlich fehlschlagen**, solange Platzhalter oder Entwurfskennzeichnungen vorhanden sind. Die normalen CI-Tests prüfen trotzdem weiter alle Lerninhalte.

## GitHub Pages bei Freigabe

- Je nach Plan muss das Repository öffentlich gemacht oder der Tarif angepasst werden. Bei GitHub Free sind Pages in öffentlichen Repositories verfügbar; bei GitHub Pro auch in privaten. Auch bei privater Codebasis ist die Pages-Website grundsätzlich öffentlich. Aktuelle Rechte/Einstellungen prüfen.
- In GitHub unter **Settings → Pages → Build and deployment → Source: GitHub Actions** wählen.
- Workflow `.github/workflows/pages.yml` ist **nur manuell** auslösbar (`workflow_dispatch`) und auf `main` beschränkt. Nach Kontrolle der Kontaktdaten über **Actions → GitHub Pages – manuelle Veröffentlichung → Run workflow** starten.
- Der Workflow führt Kurs-Tests und rechtliche Vollständigkeitsprüfung aus; erst anschließend wird das reine statische Bundle aus `dist/` publiziert.
- Nach Livegang Startseite, Impressum, Datenschutz, Deep-Links, `sitemap.xml`, `llms.txt`, `content/course.json` und Social-Link-Vorschau prüfen.
- Kein automatisches Deploy durch Push oder Merge; zur Deaktivierung muss Pages in den Repository-Einstellungen entsprechend zurückgesetzt werden.

## Keine falschen SEO-Versprechen

Unsere URL-Navigation basiert auf `#/lektion/…`. Suchmaschinen-/Social-Crawler behandeln diese Hash-Routen nicht als eigenständige Seiten mit separaten Metadaten. `index.html` trägt die **allgemeine** Vorschau. `llms.txt` und JSON-LD können maschinelle Systeme unterstützen, begründen aber kein garantiertes Ranking.

## Quellen (Stand Oktober 2026)

- [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html)
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [GitHub Pages: Data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
