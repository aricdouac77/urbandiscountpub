export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(6011|65|64[4-9])/.test(digits)) return "discover";
  return "unknown";
}

const GROUPS: Record<CardBrand, number[]> = {
  amex: [4, 6, 5],
  visa: [4, 4, 4, 4],
  mastercard: [4, 4, 4, 4],
  discover: [4, 4, 4, 4],
  unknown: [4, 4, 4, 4],
};

export function formatCardNumber(raw: string): {
  formatted: string;
  brand: CardBrand;
  digits: string;
} {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  const brand = detectCardBrand(digits);
  const groups = GROUPS[brand];

  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) {
    parts.push(digits.slice(index));
  }

  return { formatted: parts.join(" "), brand, digits };
}

export function formatExpiry(raw: string): string {
  let digits = raw.replace(/\D/g, "").slice(0, 4);

  if (digits.length === 1 && Number(digits) > 1) {
    digits = `0${digits}`;
  }
  if (digits.length >= 2) {
    let month = digits.slice(0, 2);
    if (Number(month) > 12) month = "12";
    if (month === "00") month = "01";
    digits = month + digits.slice(2);
  }

  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function cvvLength(brand: CardBrand): number {
  return brand === "amex" ? 4 : 3;
}

export function cardNumberMaxDigits(brand: CardBrand): number {
  if (brand === "amex") return 15;
  return 16;
}

export function luhnCheck(digits: string): boolean {
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (shouldDouble) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}
