export function decodeHashRoute(hash) {
  try {
    return decodeURIComponent(hash.replace(/^#\/?/, ""));
  } catch {
    return "";
  }
}
