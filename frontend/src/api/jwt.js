/**
 * Minimal JWT payload decoder (no signature verification -- this only
 * runs client-side to read non-sensitive display claims like the
 * username; the server independently validates the token on every
 * request).
 */
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
