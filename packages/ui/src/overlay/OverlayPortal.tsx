import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import { OverlayStack } from "./controller";
import { useInsideOverlayHost } from "./insideHost";
import type { OverlayOptions } from "./types";

export type OverlayPortalProps = {
  visible: boolean;
  children: ReactNode;
  /** Defaults merged with type table. */
  options: OverlayOptions;
  /**
   * Called when the stack dismisses this entry externally
   * (mask / back / OverlayStack.dismiss), not when `visible` flips to false.
   */
  onDismiss?: () => void;
};

/**
 * Declarative bridge: `visible` ↔ OverlayStack.show/dismiss.
 * Renders nothing in-tree; content is painted in the single RootSiblings host.
 *
 * Content is read via a stable getter (`() => contentRef.current`).
 * When the portal's parent re-renders (e.g. calendar draft state), we
 * `notify()` the host so it re-reads the getter — without replacing the
 * getter reference (that used to loop with `update` + new element trees).
 *
 * When this portal is itself rendered inside OverlayHost (imperative
 * Dialog.alert → Alert → Popup), paint children inline and skip show/notify.
 */
export function OverlayPortal({
  visible,
  children,
  options,
  onDismiss,
}: OverlayPortalProps) {
  const insideHost = useInsideOverlayHost();
  const idRef = useRef<string | null>(null);
  const closingFromProp = useRef(false);
  const contentRef = useRef(children);
  const onDismissRef = useRef(onDismiss);
  const optionsRef = useRef(options);

  contentRef.current = children;
  onDismissRef.current = onDismiss;
  optionsRef.current = options;

  // Keep OverlayHost in sync when portal children change (selection, form draft…).
  useLayoutEffect(() => {
    if (insideHost) return;
    if (idRef.current) OverlayStack.notify();
  });

  useEffect(() => {
    if (insideHost) return;

    if (!visible) {
      if (idRef.current) {
        closingFromProp.current = true;
        OverlayStack.dismiss(idRef.current);
        closingFromProp.current = false;
        idRef.current = null;
      }
      return;
    }

    if (idRef.current) return;

    const opts: OverlayOptions = {
      ...optionsRef.current,
      onDismiss: () => {
        if (closingFromProp.current) return;
        idRef.current = null;
        onDismissRef.current?.();
        optionsRef.current.onDismiss?.();
      },
    };

    idRef.current = OverlayStack.show(() => contentRef.current, opts);

    return () => {
      if (idRef.current) {
        closingFromProp.current = true;
        OverlayStack.dismiss(idRef.current);
        closingFromProp.current = false;
        idRef.current = null;
      }
    };
  }, [visible, insideHost]);

  if (insideHost) {
    return visible ? <>{children}</> : null;
  }

  return null;
}
