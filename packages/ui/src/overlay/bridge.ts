import type { UiTheme } from "../theme/types";
import { brandLight } from "../theme/presets";
import type { UiLocale, UiLocaleMessages, UiMode } from "../config/locale";
import { localeMessages } from "../config/locale";

type OverlayBridgeState = {
  theme: UiTheme;
  locale: UiLocale;
  mode: UiMode;
  messages: UiLocaleMessages;
};

let bridge: OverlayBridgeState = {
  theme: brandLight,
  locale: "zh",
  mode: "light",
  messages: localeMessages.zh,
};

const listeners = new Set<() => void>();

export function setOverlayBridge(next: Partial<OverlayBridgeState>) {
  bridge = { ...bridge, ...next };
  listeners.forEach((l) => l());
}

export function getOverlayBridge(): OverlayBridgeState {
  return bridge;
}

export function subscribeOverlayBridge(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
