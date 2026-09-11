import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

/** Semantic button type. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "success"
  | "warning";

/** Fill mode. */
export type ButtonFill = "solid" | "outline" | "none";

/** Button size. */
export type ButtonSize = "mini" | "small" | "middle" | "large";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  /** Button content (text or custom node). */
  children?: ReactNode;
  variant?: ButtonVariant;
  /** @default solid (ghost defaults to none) */
  fill?: ButtonFill;
  /** @default middle */
  size?: ButtonSize;
  /** Full-width block button. */
  block?: boolean;
  /** Partial theme override (escape hatch). */
  theme?: Partial<UiTheme>;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Tone = { solidBg: string; solidFg: string; accent: string };

function resolveTone(variant: ButtonVariant, palette: UiTheme): Tone {
  switch (variant) {
    case "primary":
      return {
        solidBg: palette.primary,
        solidFg: palette.onPrimary,
        accent: palette.primary,
      };
    case "secondary":
      return {
        solidBg: palette.surface,
        solidFg: palette.text,
        accent: palette.text,
      };
    case "ghost":
      return {
        solidBg: "transparent",
        solidFg: palette.text,
        accent: palette.text,
      };
    case "destructive":
      return {
        solidBg: palette.red,
        solidFg: "#ffffff",
        accent: palette.red,
      };
    case "success":
      return {
        solidBg: palette.green,
        solidFg: "#ffffff",
        accent: palette.green,
      };
    case "warning":
      return {
        solidBg: palette.yellow,
        solidFg: "#ffffff",
        accent: palette.yellow,
      };
  }
}

const SIZE_STYLE: Record<
  ButtonSize,
  { minHeight: number; paddingHorizontal: number; fontSize: number; radius: number }
> = {
  mini: { minHeight: 28, paddingHorizontal: 10, fontSize: 12, radius: 6 },
  small: { minHeight: 36, paddingHorizontal: 12, fontSize: 14, radius: 8 },
  middle: { minHeight: 44, paddingHorizontal: 16, fontSize: 16, radius: 10 },
  large: { minHeight: 48, paddingHorizontal: 20, fontSize: 18, radius: 10 },
};

function isTexty(node: ReactNode): boolean {
  return (
    node == null ||
    typeof node === "boolean" ||
    typeof node === "string" ||
    typeof node === "number"
  );
}

function renderChildren(
  children: ReactNode,
  fg: string,
  fontSize: number,
  loading: boolean,
) {
  if (children == null || children === false) return null;

  const textStyle = [
    styles.text,
    { color: fg, fontSize },
    loading ? styles.textLoading : null,
  ];

  if (typeof children === "string" || typeof children === "number") {
    return <Text style={textStyle}>{children}</Text>;
  }

  // `时间 · {time}` becomes ["时间 · ", "14:30"] — must wrap in Text.
  if (Array.isArray(children) && children.every(isTexty)) {
    return <Text style={textStyle}>{children}</Text>;
  }

  return children;
}

export function Button({
  children,
  variant = "primary",
  fill: fillProp,
  size = "middle",
  block = false,
  theme: themeOverride,
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const palette = useResolvedTheme(themeOverride);
  const fill: ButtonFill =
    fillProp ?? (variant === "ghost" ? "none" : "solid");
  const tone = resolveTone(variant, palette);
  const sizeTok = SIZE_STYLE[size];

  let bg = tone.solidBg;
  let fg = tone.solidFg;
  let borderColor = tone.accent;
  let borderWidth = StyleSheet.hairlineWidth;

  if (fill === "outline") {
    bg = "transparent";
    fg = tone.accent;
    borderColor = tone.accent;
    borderWidth = StyleSheet.hairlineWidth;
  } else if (fill === "none") {
    bg = "transparent";
    fg = tone.accent;
    borderColor = "transparent";
    borderWidth = 0;
  } else if (variant === "secondary") {
    borderColor = palette.border;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: sizeTok.minHeight,
          paddingHorizontal: sizeTok.paddingHorizontal,
          borderRadius: sizeTok.radius,
          backgroundColor: bg,
          borderColor,
          borderWidth,
          alignSelf: block ? "stretch" : "flex-start",
          width: block ? "100%" : undefined,
          opacity: disabled ? 0.4 : loading ? 0.7 : pressed ? 0.88 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={fg} size="small" /> : null}
        {renderChildren(children, fg, sizeTok.fontSize, loading)}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  textLoading: {
    opacity: 0.9,
  },
});
