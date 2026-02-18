/**
 * Normalize a URL for comparison by stripping query params, trailing /query, and trailing slashes.
 */
export function normalizeUrl(url: string): string {
  let normalized = url.split("?")[0] || url;
  normalized = normalized.replace(/\/query$/, "");
  normalized = normalized.replace(/\/$/, "");
  return normalized.toLowerCase();
}
