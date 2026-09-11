import type { OverlayOptions, OverlayType, ResolvedOverlayOptions } from "./types";
import { OverlayLevels } from "./types";

const TYPE_DEFAULTS: Record<
  OverlayType,
  Pick<
    ResolvedOverlayOptions,
    "hasMask" | "closeOnMask" | "dismissOnBack" | "durationMs" | "pointerEvents"
  >
> = {
  Popup: {
    hasMask: false,
    closeOnMask: false,
    dismissOnBack: true,
    durationMs: 0,
    pointerEvents: "box-none",
  },
  Dialog: {
    hasMask: true,
    closeOnMask: true,
    dismissOnBack: true,
    durationMs: 0,
    pointerEvents: "auto",
  },
  Toast: {
    hasMask: false,
    closeOnMask: false,
    dismissOnBack: false,
    durationMs: 2500,
    pointerEvents: "box-none",
  },
  System: {
    hasMask: true,
    closeOnMask: false,
    dismissOnBack: false,
    durationMs: 0,
    pointerEvents: "auto",
  },
};

const DEFAULT_MASK = "rgba(0, 0, 0, 0.4)";

export function resolveOverlayOptions(
  options: OverlayOptions,
): ResolvedOverlayOptions {
  const base = TYPE_DEFAULTS[options.type];
  return {
    ...options,
    type: options.type,
    level: options.level ?? OverlayLevels[options.type],
    hasMask: options.hasMask ?? base.hasMask,
    closeOnMask: options.closeOnMask ?? base.closeOnMask,
    dismissOnBack: options.dismissOnBack ?? base.dismissOnBack,
    durationMs: options.durationMs ?? base.durationMs,
    pointerEvents: options.pointerEvents ?? base.pointerEvents,
    maskColor: options.maskColor ?? DEFAULT_MASK,
  };
}
