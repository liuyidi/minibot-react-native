import { createElement, type ReactNode } from "react";
import { BackHandler, type NativeEventSubscription } from "react-native";
import RootSiblings from "react-native-root-siblings";

import { resolveOverlayOptions } from "./defaults";
import type {
  OverlayOptions,
  OverlayStackItem,
  OverlayType,
} from "./types";
import { OverlayLevels } from "./types";

type Listener = () => void;

function newId() {
  return `overlay_${Math.random().toString(36).slice(2, 11)}`;
}

class OverlayStackController {
  private entries: OverlayStackItem[] = [];
  private sibling: RootSiblings | null = null;
  private listeners = new Set<Listener>();
  private backSub: NativeEventSubscription | null = null;

  constructor() {
    this.backSub = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress,
    );
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): OverlayStackItem[] {
    return this.entries.slice();
  }

  show(content: ReactNode | (() => ReactNode), options: OverlayOptions): string {
    const resolved = resolveOverlayOptions(options);
    const id = options.id ?? newId();

    const existing = this.entries.find((e) => e.id === id);
    if (existing?.timer) {
      clearTimeout(existing.timer);
    }
    this.entries = this.entries.filter((e) => e.id !== id);

    const item: OverlayStackItem = {
      id,
      type: resolved.type,
      options: resolved,
      content,
    };
    this.entries.push(item);

    if (resolved.type === "Toast" && resolved.durationMs > 0) {
      item.timer = setTimeout(() => this.dismiss(id), resolved.durationMs);
    }

    this.ensureSibling();
    this.emit();
    return id;
  }

  update(id: string, content: ReactNode | (() => ReactNode)) {
    const item = this.entries.find((e) => e.id === id);
    if (!item) return;
    if (item.content === content) return;
    item.content = content;
    this.emit();
  }

  /**
   * Re-render the host without changing entries.
   * Used by OverlayPortal after parent children change (stable content getter).
   */
  notify() {
    if (this.entries.length === 0) return;
    this.emit();
  }

  dismiss(id: string) {
    const index = this.entries.findIndex((e) => e.id === id);
    if (index === -1) return;
    const item = this.entries[index];
    if (item.timer) {
      clearTimeout(item.timer);
      item.timer = undefined;
    }
    this.entries.splice(index, 1);
    item.options.onDismiss?.();
    this.emit();
    this.maybeDestroySibling();
  }

  dismissTop(type?: OverlayType): boolean {
    const pool = type
      ? this.entries.filter((e) => e.type === type)
      : this.entries;
    if (pool.length === 0) return false;
    const top = pool[pool.length - 1];
    this.dismiss(top.id);
    return true;
  }

  dismissAll(type?: OverlayType) {
    const ids = (
      type ? this.entries.filter((e) => e.type === type) : this.entries.slice()
    ).map((e) => e.id);
    ids.forEach((id) => this.dismiss(id));
  }

  /** Level base + stack index for stable stacking. */
  zIndexFor(item: OverlayStackItem, stackIndex: number): number {
    const base = item.options.level ?? OverlayLevels[item.type];
    return base + stackIndex;
  }

  private ensureSibling() {
    if (this.sibling) return;
    // Lazy require to avoid cycles; Host subscribes to this controller.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { OverlayHost } = require("./OverlayHost") as typeof import("./OverlayHost");
    this.sibling = new RootSiblings(createElement(OverlayHost));
  }

  private maybeDestroySibling() {
    if (this.entries.length > 0) return;
    this.sibling?.destroy();
    this.sibling = null;
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private handleBackPress = (): boolean => {
    if (this.entries.length === 0) return false;

    // Walk from top of LIFO stack (end of array).
    for (let i = this.entries.length - 1; i >= 0; i--) {
      const item = this.entries[i];
      if (item.type === "Toast") continue;

      if (item.type === "System" && item.options.dismissOnBack !== true) {
        return true; // block back
      }

      if (item.options.dismissOnBack) {
        this.dismiss(item.id);
        return true;
      }
    }
    return false;
  };

  destroy() {
    this.backSub?.remove();
    this.backSub = null;
    this.dismissAll();
  }
}

/** Singleton overlay stack (one RootSiblings host). */
export const OverlayStack = new OverlayStackController();
