// Only the *presentation* order changes. Stable choice IDs remain the source
// of truth for scoring and per-choice explanations.
export function shuffleChoices(choices, random = Math.random) {
  const result = [...choices];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function isCorrectSelection(selected, correct) {
  return selected.length === correct.length &&
    new Set(selected).size === selected.length &&
    selected.every(id => correct.includes(id));
}
