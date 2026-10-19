import { toPersianDigits } from '../lib/phone';

interface KeypadProps {
  canSend: boolean;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onSend: () => void;
}

function SendIcon() {
  return (
    <svg className="action__icon" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <path
        d="M3 16 29 4 22 28 15 19 3 16Zm12 3 14-15"
        fill="none"
        stroke="#14b24a"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="action__icon" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <path d="M7 7 25 25M25 7 7 25" stroke="#f0383c" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

const ROWS: string[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export function Keypad({ canSend, onDigit, onDelete, onSend }: KeypadProps) {
  const digitKey = (digit: string, extraClass = '') => (
    <button
      key={digit}
      type="button"
      className={`key ${extraClass}`.trim()}
      aria-label={toPersianDigits(digit)}
      onClick={() => onDigit(digit)}
    >
      {toPersianDigits(digit)}
    </button>
  );

  const send = (
    <button key="send" type="button" className="action action--send" disabled={!canSend} onClick={onSend}>
      <SendIcon />
      <span>ارسال</span>
    </button>
  );

  const del = (
    <button key="delete" type="button" className="action action--delete" onClick={onDelete}>
      <DeleteIcon />
      <span>حذف</span>
    </button>
  );

  // Grid order: 1 2 3 [send] / 4 5 6 [delete] / 7 8 9 0
  return (
    <div className="keypad" role="group" aria-label="صفحه کلید">
      {ROWS[0].map((d) => digitKey(d))}
      {send}
      {ROWS[1].map((d) => digitKey(d))}
      {del}
      {ROWS[2].map((d) => digitKey(d))}
      {digitKey('0', 'key--zero')}
    </div>
  );
}
