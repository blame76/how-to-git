// Share existing course content without answers, identity or local progress.
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
  // Keep the full question, including its real-world context.
  // A generic title would lose precisely what makes this question interesting.
  const prompt = typeof step.prompt === "string" ? step.prompt.trim().replace(/\s+/g, " ") : "";
  if (prompt) return prompt;
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

export function shareDraft({ module, step, kind = "step", linkStep = step }, baseUrl = PUBLIC_COURSE_URL) {
  if (!["step", "chapter", "course"].includes(kind)) throw new Error("Unbekannter Teilanlass");
  return {
    title: "How to Git & GitHub",
    text: shareQuestion(step) +
      "\n\nEine Frage zum Weiterdenken. Mehr dazu im kostenlosen Lernprojekt How to Git & GitHub.",
    url: kind === "course" ? new URL(baseUrl).toString() : publicStepUrl(module, linkStep, baseUrl)
  };
}

export function shareCopy(draft) {
  return draft.text + "\n\n" + draft.url;
}
