# Teilen: Ein Lernmoment statt eines Werbebanners

## Produktverhalten

Ein Share-Link führt immer zu einem **stabilen Abschnitt** des Lernpfads (oder beim Kursabschluss zur Startseite). Der Text enthält keine Lösungen und keine persönlichen Datensätze. Die Teilenden können den Vorschlag im Dialog verändern.

- **Jeder Schritt:** „Eine Git-Frage aus Kapitel NN …“ + eine zur Stelle passende Frage.
- **Kapitel voll:** „Kapitel NN geschafft: 12 / 12 Schritte“ + Frage + Link zum Kapitel.
- **Kurs voll:** „181 / 181 Schritte“ (dynamisch berechnet) + Frage + Link zum Kurs.

Korrekte Antworten, Quiz-Ergebnisse, Nutzernamen und Inhalte von `localStorage` bleiben privat. Kein Tracking, keine Sharer-IDs, keine versteckten Queryparameter.

## Redaktionelle Qualität

Standardmäßig recycelt die Anwendung den Fragetext eines Quiz oder formuliert anhand des Abschnittstitels einen kurzen Hook. Gute Hooks sollen neugierig machen, **keine Antwort verraten**.

Für wichtige Stellen kann ein Lernschritt optional `shareQuestion` enthalten, etwa:

```json
"shareQuestion": "Würdest du hier fetch oder pull verwenden?"
```

Das ist bewusst reine redaktionelle Metadatenpflege: weder Social-API noch Bildgenerator sind erforderlich. Bei neuen Lektionen prüfen, ob der generierte Hook zum Inhalt passt.

## Vor Veröffentlichung

Die Zieladresse ist in `src/share.mjs` als `PUBLIC_COURSE_URL` konfiguriert, derzeit `https://blame76.github.io/how-to-git/`. Das ist ein **geplantes Ziel**, noch kein Nachweis einer aktiven Seite.

Im lokalen Browser zeigt der Dialog einen Warnhinweis und bietet nur **Entwurf kopieren**. Native Systemfreigabe wird erst auf der konfigurierten HTTPS-Pages-Adresse angeboten. Prüfe vor Veröffentlichung, dass der echte Deploymentpfad zur Konfiguration passt.

GitHub Pages ist bei Veröffentlichung statisch: Alle geteilten Hash-Routen verwenden die gleichen Open-Graph-Metadaten wie die Startseite. **Individuelle Vorschaukarten pro Abschnitt sind mit dem aktuellen reinen Hash-Routing nicht möglich**. Unterschiedliche Texte entstehen beim Teilen; nicht beim Social-Crawler. Dafür wären später echte statische Pfade und eigene Metadaten erforderlich.

## Nicht-Ziele

Keine Analytics-Pixel, keine täglichen Streaks, keine automatische Aufforderung zu posten, kein serverseitiger Fortschritt, keine Social-Login-Pflicht.
