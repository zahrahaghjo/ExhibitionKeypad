import { useCallback, useEffect, useState } from 'react';
import { Keypad } from './components/Keypad';
import { Logo } from './components/Logo';
import { PhoneDisplay } from './components/PhoneDisplay';
import { PREFIX, appendDigit, formatPhone, isValidMobile, removeLastDigit } from './lib/phone';

export default function App() {
  const [value, setValue] = useState(PREFIX);
  const [sentNumber, setSentNumber] = useState<string | null>(null);

  const canSend = isValidMobile(value);

  const handleDigit = useCallback((digit: string) => {
    setSentNumber(null);
    setValue((current) => appendDigit(current, digit));
  }, []);

  const handleDelete = useCallback(() => {
    setSentNumber(null);
    setValue((current) => removeLastDigit(current));
  }, []);

  const handleSend = useCallback(() => {
    if (!isValidMobile(value)) return;
    // TODO: connect this to your API / SMS service.
    setSentNumber(value);
  }, [value]);

  // Physical keyboard support: digits (Latin/Persian/Arabic), Backspace, Enter.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === 'Backspace') {
        handleDelete();
      } else if (event.key === 'Enter') {
        // A focused button already handles Enter itself.
        if (event.target instanceof HTMLButtonElement) return;
        handleSend();
      } else if (/^[0-9۰-۹٠-٩]$/.test(event.key)) {
        handleDigit(event.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDelete, handleDigit, handleSend]);

  return (
    <main className="page">
      <Logo />
      <PhoneDisplay value={value} />
      <Keypad canSend={canSend} onDigit={handleDigit} onDelete={handleDelete} onSend={handleSend} />
      <p className="status" aria-live="polite">
        {sentNumber ? `شماره ${formatPhone(sentNumber)} ارسال شد ✓` : ' '}
      </p>
    </main>
  );
}
