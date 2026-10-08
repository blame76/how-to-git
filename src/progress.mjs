export const STORAGE_KEY = "how-to-git.progress.v1";
export const PROGRESS_VERSION = 1;

export function emptyProgress() {
  return { schemaVersion: PROGRESS_VERSION, completed: {}, updatedAt: null };
}

export function requiredSteps(module) {
  return module.steps.filter(step => step.type !== "expert");
}

export function sanitizeProgress(input, course) {
  if (!input || typeof input !== "object" || Array.isArray(input) || input.schemaVersion !== PROGRESS_VERSION ||
      !input.completed || typeof input.completed !== "object" || Array.isArray(input.completed)) {
    throw new Error("Die Fortschrittsdatei hat kein unterstütztes Format.");
  }
  const clean = emptyProgress();
  for (const module of course.modules) {
    const values = input.completed[module.id];
    if (values === undefined) continue;
    if (!Array.isArray(values) || values.length > 1000 || values.some(v => typeof v !== "string")) {
      throw new Error("Die gespeicherten Lernschritte sind ungültig.");
    }
    const allowed = new Set(module.steps.map(step => step.id));
    clean.completed[module.id] = [...new Set(values.filter(id => allowed.has(id)))];
  }
  if (typeof input.updatedAt === "string" && !Number.isNaN(Date.parse(input.updatedAt))) {
    clean.updatedAt = input.updatedAt;
  }
  return clean;
}

export function isComplete(progress, moduleId, stepId) {
  return (progress.completed[moduleId] ?? []).includes(stepId);
}

export function completeStep(progress, moduleId, stepId) {
  if (isComplete(progress, moduleId, stepId)) return progress;
  return {
    schemaVersion: PROGRESS_VERSION,
    updatedAt: new Date().toISOString(),
    completed: {
      ...progress.completed,
      [moduleId]: [...(progress.completed[moduleId] ?? []), stepId]
    }
  };
}

export function lessonProgress(module, progress) {
  const required = requiredSteps(module);
  const done = required.filter(step => isComplete(progress, module.id, step.id)).length;
  return { done, total: required.length, percent: required.length ? Math.round(done / required.length * 100) : 0 };
}

export function resumeIndex(module, progress) {
  const index = module.steps.findIndex(step => step.type !== "expert" && !isComplete(progress, module.id, step.id));
  return index < 0 ? 0 : index;
}
