import { useEffect, useRef, useState } from "react";

/**
 * Draft state for popup editors: re-seed from `source` only when the popup
 * transitions from closed → open (avoids resetting on every parent render).
 */
export function usePopupDraft<T>(
  visible: boolean,
  source: T,
): [T, (next: T) => void] {
  const [draft, setDraft] = useState(source);
  const wasVisible = useRef(false);
  const sourceRef = useRef(source);
  sourceRef.current = source;

  useEffect(() => {
    if (visible && !wasVisible.current) {
      setDraft(sourceRef.current);
    }
    wasVisible.current = visible;
  }, [visible]);

  return [draft, setDraft];
}
