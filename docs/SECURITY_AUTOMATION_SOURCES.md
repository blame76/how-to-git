# Kapitel 06 – Sicherheit & Automation: Quellen und Review

**Stand: 11. Oktober 2026.** Kapitel 06 vermittelt stabile Sicherheitsprinzipien in GitHub und GitHub Actions. GitHub-spezifische Einstellungen, Berechtigungen und Produktverhalten können sich ändern; deshalb sind offizielle Referenzen verlinkt. Fachliches Review ist von der didaktischen Kontrolle gemäß [QUIZ_QUALITY_GATE.md](QUIZ_QUALITY_GATE.md) zu unterscheiden.

## Herstellerdokumentation: GitHub

- [Workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows): Workflow als YAML-Datei in `.github/workflows`, Ereignisse, Jobs, Steps und Runner.
- [GitHub Actions – Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax): `on: pull_request`, `permissions`, `jobs`, `steps`.
- [GITHUB_TOKEN verwenden](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token): Tokenzugriff und Least Privilege über Workflow-/Job-`permissions`. Tokens können Actions auch ohne ausdrückliche Übergabe zugänglich sein.
- [Secrets](https://docs.github.com/en/actions/concepts/security/secrets) und [Using secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets): Scope, Maskierung als zusätzliche Schutzschicht, Geheimnisse in Fork-PRs standardmäßig zurückgehalten.
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use): Keine Secrets im Quellcode/Logs, Action-Versionen als vollständige SHA festlegen und Quelle prüfen.
- [Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target): Unterschied zwischen PR-Prüfungen und privilegierten Events; fremden Code nicht mit Secrets/elevierten Rechten ausführen.
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) und [Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets): Pflichtchecks und menschliche Freigaben sind konfigurierbare Regeln.
- [GitHub Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository): abweichende Fork-/Privatrepository-Policies und Token-Rechte.

## Unabhängiger fachlicher Abgleich

- [OWASP – CI/CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html): Pipeline-Isolierung, Secrets, Sicherheitsreview und Least Privilege.
- [OWASP – Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html): Schutz und Rotation kompromittierter Zugangsdaten.
- [OpenSSF Scorecard](https://github.com/ossf/scorecard): Checks zu Token Permissions, Pinning und gefährlichen Workflows; Bewertung ersetzt keinen eigenen Review.

## Sicherheits- und didaktische Grenzen

- Ein privates Repository ist kein Secrets-Tresor. Bereits committete echte Zugangsdaten müssen widerrufen/ersetzt werden.
- `.gitignore` entfernt keine bereits getrackten Geheimnisse aus Commits.
- Die Beispiel-YAML liegt nur als **Dokumentation** unter `docs/examples/` und wird durch dieses Repository **nicht als Workflow aktiviert**.
- Das Beispiel verwendet `pull_request`, `permissions: contents: read`, einen GitHub-gehosteten Runner und einen ungefährlichen `echo`-Schritt. Es verwendet keinerlei Tokens als Klartext, Secrets oder Deployment.
- `GITHUB_TOKEN`-Zugriffsrechte hängen auch von Ereignis, Policy und Repository-Einstellungen ab; explizite Minimierung bleibt sinnvoll.
- Bei Fork-PRs stehen Secrets normalen `pull_request`-Workflows standardmäßig nicht zur Verfügung; `pull_request_target` hat ein anderes Vertrauensmodell.
- SHA-Pinning externer Actions macht die ausgeführte Version nachvollziehbar, garantiert aber nicht deren Sicherheit.
- Ein grüner Status kann ein reiner Textlauf sein: er beweist nicht die Sicherheit des PRs.
- Nur eine menschliche Prüfung kann entscheiden, ob auch plausible falsche Antwortoptionen eindeutig falsch sind.

## Review-Gate vor Merge

1. Alle zwölf Pflichtfragen aus dem vorhergehenden Lesetext beantworten und Gegenargumente für scheinbar falsche Lösungen finden.
2. Einsteigerperspektive: Sind „Action“, „Runner“, „Job“, „Step“, „Secret“ und „Token“ jeweils verständlich eingeführt?
3. Das YAML-Beispiel auf korrekte Rechte, Event und ungefährliche Steps prüfen (ohne Deployment oder echte Secrets).
4. Bereits erlernte Git-/GitHub-Abläufe zu Kapitel 01–05 weiterhin erreichen, vorhandene Lesepositionen und Export/Import testen.
5. Desktop/Mobil und Tastatur/Fokus/Screenreader manuell prüfen. CI grün reicht nicht für einen Merge.
6. Keine Änderungen an produktiven `.github/workflows`, Branch-Schutzregeln oder Repository-Secrets ohne separate explizite Freigabe.
