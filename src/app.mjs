import {
  STORAGE_KEY, emptyProgress, sanitizeProgress, completeStep,
  isComplete, lessonProgress, resumeIndex
} from "./progress.mjs";

const app = document.querySelector("#app");
let course;
let progress;
let storageAvailable = true;

function element(tag, className = "", value = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  return node;
}

function append(parent, ...children) { parent.append(...children); return parent; }
function paragraph(value, className = "") { return element("p", className, value); }
function button(label, className = "btn", action) {
  const node = element("button", className, label);
  node.type = "button";
  if (action) node.addEventListener("click", action);
  return node;
}
function link(label, target, className = "") {
  const node = element("a", className, label);
  node.href = target;
  return node;
}

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? sanitizeProgress(JSON.parse(value), course) : emptyProgress();
  } catch {
    // The course stays usable when private mode or blocked storage disallows persistence.
    storageAvailable = false;
    return emptyProgress();
  }
}

function saveStored() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
}

function markStep(moduleId, stepId) {
  progress = completeStep(progress, moduleId, stepId);
  saveStored();
}

function goTo(moduleId, index) {
  window.location.hash = "#/lektion/" + encodeURIComponent(moduleId) + "/" + index;
  render();
  window.scrollTo(0, 0);
}

function heading(kicker, title, lead) {
  const region = element("section", "hero");
  append(region, paragraph(kicker, "eyebrow"), element("h1", "", title), paragraph(lead, "lead"));
  return region;
}

function progressIndicator(stats) {
  const outer = element("div", "progress-line");
  outer.setAttribute("role", "progressbar");
  outer.setAttribute("aria-label", "Pflichtschritte abgeschlossen");
  outer.setAttribute("aria-valuemin", "0");
  outer.setAttribute("aria-valuemax", String(stats.total));
  outer.setAttribute("aria-valuenow", String(stats.done));
  const inner = element("span");
  inner.style.width = stats.percent + "%";
  outer.append(inner);
  return outer;
}

function exportProgress() {
  const file = new Blob([JSON.stringify(progress, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = "how-to-git-fortschritt.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importProgress(file) {
  if (!file) return;
  if (file.size > 200_000) {
    window.alert("Die Datei ist zu groß für einen Lernfortschritt.");
    return;
  }
  try {
    const parsed = JSON.parse(await file.text());
    const validated = sanitizeProgress(parsed, course);
    if (!window.confirm("Den bisherigen Lernfortschritt auf diesem Gerät ersetzen?")) return;
    progress = validated;
    saveStored();
    render();
  } catch (error) {
    window.alert("Import fehlgeschlagen: " + error.message);
  }
}

function renderHome() {
  document.title = "How to Git & GitHub – Lernpfad";
  const module = course.modules[0];
  const stats = lessonProgress(module, progress);
  const hero = heading(
    "Interaktiv lernen · Kein Vorwissen nötig",
    "Git verstehen. Nicht nur Befehle kennen.",
    "Warum sind meine Änderungen noch nicht auf GitHub? Was gehört in einen Commit? Und wie arbeiten wir zusammen, ohne uns gegenseitig zu blockieren?"
  );
  const actions = element("div", "hero__actions");
  const start = button(stats.done ? "Lernen fortsetzen →" : "Erste Lektion starten →", "btn btn--primary",
    () => goTo(module.id, resumeIndex(module, progress)));
  append(actions, start, link("Wie funktioniert der Kurs?", "#/ueber", "btn btn--subtle"));
  hero.append(actions);
  app.append(hero);

  const panel = element("section", "progress-panel");
  const info = element("div", "progress-panel__info");
  append(info, element("strong", "", "Dein Lernstand"), progressIndicator(stats),
    paragraph(stats.done + " von " + stats.total + " Pflichtschritten abgeschlossen", "small muted"));
  const utilities = element("div", "utilities");
  const upload = document.createElement("input");
  upload.type = "file";
  upload.accept = "application/json,.json";
  upload.hidden = true;
  upload.setAttribute("aria-label", "Gesicherten Lernfortschritt importieren");
  upload.addEventListener("change", () => {
    importProgress(upload.files?.[0]);
    upload.value = "";
  });
  append(utilities, button("Exportieren", "btn btn--subtle", exportProgress),
    button("Importieren", "btn btn--subtle", () => upload.click()), upload);
  append(panel, info, utilities);
  app.append(panel);
  if (!storageAvailable) app.append(paragraph("Hinweis: Der Browser erlaubt derzeit keine dauerhafte Speicherung. Du kannst trotzdem lernen und deinen Stand exportieren.", "state-hint"));

  const title = element("div", "section-heading");
  append(title, element("h2", "", "Dein Lernpfad"), element("span", "mini-tag", "Ein Kurs. Viele Aha-Momente."));
  app.append(title);
  const grid = element("div", "course-grid");
  const card = element("article", "card card--feature");
  const copy = element("div");
  append(copy, paragraph("01 / Pilotlektion", "card__label"), element("h3", "", module.title), paragraph(module.description));
  const open = button(stats.done === stats.total ? "Wiederholen →" : "Zur Lektion →", "btn", () => goTo(module.id, resumeIndex(module, progress)));
  append(copy, open);
  append(card, copy, element("div", "card__number", "01"));
  grid.append(card);
  for (const planned of course.plannedModules) {
    const tile = element("article", "card card--disabled");
    append(tile, paragraph("In Vorbereitung", "card__label"), element("h3", "", planned.title), paragraph(planned.description));
    grid.append(tile);
  }
  app.append(grid);
}

function renderAbout() {
  document.title = "Über den Kurs – How to Git & GitHub";
  const section = heading("Die Idee", "Verstehen vor Auswendiglernen.",
    "Dieser Kurs erzählt Git aus der Perspektive echter Entscheidungen, nicht als Befehlslexikon.");
  const copy = element("div", "about-copy");
  append(copy,
    paragraph("Kurze Abschnitte erklären ein Konzept. Direkt danach triffst du eine Entscheidung. Du bekommst Feedback, das die Konsequenzen erklärt – auch bei falschen Antworten."),
    paragraph("Es gibt keine Ranglisten und keine Pflichtregistrierung. Expertenfragen sind freiwillig. Du bestimmst dein Tempo."),
    paragraph("Dein Fortschritt wird ausschließlich in diesem Browser gespeichert. Export und Import funktionieren als JSON-Datei. Wir laden deinen Fortschritt nicht auf einen Server hoch."),
    paragraph("Der Kurs ist ein früher Pilot. GitHub Pages ist noch nicht veröffentlicht. Fehler und unklare Erklärungen freuen sich über ein Issue im Repository.")
  );
  append(section, copy, link("← Zurück zum Lernpfad", "#/", "btn"));
  app.append(section);
}

function feedbackBox(success, step, selected) {
  const box = element("div", success ? "feedback feedback--success" : "feedback");
  box.setAttribute("role", "status");
  append(box, element("h3", "", success ? "Richtig eingeordnet." : "Noch nicht ganz."),
    paragraph(success ? step.success : step.retry));
  for (const id of selected) {
    if (step.explanations?.[id]) box.append(paragraph(step.explanations[id], "small"));
  }
  return box;
}

function renderQuestion(container, module, step, nextButton) {
  append(container, paragraph(step.prompt));
  if (step.mode === "multiple") container.append(paragraph("Mehrere Antworten können richtig sein.", "small muted"));
  else container.append(paragraph("Wähle eine Antwort.", "small muted"));
  const form = element("form");
  const options = element("div", "quiz-options");
  const inputName = "answer-" + step.id;
  for (const choice of step.choices) {
    const label = element("label", "quiz-option");
    const input = document.createElement("input");
    input.type = step.mode === "multiple" ? "checkbox" : "radio";
    input.name = inputName;
    input.value = choice.id;
    append(label, input, element("span", "", choice.text));
    options.append(label);
  }
  const submit = element("button", "btn btn--primary", "Antwort prüfen");
  submit.type = "submit";
  const result = element("div");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const selected = [...form.querySelectorAll("input:checked")].map(input => input.value);
    if (!selected.length) {
      result.replaceChildren(paragraph("Bitte wähle zuerst eine Antwort.", "state-hint"));
      return;
    }
    const success = selected.length === step.correct.length &&
      selected.every(id => step.correct.includes(id));
    result.replaceChildren(feedbackBox(success, step, selected));
    if (success) {
      markStep(module.id, step.id);
      nextButton.disabled = false;
      submit.disabled = true;
      for (const input of form.querySelectorAll("input")) input.disabled = true;
    }
  });
  append(form, options, submit, result);
  container.append(form);
  if (isComplete(progress, module.id, step.id)) {
    container.append(paragraph("Diesen Schritt hast du bereits abgeschlossen. Du kannst ihn erneut beantworten.", "state-hint"));
  }
}

function renderLesson(module, index) {
  if (!Number.isInteger(index) || index < 0 || index >= module.steps.length) {
    window.location.hash = "#/";
    renderHome();
    return;
  }
  const step = module.steps[index];
  document.title = step.title + " – How to Git & GitHub";
  const top = element("div", "lesson-top");
  append(top, link("← Alle Lektionen", "#/"), element("span", "mini-tag", "Lektion 01 · " + module.duration));
  app.append(top);
  const layout = element("div", "lesson-layout");
  const main = element("article", "lesson-main");
  const stats = lessonProgress(module, progress);
  append(main, paragraph(step.type === "expert" ? "Bonus · Expertenfrage" : "Schritt " + (index + 1) + " von " + module.steps.length, "step-counter"),
    element("h1", "", step.title));
  const content = element("div", "lesson-content");
  const nav = element("div", "lesson-actions");
  const back = button(index === 0 ? "← Zum Lernpfad" : "← Zurück", "btn btn--subtle", () => {
    if (index === 0) window.location.hash = "#/";
    else goTo(module.id, index - 1);
  });
  const next = button(index === module.steps.length - 1 ? "Zum Lernpfad →" : "Weiter →", "btn btn--primary", () => {
    if (step.type === "reading") markStep(module.id, step.id);
    if (index < module.steps.length - 1) goTo(module.id, index + 1);
    else window.location.hash = "#/";
  });
  next.disabled = step.type === "quiz" && !isComplete(progress, module.id, step.id);
  if (step.type === "reading") {
    for (const text of step.body) content.append(paragraph(text));
    if (step.diagram) {
      const diagram = element("div", "map-steps");
      diagram.setAttribute("aria-label", "Die vier Stationen einer Änderung");
      for (const item of step.diagram) {
        append(diagram, append(element("span"), element("b", "", item.name), document.createTextNode(item.note)));
      }
      content.append(diagram);
    }
    if (step.command) {
      const code = element("pre", "code-sample");
      code.append(element("code", "", step.command));
      content.append(code);
    }
    if (step.takeaway) {
      const note = element("aside", "note");
      append(note, element("strong", "", "Merksatz"), paragraph(step.takeaway));
      content.append(note);
    }
  } else {
    renderQuestion(content, module, step, next);
  }
  if (step.type === "expert") next.textContent = "Expertenfrage überspringen / Lernpfad →";
  append(nav, back, append(element("span", "lesson-actions__right"), next));
  append(main, content, nav);
  if (!storageAvailable) main.append(paragraph("Dein Fortschritt kann in diesem Browser gerade nicht dauerhaft gespeichert werden.", "state-hint"));
  const side = element("aside", "lesson-side");
  append(side, element("strong", "", "Dein Weg"), progressIndicator(stats),
    paragraph(stats.done + "/" + stats.total + " Pflichtschritte", "small muted"));
  const list = element("ol");
  module.steps.forEach((part, partIndex) => {
    const li = element("li", partIndex === index ? "current" : isComplete(progress, module.id, part.id) ? "done" : "");
    li.textContent = part.title;
    if (partIndex === index) li.setAttribute("aria-current", "step");
    list.append(li);
  });
  append(side, list);
  append(layout, main, side);
  app.append(layout);
}

function render() {
  if (!course) return;
  app.replaceChildren();
  const path = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
  if (path === "ueber") renderAbout();
  else if (path.startsWith("lektion/")) {
    const parts = path.split("/");
    const module = course.modules.find(item => item.id === parts[1]);
    if (module) renderLesson(module, Number(parts[2]));
    else renderHome();
  } else renderHome();
}

async function start() {
  try {
    const response = await fetch("./content/course.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    course = await response.json();
    if (course.schemaVersion !== 1 || !Array.isArray(course.modules) || !course.modules.length) {
      throw new Error("Unbekanntes Kursformat");
    }
    progress = readStored();
    window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
    render();
  } catch {
    app.replaceChildren(append(element("div", "empty-error"),
      element("h2", "", "Die Lerninhalte konnten nicht geladen werden."),
      paragraph("Bitte starte die Anwendung über einen lokalen Webserver und lade die Seite erneut."),
      link("Zum Repository ↗", "https://github.com/blame76/how-to-git")));
  }
}
start();
