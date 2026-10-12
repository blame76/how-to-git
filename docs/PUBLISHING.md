# Veröffentlichungs-Checkliste · How to Git & GitHub

**Status:** Veröffentlichung ist technisch und redaktionell vorbereitet. Ein Deployment erfolgt nur nach manueller Freigabe.

## Zwingende Freigaben vor dem Livegang

1. **Kontaktangaben:** Name, Anschrift und E-Mail in `impressum.html` und `datenschutz.html` stammen aus dem bereits öffentlichen [Impressum von blame76.com](https://blame76.com/impressum/) (Abruf: 11.10.2026). Vor Livegang sicherstellen, dass die Angaben weiterhin stimmen und die Darstellung als privates, kostenloses Projekt zutrifft. Sollten geschäftsmäßige Angebote hinzukommen, die erforderlichen Pflichtangaben erneut prüfen.
2. Rechtliche Seiten sind ohne Entwurfskennzeichen angelegt; `npm run publish:check` schützt gegen das versehentliche Wiedereinführen von Platzhaltern oder Entwurfsvermerken. Eine automatisierte Rechtsprüfung ist das nicht.
3. Die Datenschutzhinweise beschreiben GitHub Pages, lokale Fortschrittsspeicherung und E-Mail-Kontakt. Bei Änderungen an Hosting, Tracking oder Kontaktwegen müssen sie erneut geprüft werden.
4. Den Kurs mit Einsteigern und auf dem Smartphone testen, speziell Fragen, Navigation, Fortschrittsimport/-export und Rückkehrlinks.
5. Die **MIT-Lizenz** gilt für eigenen Quellcode und selbst erstellte Lerntexte/Dokumentation (siehe `LICENSE`). Vor Umstellung auf Public sämtliche Branches, Git-Historie und Actions-Logs auf vertrauliche Daten und fremde Materialien prüfen. Auch bei privatem Repository sind GitHub-Pages-Websites öffentlich zugänglich (wenn Pages für den Plan verfügbar ist).
6. Derzeit erwartete URL: `https://blame76.github.io/how-to-git/` – nach der Konfiguration überprüfen. Metadaten und `llms.txt` sind aktuell auf diese URL ausgerichtet.

## Technische Prüfung

```bash
npm run check
npm run publish:check
npm run build:pages
```

`npm run publish:check` muss ohne Entwurfskennzeichnungen erfolgreich durchlaufen. Die normalen CI-Tests prüfen zusätzlich die Lerninhalte.

## Release-Ablauf

1. Änderungen auf einem Feature-Branch mit fachlichem Review und grüner CI prüfen, erst dann nach `main` mergen.
2. `courseVersion`, Paketversion, sichtbare Versionsanzeige und `CHANGELOG.md` auf denselben geplanten Stand bringen; beim Release das Veröffentlichungsdatum im Changelog nachtragen.
3. GitHub Pages **manuell** von `main` aus veröffentlichen. Die Versionsanzeige, ein Kurs-Deep-Link, der lokale Lernfortschritt und bei Metadatenänderungen die Linkvorschau sind live zu prüfen.
4. Erst nach erfolgreichem Live-Smoke-Test ein unveränderliches Tag `vX.Y.Z` und ein GitHub-Release zum **genau veröffentlichten Commit** anlegen. Release-Notizen sollen die für Lernende relevanten Änderungen zusammenfassen.
5. Fehlerhafte Deployments nicht durch verschobene Tags kaschieren; einen geprüften vorherigen Stand erneut deployen oder eine neue Korrekturversion veröffentlichen.

Kein automatisches Tagging, Mergen oder Deployment.

## GitHub Pages bei Freigabe

- Je nach Plan muss das Repository öffentlich gemacht oder der Tarif angepasst werden. Bei GitHub Free sind Pages in öffentlichen Repositories verfügbar; bei GitHub Pro auch in privaten. Auch bei privater Codebasis ist die Pages-Website grundsätzlich öffentlich. Aktuelle Rechte/Einstellungen prüfen.
- In GitHub unter **Settings → Pages → Build and deployment → Source: GitHub Actions** wählen.
- Workflow `.github/workflows/pages.yml` ist **nur manuell** auslösbar (`workflow_dispatch`) und auf `main` beschränkt. Erst nach bewusster Freigabe über **Actions → GitHub Pages – manuelle Veröffentlichung → Run workflow** starten.
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
