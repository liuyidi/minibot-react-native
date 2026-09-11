import type { ReactNode } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

const OPACITY_MAP = {
  default: 0.55,
  thin: 0.35,
  thick: 0.75,
} as const;

const COLOR_RGB: Record<"black" | "white", string> = {
  black: "0, 0, 0",
  white: "255, 255, 255",
};

export type BackdropOpacity = keyof typeof OPACITY_MAP | number;
export type BackdropColor = "black" | "white" | (string & {});

export type BackdropProps = {
  visible: boolean;
  /** Tap mask to dismiss. */
  onPress?: () => void;
  /**
   * Mask depth. Named presets: `default` | `thin` | `thick`, or a number.
   * @default "default"
   */
  opacity?: BackdropOpacity;
  /**
   * Mask color. `"black"` / `"white"` combine with `opacity`;
   * any other string is used as the full background (opacity ignored).
   * @default "black"
   */
  color?: BackdropColor;
  /** Optional content centered above the mask. */
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  /**
   * Layout / layer styles. Supports:
   * - clip: `{ top, height }` or `{ top, bottom }` (leaves a region undimmed)
   * - fade: `{ opacity: Animated.Value }` (sheet open/close)
   */
  style?: StyleProp<Animated.WithAnimatedValue<ViewStyle>>;
  /** @default "box-none" */
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
};

function resolveBackground(
  color: BackdropColor,
  opacity: BackdropOpacity,
): string {
  const alpha =
    typeof opacity === "number" ? opacity : (OPACITY_MAP[opacity] ?? 0.55);
  const rgb = COLOR_RGB[color as "black" | "white"];
  if (rgb) return `rgba(${rgb}, ${alpha})`;
  return color;
}

function isClipped(
  style: StyleProp<Animated.WithAnimatedValue<ViewStyle>> | undefined,
): boolean {
  const flat = StyleSheet.flatten(style as StyleProp<ViewStyle>) as
    | ViewStyle
    | undefined;
  if (!flat) return false;
  if (typeof flat.height === "number") return true;
  return flat.top != null && flat.bottom != null;
}

/**
 * Background mask layer.
 * Host inside a Modal / Popup root so it covers the screen.
 * Pass `style={{ top, height }}` to cover only part of the window (e.g. below an anchor).
 */
export function Backdrop({
  visible,
  onPress,
  opacity = "default",
  color = "black",
  children,
  theme: themeOverride,
  style,
  pointerEvents = "box-none",
}: BackdropProps) {
  useResolvedTheme(themeOverride);
  if (!visible) return null;

  const backgroundColor = resolveBackground(color, opacity);
  const clipped = isClipped(style);

  return (
    <Animated.View
      pointerEvents={pointerEvents}
      style={[
        styles.rootBase,
        clipped ? null : styles.rootFill,
        { backgroundColor },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={onPress}
        style={styles.hit}
      />
      {children ? (
        <View style={styles.content} pointerEvents="box-none">
          {children}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rootBase: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  rootFill: {
    top: 0,
    bottom: 0,
  },
  hit: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
