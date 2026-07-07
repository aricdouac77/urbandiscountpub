import type { Locale } from "@/i18n/routing";

// Fixed display-only conversion rate: checkout always charges in EUR via
// Stripe regardless of locale — this only affects the price shown to the
// visitor, not the amount actually billed.
const EUR_TO_USD_RATE = 1.08;

/**
 * Formats a EUR amount for display, converting to USD for the English
 * locale. The underlying value charged at checkout is always the raw EUR
 * amount — this is a display conversion only.
 */
export function formatPrice(value: number, locale: Locale): string {
  if (locale === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value * EUR_TO_USD_RATE);
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
