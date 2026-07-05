/**
 * JSON.stringify does not escape "<", so a value containing "</script>"
 * (e.g. a product description) could break out of the script tag when
 * injected via dangerouslySetInnerHTML. Escaping "<" neutralizes that
 * without affecting the parsed JSON-LD payload.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
