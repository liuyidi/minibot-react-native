import { useMemo, type ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { OverlayStack } from "../../../overlay";
import type { UiTheme } from "../../../theme/types";
import { Spinner } from "../spinner";

export type ToastBuiltinIcon = "success" | "fail" | "loading";
export type ToastPosition = "top" | "center" | "bottom";

export type ToastShowOptions = {
  message: string;
  /** Auto-hide ms. Default 2500 for text/icon; 3000 for loading. Pass `0` to stick. */
  durationMs?: number;
  icon?: ToastBuiltinIcon | ReactNode;
  /** @default center */
  position?: ToastPosition;
  /**
   * Allow presses to pass through to content behind the toast.
   * @default false
   */
  maskClickable?: boolean;
};

type ToastState = {
  message: string;
  icon?: ToastBuiltinIcon | ReactNode;
  position: ToastPosition;
  maskClickable: boolean;
};

type ToastApi = {
  /** Text toast, or options object (icon / position / duration / maskClickable). */
  show: (messageOrOptions: string | ToastShowOptions, durationMs?: number) => void;
  /**
   * Loading toast. Default duration 3000; pass `0` to stay until `hide()`.
   * Also accepts an options object.
   */
  loading: (
    messageOrOptions?: string | Omit<ToastShowOptions, "icon">,
    durationMs?: number,
  ) => void;
  success: (message: string, durationMs?: number) => void;
  fail: (message: string, durationMs?: number) => void;
  hide: () => void;
};

const TOAST_ID = "minibot_ui_toast";

function normalizeOptions(
  messageOrOptions: string | ToastShowOptions,
  durationMs?: number,
): { state: ToastState; durationMs: number } {
  if (typeof messageOrOptions === "string") {
    return {
      state: {
        message: messageOrOptions,
        position: "center",
        maskClickable: false,
      },
      durationMs: durationMs ?? 2500,
    };
  }
  const icon = messageOrOptions.icon;
  const isLoading = icon === "loading";
  return {
    state: {
      message: messageOrOptions.message,
      icon,
      position: messageOrOptions.position ?? "center",
      maskClickable: messageOrOptions.maskClickable ?? false,
    },
    durationMs:
      messageOrOptions.durationMs ??
      durationMs ??
      (isLoading ? 3000 : 2500),
  };
}

function present(state: ToastState, durationMs: number) {
  OverlayStack.show(
    <ToastHost
      message={state.message}
      icon={state.icon}
      position={state.position}
      maskClickable={state.maskClickable}
    />,
    {
      id: TOAST_ID,
      type: "Toast",
      durationMs,
      hasMask: false,
      closeOnMask: false,
      dismissOnBack: false,
      pointerEvents: state.maskClickable ? "none" : "auto",
    },
  );
}

const toastApi: ToastApi = {
  show(messageOrOptions, durationMs) {
    const next = normalizeOptions(messageOrOptions, durationMs);
    present(next.state, next.durationMs);
  },
  loading(messageOrOptions = "加载中...", durationMs) {
    if (typeof messageOrOptions === "string") {
      present(
        {
          message: messageOrOptions,
          icon: "loading",
          position: "center",
          maskClickable: false,
        },
        durationMs ?? 3000,
      );
      return;
    }
    present(
      {
        message: messageOrOptions.message ?? "加载中...",
        icon: "loading",
        position: messageOrOptions.position ?? "center",
        maskClickable: messageOrOptions.maskClickable ?? false,
      },
      messageOrOptions.durationMs ?? durationMs ?? 3000,
    );
  },
  success(message, durationMs = 2500) {
    present(
      {
        message,
        icon: "success",
        position: "center",
        maskClickable: false,
      },
      durationMs,
    );
  },
  fail(message, durationMs = 2500) {
    present(
      {
        message,
        icon: "fail",
        position: "center",
        maskClickable: false,
      },
      durationMs,
    );
  },
  hide() {
    OverlayStack.dismiss(TOAST_ID);
  },
};

/** Imperative + hook-compatible toast API (OverlayStack). */
export const Toast = toastApi;

export function useToast(): ToastApi {
  return toastApi;
}

export type ToastProviderProps = {
  children: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * No-op wrapper kept for Storybook / older call sites.
 * Toast mounts via OverlayStack; prefer ConfigProvider + RootSiblingParent.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>;
}

function BuiltinIcon({ name }: { name: ToastBuiltinIcon }) {
  if (name === "loading") {
    return <Spinner color="#ffffff" />;
  }
  return (
    <Text style={styles.iconGlyph}>{name === "success" ? "✓" : "✕"}</Text>
  );
}

function renderIcon(icon: ToastBuiltinIcon | ReactNode | undefined) {
  if (icon == null) return null;
  if (typeof icon === "string") {
    if (icon === "success" || icon === "fail" || icon === "loading") {
      return <BuiltinIcon name={icon} />;
    }
  }
  return <>{icon}</>;
}

/** Controlled toast host for Storybook / OverlayStack content. */
export type ToastHostProps = {
  message: string | null;
  icon?: ToastBuiltinIcon | ReactNode;
  position?: ToastPosition;
  /**
   * Allow presses through the toast layer.
   * @default false
   */
  maskClickable?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function ToastCard({
  message,
  icon,
  style,
  open,
}: {
  message: string | null;
  icon?: ToastBuiltinIcon | ReactNode;
  style?: StyleProp<ViewStyle>;
  open: boolean;
}) {
  const hasIcon = icon != null;
  return (
    <View style={[styles.card, hasIcon ? styles.cardWithIcon : null, style]}>
      {renderIcon(icon)}
      {open ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

/**
 * Full-screen toast layer (no RN.Modal). Used inside OverlayStack Host.
 */
export function ToastHost({
  message,
  icon,
  position = "center",
  maskClickable = false,
  style,
}: ToastHostProps) {
  const { height } = useWindowDimensions();
  const open = message != null && message.length > 0;
  const edgePad = Math.round(height * 0.2);

  const hostPositionStyle = useMemo(
    () => [
      styles.host,
      position === "top" && {
        justifyContent: "flex-start" as const,
        paddingTop: edgePad,
      },
      position === "bottom" && {
        justifyContent: "flex-end" as const,
        paddingBottom: edgePad,
      },
    ],
    [edgePad, position],
  );

  if (!open) return null;

  return (
    <View
      pointerEvents={maskClickable ? "none" : "auto"}
      style={[styles.fill, ...hostPositionStyle]}
      accessibilityLiveRegion="polite"
    >
      <ToastCard message={message} icon={icon} style={style} open={open} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
  },
  host: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    maxWidth: "72%",
    minWidth: 96,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  cardWithIcon: {
    minWidth: 112,
    paddingVertical: 18,
    paddingHorizontal: 22,
  },
  iconGlyph: {
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 32,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#ffffff",
  },
});
