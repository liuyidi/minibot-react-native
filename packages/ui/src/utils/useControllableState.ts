import { useState } from "react";

/**
 * Dual-mode state: pass `value` for controlled, omit it and use `defaultValue`
 * for uncontrolled (same idea as Switch / Stepper).
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const current = controlled ? value : inner;

  const setValue = (next: T) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  return [current, setValue];
}
