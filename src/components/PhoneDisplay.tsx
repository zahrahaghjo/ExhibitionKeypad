import { GROUPS, formatPhone, toPersianDigits, toSlots } from '../lib/phone';

interface PhoneDisplayProps {
  value: string;
}

export function PhoneDisplay({ value }: PhoneDisplayProps) {
  const slots = toSlots(value);
  const starts = GROUPS.map((_, i) => GROUPS.slice(0, i).reduce((sum, n) => sum + n, 0));

  return (
    <div className="display" dir="ltr" role="status" aria-label={`شماره موبایل: ${formatPhone(value)}`}>
      {GROUPS.map((size, groupIndex) => (
        <span className="display__group" key={groupIndex}>
          {slots.slice(starts[groupIndex], starts[groupIndex] + size).map((char, i) => (
            <span key={i} className={char === null ? 'slot slot--empty' : 'slot'}>
              {char === null ? null : toPersianDigits(char)}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
