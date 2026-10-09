import {
  STORAGE_KEY, emptyProgress, sanitizeProgress, completeStep,
  isComplete, lessonProgress, resumeIndex, markVisited
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

function stepHref(module, index) {
  return "#/lektion/" + encodeURIComponent(module.id) + "/" + encodeURIComponent(module.steps[index].id);
}

function goTo(moduleId, index) {
  const module = course.modules.find(item => item.id === moduleId);
  if (!module || !module.steps[index]) return;
  const target = stepHref(module, index);
  if (window.location.hash === target) render();
  else window.location.hash = target;
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

  const masthead = element("div", "cover-meta");
  append(masthead, element("span", "", "Das Git-Lernjournal"), element("span", "", "Ausgabe 01 / Oktober 2026"));
  app.append(masthead);

  const hero = heading(
    "Verstehen statt auswendig lernen.",
    "Geändert. Und jetzt?",
    "Git für Menschen, die wissen möchten, was sie tun. Vom ersten Commit bis zur Zusammenarbeit auf GitHub – mit echten Situationen statt Befehlslisten."
  );
  const heroLayout = element("div", "hero__layout");
  const heroContent = element("div", "hero__content");
  while (hero.firstChild) heroContent.append(hero.firstChild);
  const actions = element("div", "hero__actions");
  append(actions,
    button(stats.done || progress.lastVisited?.moduleId === module.id
      ? "Dort weiterlesen, wo du warst ↗" : "Hier starten ↗",
      "btn btn--primary", () => {
        if (stats.done || progress.lastVisited?.moduleId === module.id) goTo(module.id, resumeIndex(module, progress));
        else window.location.hash = "#/start";
      }),
    link("Kapitel 00 · Willkommen ↗", "#/start", "text-link")
  );
  heroContent.append(actions);
  const aside = element("aside", "hero__aside");
  append(aside,
    element("span", "hero__aside-rule", "Eine Randnotiz"),
    element("p", "hero__quote", "Ein Commit ist eine Entscheidung. Kein Reflex."),
    element("span", "hero__aside-bottom", "Weniger Befehle pauken. Mehr verstehen.")
  );
  append(heroLayout, heroContent, aside);
  hero.append(heroLayout);
  app.append(hero);

  const panel = element("section", "reading-progress");
  panel.setAttribute("aria-label", "Lernfortschritt");
  const info = element("div", "reading-progress__info");
  append(info,
    paragraph("Dein Lesestand", "eyebrow"),
    element("strong", "reading-progress__count", String(stats.done).padStart(2, "0") + " / " + String(stats.total).padStart(2, "0")),
    paragraph("Pflichtschritte abgeschlossen", "small muted"),
    progressIndicator(stats)
  );
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
  append(utilities,
    button("Fortschritt exportieren ↓", "text-link text-link--small", exportProgress),
    button("Importieren ↑", "text-link text-link--small", () => upload.click()),
    upload
  );
  append(panel, info, utilities);
  app.append(panel);
  if (!storageAvailable) app.append(paragraph("Hinweis: Dein Browser speichert den Fortschritt derzeit nicht dauerhaft. Ein Export ist weiterhin möglich.", "state-hint"));

  const headingLine = element("div", "editorial-heading");
  append(headingLine,
    paragraph("Der Lernpfad", "eyebrow"),
    element("h2", "", "Aus guten Fragen wird Wissen."),
    paragraph("Eine Lektion nach der anderen. Und dann ab in die Praxis.", "muted")
  );
  app.append(headingLine);

  const contents = element("section", "contents");
  contents.setAttribute("aria-label", "Lernpfad");
  const introEntry = element("article", "contents__entry");
  const introText = element("div", "contents__text");
  append(introText, paragraph("Dein Einstieg · ohne Vorwissen", "contents__label"),
    element("h3", "", "Schon mal eine Datei kaputtverbessert?"),
    paragraph("Gestern hat noch alles funktioniert. Erfahre, warum Versionsverwaltung hilft, für wen dieser Kurs gedacht ist und wie du dich hier zurechtfindest."));
  append(introEntry, element("span", "contents__number", "00"),
    introText, link("Einführung lesen ↗", "#/start", "text-link"));
  contents.append(introEntry);
  const entry = element("article", "contents__entry contents__entry--current");
  const mainNumber = element("span", "contents__number", "01");
  const entryText = element("div", "contents__text");
  append(entryText, paragraph("Jetzt lesen · " + module.duration, "contents__label"),
    element("h3", "", module.title), paragraph(module.description));
  const entryAction = button(stats.done === stats.total ? "Noch einmal lesen ↗" :
    stats.done || progress.lastVisited?.moduleId === module.id ? "Lektion fortsetzen ↗" : "Kapitel beginnen ↗",
    "text-link", () => {
      if (stats.done === stats.total) goTo(module.id, 0);
      else goTo(module.id, resumeIndex(module, progress));
    });
  append(entry, mainNumber, entryText, entryAction);
  contents.append(entry);
  course.plannedModules.forEach((planned, i) => {
    const row = element("article", "contents__entry contents__entry--upcoming");
    const copy = element("div", "contents__text");
    append(copy, paragraph("In Vorbereitung", "contents__label"),
      element("h3", "", planned.title), paragraph(planned.description));
    append(row, element("span", "contents__number", String(i + 2).padStart(2, "0")),
      copy, element("span", "contents__state", "Folgt später"));
    contents.append(row);
  });
  app.append(contents);

  const closer = element("aside", "closing-note");
  append(closer, element("span", "", "Zum Mitnehmen"),
    element("p", "", "Nicht jeder Commit muss perfekt sein. Er sollte nur eine Geschichte erzählen, die andere verstehen können."));
  app.append(closer);
}


function renderIntro() {
  document.title = "Willkommen – How to Git & GitHub";
  const intro = heading("Kapitel 00 · Willkommen", "Schon mal eine Datei kaputtverbessert?",
    "Gestern hat noch alles funktioniert.");
  intro.classList.add("intro-hero");
  const story = element("div", "intro-story");
  append(story,
    paragraph("Heute nicht mehr. Irgendwo hast du etwas verändert. Vielleicht sogar an mehreren Stellen. Und jetzt wäre es praktisch, zum Stand von gestern zurückkehren zu können."),
    paragraph("Oder ihr arbeitet zu zweit an einem Projekt. Beide ändern dieselben Dateien. Beide haben gute Ideen. Aber wie fügt ihr eure Arbeit zusammen, ohne etwas zu verlieren?"),
    paragraph("Genau hier beginnt die Geschichte von Git."),
    paragraph("Eine Versionsverwaltung hält Veränderungen nachvollziehbar fest. Git ist ein solches Werkzeug: Es hilft dir, frühere Versionen wiederzufinden und Änderungen miteinander zu verbinden. GitHub ist eine Onlineplattform, auf der Menschen Git-Projekte teilen und gemeinsam weiterentwickeln können."),
    paragraph("Du musst weder programmieren können noch Begriffe wie Commit, Branch oder Repository kennen. Wir erklären sie, wenn du sie brauchst.")
  );
  intro.append(story);
  app.append(intro);

  const guide = element("div", "intro-guide");
  const who = element("section", "intro-section");
  append(who, paragraph("Für wen?", "eyebrow"), element("h2", "", "Für Neugierige. Und alte Hasen."),
    paragraph("Du bist hier richtig, wenn du Git gerade erst entdeckst, es schon nutzt und verstehen möchtest oder im Team mit GitHub zusammenarbeitest. Auch mit viel Erfahrung gibt es Überraschungen zu entdecken."));
  const how = element("section", "intro-section");
  append(how, paragraph("So liest du diesen Kurs", "eyebrow"), element("h2", "", "In deinem Tempo."),
    paragraph("Du liest einen kurzen Abschnitt, triffst bei Lernkontrollen eine Entscheidung und bekommst eine Erklärung – auch wenn die Antwort falsch war."),
    paragraph("Über die Kapitelübersicht kannst du jederzeit zurückspringen oder bereits Gelesenes wiederholen. Zusätzliche Expertenfragen sind freiwillig."),
    paragraph("Dein Fortschritt bleibt in deinem Browser. Du brauchst weder ein Konto noch ein eigenes GitHub-Repository."));
  append(guide, who, how);
  app.append(guide);
  const actions = element("div", "intro-actions");
  append(actions, button("Mit Kapitel 01 beginnen →", "btn btn--primary", () => goTo(course.modules[0].id, 0)),
    link("← Alle Kapitel ansehen", "#/", "text-link"));
  app.append(actions);
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
  append(container, paragraph("Lernkontrolle", "eyebrow"), element("h2", "quiz-question", step.prompt));
  if (step.mode === "multiple") container.append(paragraph("Mehrere Antworten können richtig sein.", "small muted"));
  else container.append(paragraph("Wähle eine Antwort.", "small muted"));
  const form = element("form");
  const options = element("fieldset", "quiz-options");
  options.append(element("legend", "sr-only", step.prompt));
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

function buildStepList(module, currentIndex) {
  const list = element("ol");
  module.steps.forEach((part, index) => {
    const li = element("li", index === currentIndex ? "current" :
      isComplete(progress, module.id, part.id) ? "done" : "");
    const itemLink = link(String(index + 1).padStart(2, "0") + "  " + part.title, stepHref(module, index));
    if (index === currentIndex) itemLink.setAttribute("aria-current", "step");
    li.append(itemLink);
    list.append(li);
  });
  return list;
}

function renderLesson(module, index) {
  if (!Number.isInteger(index) || index < 0 || index >= module.steps.length) {
    window.location.hash = "#/";
    renderHome();
    return;
  }
  const step = module.steps[index];
  const chapter = String(course.modules.indexOf(module) + 1).padStart(2, "0");
  const visited = markVisited(progress, module.id, step.id);
  if (visited !== progress) {
    progress = visited;
    saveStored();
  }
  document.title = step.title + " – How to Git & GitHub";
  const top = element("div", "lesson-top");
  const breadcrumbs = element("div", "lesson-top__links");
  append(breadcrumbs, link("← Alle Kapitel", "#/"), link("Einführung", "#/start"));
  append(top, breadcrumbs, element("span", "lesson-top__meta", "Das Git-Lernjournal / " + module.duration));
  app.append(top);
  const layout = element("div", "lesson-layout");
  const main = element("article", "lesson-main");
  const stats = lessonProgress(module, progress);
  append(main,
    paragraph(step.type === "expert" ? "Kapitel " + chapter + " / Expertenfrage" :
      "Kapitel " + chapter + " / Abschnitt " + String(index + 1).padStart(2, "0") +
      " von " + String(module.steps.length).padStart(2, "0"), "step-counter"),
    element("h1", "", step.title));
  const content = element("div", "lesson-content");
  const nav = element("div", "lesson-actions");
  const back = button(index === 0 ? "← Zur Einführung" : "← Zurück", "btn btn--subtle", () => {
    if (index === 0) window.location.hash = "#/start";
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
  if (step.type === "expert") next.textContent = "Bonus abschließen / Zur Übersicht →";
  append(nav, back, append(element("span", "lesson-actions__right"), next));
  append(main, content, nav);
  if (!storageAvailable) main.append(paragraph("Dein Fortschritt kann in diesem Browser gerade nicht dauerhaft gespeichert werden.", "state-hint"));
  const side = element("aside", "lesson-side");
  const desktopNav = element("nav", "lesson-outline--desktop");
  desktopNav.setAttribute("aria-label", "Abschnitte dieses Kapitels");
  append(desktopNav, paragraph("Dein Weg durch die Lektion", "eyebrow"), progressIndicator(stats),
    paragraph(stats.done + "/" + stats.total + " Pflichtschritte", "small muted"),
    buildStepList(module, index));
  const mobileOutline = element("details", "lesson-outline--mobile");
  append(mobileOutline,
    element("summary", "", "Kapitel " + chapter + " · Abschnitt " + (index + 1) + " von " +
      module.steps.length + " – Alle Abschnitte"),
    buildStepList(module, index));
  append(side, desktopNav, mobileOutline);
  append(layout, main, side);
  app.append(layout);
}

function render() {
  if (!course) return;
  app.replaceChildren();
  const path = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
  if (path === "ueber") renderAbout();
  else if (path === "start") renderIntro();
  else if (path.startsWith("lektion/")) {
    const parts = path.split("/");
    const module = course.modules.find(item => item.id === parts[1]);
    if (module) {
      // Previously shared numeric URLs remain usable after the switch to stable step IDs.
      const index = /^\d+$/.test(parts[2] ?? "") ? Number(parts[2]) :
        module.steps.findIndex(step => step.id === parts[2]);
      renderLesson(module, index);
    } else renderHome();
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
