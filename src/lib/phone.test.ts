import { describe, expect, it } from 'vitest';
import {
  appendDigit,
  formatPhone,
  isValidMobile,
  removeLastDigit,
  toLatinDigits,
  toPersianDigits,
  toSlots,
} from './phone';

describe('digit conversion', () => {
  it('converts Latin to Persian digits', () => {
    expect(toPersianDigits('09123')).toBe('۰۹۱۲۳');
  });

  it('converts Persian and Arabic-Indic digits to Latin', () => {
    expect(toLatinDigits('۰۹۱۲۳')).toBe('09123');
    expect(toLatinDigits('٠٩١٢٣')).toBe('09123');
  });
});

describe('appendDigit', () => {
  it('appends Latin and Persian digits', () => {
    expect(appendDigit('09', '1')).toBe('091');
    expect(appendDigit('09', '۲')).toBe('092');
  });

  it('ignores non-digits', () => {
    expect(appendDigit('09', 'a')).toBe('09');
    expect(appendDigit('09', '12')).toBe('09');
  });

  it('does not exceed 11 digits', () => {
    expect(appendDigit('09123456789', '1')).toBe('09123456789');
  });
});

describe('removeLastDigit', () => {
  it('removes the last digit', () => {
    expect(removeLastDigit('0912')).toBe('091');
  });

  it('keeps the 09 prefix', () => {
    expect(removeLastDigit('09')).toBe('09');
  });
});

describe('isValidMobile', () => {
  it('accepts a complete 09 number', () => {
    expect(isValidMobile('09123456789')).toBe(true);
  });

  it('rejects short, long and wrongly prefixed numbers', () => {
    expect(isValidMobile('0912345678')).toBe(false);
    expect(isValidMobile('091234567890')).toBe(false);
    expect(isValidMobile('08123456789')).toBe(false);
  });
});

describe('display helpers', () => {
  it('builds 11 slots with empty positions as null', () => {
    const slots = toSlots('091');
    expect(slots).toHaveLength(11);
    expect(slots.slice(0, 3)).toEqual(['0', '9', '1']);
    expect(slots[3]).toBeNull();
  });

  it('formats a full number in groups', () => {
    expect(formatPhone('09123456789')).toBe('۰۹۱۲ ۳۴۵ ۶۷ ۸۹');
  });

  it('formats a partial number without trailing space', () => {
    expect(formatPhone('09123')).toBe('۰۹۱۲ ۳');
  });
});
