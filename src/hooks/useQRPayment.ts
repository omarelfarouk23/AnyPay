import {useState, useCallback, useMemo} from 'react';

export const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'] as const;
export type KeypadKey = (typeof KEYPAD_KEYS)[number];

// Amount keypad logic mirrored from the Stitch scanner bottom sheet
export function useAmountKeypad(initial: string = '0') {
  const [raw, setRaw] = useState(initial);

  const pressKey = useCallback((key: KeypadKey) => {
    setRaw((prev) => {
      if (key === 'backspace') {
        const next = prev.slice(0, -1);
        return next === '' ? '0' : next;
      }
      if (key === '.') {
        return prev.includes('.') ? prev : prev + '.';
      }
      if (prev === '0') return key;
      if (prev.replace('.', '').length >= 8) return prev;
      return prev + key;
    });
  }, []);

  const amount = useMemo(() => parseFloat(raw) || 0, [raw]);

  const display = useMemo(() => {
    if (!amount) return '0.00';
    try {
      return amount.toLocaleString('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return amount.toFixed(2);
    }
  }, [amount]);

  const reset = useCallback(() => setRaw('0'), []);
  const setValue = useCallback((value: string) => setRaw(value), []);

  return {raw, amount, display, pressKey, reset, setValue};
}

// 6-digit PIN state for the payment confirmation screen
export function usePinKeypad(maxLength: number = 6) {
  const [pin, setPin] = useState('');

  const pressDigit = useCallback(
    (digit: string) => {
      setPin((prev) => (prev.length >= maxLength ? prev : prev + digit));
    },
    [maxLength],
  );

  const backspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => setPin(''), []);

  return {
    pin,
    length: pin.length,
    maxLength,
    isComplete: pin.length === maxLength,
    pressDigit,
    backspace,
    clear,
  };
}