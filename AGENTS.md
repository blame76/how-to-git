# Hinweise für Coding-Agenten

- Änderungen auf einem Feature-Branch vorbereiten, `main` nicht ungefragt verändern.
- Keine eigenmächtigen Merges, manuell ausgelösten Deployments, Force-Pushes oder Sichtbarkeitsänderungen. Das nach freigegebenen Änderungen auf `main` automatisch startende GitHub-Pages-Deployment ist erlaubt.
- Nur aufgabenbezogene Dateien stagen und vor Commits Änderungen prüfen; kein pauschales `git add .`.
- Sicherheit, Barrierefreiheit und local-only Speicherung erhalten.
- Lerninhalte redaktionell verstehen und mit den offiziellen Git-/GitHub-Dokumentationen abgleichen.
- Einsteigerfreundliche Sprache; niemals eine strittige Git-Präferenz als absolute Regel darstellen.
- Vor Übergabe: `npm test`, `npm run validate`, Browser-/Tastaturprüfung soweit möglich.
- **Persistence Gate:** Nach jeder größeren abgeschlossenen Änderung auf einem Feature-Branch committen, pushen und die Remote-Commit-SHA überprüfen. Ist der Push nicht möglich, sofort stoppen, den vollständigen Patch oder ein Git-Bundle außerhalb der flüchtigen Arbeitsumgebung sichern und die fehlende Übergabe ausdrücklich melden. Ein lokaler Commit oder ein Bericht allein ist keine abgeschlossene Übergabe.
- Freigaben, Rechte und Lizenzentscheidungen verbleiben beim Repository-Inhaber.
