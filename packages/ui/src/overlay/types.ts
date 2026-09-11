import type { ReactNode } from "react";

export type OverlayType = "Popup" | "Dialog" | "Toast" | "System";

export const OverlayLevels: Record<OverlayType, number> = {
  Popup: 1000,
  Dialog: 2000,
  Toast: 3000,
  System: 4000,
};

export type OverlayOptions = {
  id?: string;
  type: OverlayType;
  /** Override level base (default from OverlayLevels[type]). */
  level?: number;
  hasMask?: boolean;
  maskColor?: string;
  closeOnMask?: boolean;
  dismissOnBack?: boolean;
  /** Toast auto-dismiss ms. `0` = sticky until dismiss. */
  durationMs?: number;
  pointerEvents?: "auto" | "none" | "box-none";
  onDismiss?: () => void;
};

export type ResolvedOverlayOptions = OverlayOptions & {
  type: OverlayType;
  hasMask: boolean;
  closeOnMask: boolean;
  dismissOnBack: boolean;
  durationMs: number;
  pointerEvents: "auto" | "none" | "box-none";
  maskColor: string;
};

export type OverlayStackItem = {
  id: string;
  type: OverlayType;
  options: ResolvedOverlayOptions;
  content: ReactNode | (() => ReactNode);
  timer?: ReturnType<typeof setTimeout>;
};
