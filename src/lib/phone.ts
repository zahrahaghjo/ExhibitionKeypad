const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** Iranian mobile numbers are 11 digits and start with 09. */
export const PHONE_LENGTH = 11;
export const PREFIX = '09';
/** Visual grouping of the number: 0912 345 67 89 */
export const GROUPS = [4, 3, 2, 2] as const;

/** Converts Persian (۰-۹) and Arabic-Indic (٠-٩) digits to Latin (0-9). */
export function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** Converts Latin digits (0-9) to Persian digits (۰-۹). */
export function toPersianDigits(input: string): string {
  return input.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Appends one digit (any digit script). Ignores invalid input and overflow. */
export function appendDigit(value: string, digit: string): string {
  const latin = toLatinDigits(digit);
  if (!/^\d$/.test(latin)) return value;
  if (value.length >= PHONE_LENGTH) return value;
  return value + latin;
}

/** Removes the last digit, but never the fixed "09" prefix. */
export function removeLastDigit(value: string): string {
  return value.length > PREFIX.length ? value.slice(0, -1) : value;
}

export function isValidMobile(value: string): boolean {
  return /^09\d{9}$/.test(value);
}

/** One entry per digit position; `null` means "not typed yet". */
export function toSlots(value: string): (string | null)[] {
  return Array.from({ length: PHONE_LENGTH }, (_, i) => value[i] ?? null);
}

/** Human readable Persian format, e.g. ۰۹۱۲ ۳۴۵ ۶۷ ۸۹ */
export function formatPhone(value: string): string {
  const parts: string[] = [];
  let start = 0;
  for (const size of GROUPS) {
    const part = value.slice(start, start + size);
    if (part) parts.push(part);
    start += size;
  }
  return toPersianDigits(parts.join(' '));
}
