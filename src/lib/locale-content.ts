import type { Locale } from "@/i18n/routing";

/**
 * Resolves a translatable field: falls back to the French value when no
 * English translation is set, so partially-translated catalog content never
 * renders blank.
 */
export function localize(fr: string, en: string | null | undefined, locale: Locale): string {
  return locale === "en" && en ? en : fr;
}

export function localizeNullable(
  fr: string | null | undefined,
  en: string | null | undefined,
  locale: Locale,
): string | null {
  if (locale === "en" && en) return en;
  return fr ?? null;
}
