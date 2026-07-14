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

export type CurrencyCode = "EUR" | "USD" | "CAD" | "GBP" | "CHF";

// Fixed display-only conversion rates from EUR — checkout always charges in
// EUR via Stripe regardless of the shipping country selected.
const CURRENCY_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  CAD: 1.47,
  GBP: 0.86,
  CHF: 0.95,
};

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  EUR: "fr-FR",
  USD: "en-US",
  CAD: "en-CA",
  GBP: "en-GB",
  CHF: "fr-CH",
};

const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  France: "EUR",
  Belgique: "EUR",
  Luxembourg: "EUR",
  Suisse: "CHF",
  Canada: "CAD",
  "États-Unis": "USD",
  "Royaume-Uni": "GBP",
};

export function getCurrencyForCountry(country: string): CurrencyCode {
  return COUNTRY_CURRENCY[country] ?? "EUR";
}

/**
 * Formats a EUR amount for display in the given currency, converting via a
 * fixed display-only rate. Used at checkout so the shown price follows the
 * selected shipping country — the amount actually charged is always EUR.
 */
export function formatPriceInCurrency(value: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
  }).format(value * CURRENCY_RATES[currency]);
}
