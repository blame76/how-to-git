// Share only existing course information. Never embed local answers or progress exports in URLs.
export const PUBLIC_COURSE_URL = "https://blame76.github.io/how-to-git/";

export function overallProgress(course, progress) {
  return course.modules.reduce((total, module) => {
    const required = module.steps.filter(step => step.type !== "expert");
    const completed = new Set(progress.completed?.[module.id] ?? []);
    total.done += required.filter(step => completed.has(step.id)).length;
    total.total += required.length;
    return total;
  }, { done: 0, total: 0 });
}

export function shareQuestion(step) {
  if (typeof step.shareQuestion === "string" && step.shareQuestion.trim()) {
    return step.shareQuestion.trim().replace(/\s+/g, " ");
  }
  const prompt = typeof step.prompt === "string" ? step.prompt.trim().replace(/\s+/g, " ") : "";
  if (prompt && prompt.length <= 200) return prompt;
  const title = step.title?.trim() || "dieses Git-Thema";
  if (title.endsWith("?")) return title;
  return step.type === "reading" ? "Was steckt hinter „" + title + "“?" :
    "Wie würdest du bei „" + title + "“ entscheiden?";
}

export function publicStepUrl(module, step, baseUrl = PUBLIC_COURSE_URL) {
  const url = new URL(baseUrl);
  url.hash = "/lektion/" + encodeURIComponent(module.id) + "/" + encodeURIComponent(step.id);
  return url.toString();
}

export function isPublishedLocation(locationHref, baseUrl = PUBLIC_COURSE_URL) {
  try {
    const current = new URL(locationHref);
    const published = new URL(baseUrl);
    return current.protocol === "https:" && current.origin === published.origin &&
      current.pathname.startsWith(published.pathname);
  } catch {
    return false;
  }
}

export function shareDraft({ course, module, step, kind = "step", progress, linkStep = step }, baseUrl = PUBLIC_COURSE_URL) {
  if (!["step", "chapter", "course"].includes(kind)) throw new Error("Unbekannter Teilanlass");
  const number = String(course.modules.indexOf(module) + 1).padStart(2, "0");
  const question = shareQuestion(step);
  const chapterSteps = module.steps.filter(item => item.type !== "expert");
  const done = new Set(progress.completed?.[module.id] ?? []);
  const chapterDone = chapterSteps.filter(item => done.has(item.id)).length;
  const overall = overallProgress(course, progress);
  const heading = kind === "course"
    ? "Geschafft: " + overall.done + " / " + overall.total + " Schritte in How to Git & GitHub! 🎉"
    : kind === "chapter"
      ? "Kapitel " + number + " geschafft: " + chapterDone + " / " + chapterSteps.length + " Schritte! ✓"
      : "Eine Git-Frage aus Kapitel " + number + " · " + step.title;
  const outro = kind === "step"
    ? "Was meinst du? Die Erklärung steckt im kostenlosen Lernprojekt How to Git & GitHub."
    : "Eine Frage zum Weiterdenken. Mehr dazu im kostenlosen Lernprojekt How to Git & GitHub.";
  return {
    title: "How to Git & GitHub",
    text: heading + "\n\n" + question + "\n\n" + outro,
    url: kind === "course" ? new URL(baseUrl).toString() : publicStepUrl(module, linkStep, baseUrl)
  };
}

export function shareCopy(draft) {
  return draft.text + "\n\n" + draft.url;
}
