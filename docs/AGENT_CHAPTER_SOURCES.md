# Kapitel 08 – Git mit Coding-Agenten: Quellen und Review

**Stand: 11. Oktober 2026.** Diese Abschlusslektion soll langfristig gültige Arbeitsprinzipien vermitteln, keine feste Anleitung für eine bestimmte Version eines Agents. Anbieterfunktionen, Rechte und Ausführungsumgebungen können sich ändern.

## Fachliche Quellen

- [GitHub: Best practices for Copilot coding agent](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks): Abgegrenzte Aufgaben, Akzeptanzkriterien, Iteration und PRs.
- [GitHub: Review AI-generated code](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code): Tests, Kontext, Sicherheitsprüfung und menschliches Review.
- [GitHub: Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output): Agenten-PRs gründlich prüfen, Workflow-Freigaben und Grenzen automatisch ausgeführter Checks.
- [OpenAI: Codex prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide): Repository-Kontext und AGENTS.md als toolabhängige Anleitung.
- [OWASP: Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/): Übermäßige Berechtigungen, fremde Anweisungen, minimale Rechte und menschliche Freigaben.
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/): Sicherheitsrisiken agentischer Anwendungen und wirksame Grenzen.
- [Git: git-status](https://git-scm.com/docs/git-status), [git-diff](https://git-scm.com/docs/git-diff) und [git-worktree](https://git-scm.com/docs/git-worktree): Baseline, Patch-Review und getrennte Git-Arbeitsverzeichnisse.

## Grenzen der Aussagen

- **Kein Delegationsverbot:** Copy & Paste oder ein geprüftes Snippet kann für deterministische Routinen angemessener sein als ein Agent. Der Nutzen einer Agentenlösung hängt von Kontext, Umfang und überprüfbarem Ergebnis ab.
- **Kein Beweis für Kompetenzverlust:** Die freiwilligen Fingerübungen sind ein Lernangebot zur Selbstüberprüfung, keine wissenschaftlich belegte notwendige Quote oder Diagnose.
- **Kein vollständiger Nachhaltigkeitsnachweis:** Tool-Aufrufe, Hardware-Ressourcen, Zeitaufwand und Wartung können in die Abwägung einfließen; es wird keine pauschale Klima- oder Effizienzbilanz behauptet.
- **Worktree ≠ Sandbox:** Getrennter Git-Checkout begrenzt nicht automatisch Dateisystem-, Netzwerk- oder Tokenrechte.
- **AGENTS.md ≠ Rechtekontrolle:** Anleitungstexte helfen beim Kontext, aber technische Grenzen brauchen tatsächliche Berechtigungen.
- **Prompt Injection:** Fremde Issues, Dateien und Webseiten sind Informationsquellen, keine Autorisierung zur Herausgabe von Secrets oder Scope-Erweiterung.
- **Bericht ≠ Test:** Nur belegte Befehle, tatsächliche Ergebnisse und offen benannte Lücken zählen als Verifikation.
- **Agentenreview ≠ unabhängige Freigabe:** Ein zweites Modell kann kritisieren, aber nicht ohne nachvollziehbaren Beleg die menschliche Entscheidung ersetzen.
- **Übungen:** Ausschließlich im selbst angelegten temporären Übungsrepository, ohne Remote, Secrets oder riskante Rücksetzoperationen.

## Redaktioneller Review vor Merge

1. Ist die Entscheidung selbst/Snippet/Agent nachvollziehbar, ohne dass die Antwort immer „delegieren“ lautet?
2. Sind falsche Antwortoptionen typische nachvollziehbare Irrtümer statt offensichtliche Absurditäten? Auch eine alternative fachlich gültige Option wäre ein Fehler.
3. Sind Berechtigungs- und Review-Gates technisch richtig voneinander unterschieden?
4. Können zwei unabhängige Tests die beschriebene Git-Übung reproduzieren, ohne das lokale Produktivrepository zu verändern?
5. Funktionieren Lernfortschritt, Export/Import, Mobilnavigation und Tastaturbedienung über alle acht Kapitel?
6. Sind Tool-Namen, Versionen und Plattformunterschiede als Beispiele statt als universelle Regeln gekennzeichnet?
7. Bleibt der Abschluss wertschätzend gegenüber Menschen, die Copy & Paste oder Agenten bewusst nutzen?

**Non-Goals:** Kein installierbarer Agent, kein Zugriff auf GitHub-Secrets, keine Änderungen an Workflowrechten, kein automatischer Merge, kein Upload von persönlichen Daten, keine verpflichtende KI-Verwendung.
