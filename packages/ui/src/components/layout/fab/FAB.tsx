import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type PressableProps,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type FABVariant = "circle" | "edge";

export type FABProps = Omit<PressableProps, "children" | "style"> & {
  /** Icon or short content inside the control. */
  children?: ReactNode;
  /** Leading icon for `variant="edge"` (also used as circle content when no children). */
  icon?: ReactNode;
  /** Text label; circle falls back to "+" when no children/icon. */
  label?: string;
  /** `circle` = classic FAB; `edge` = side assist strip (求助建议). */
  variant?: FABVariant;
  /**
   * When `variant="edge"`: self-position to the right edge.
   * Set `false` to only render appearance (parent handles layout).
   * @default true
   */
  docked?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function FAB({
  children,
  icon,
  label,
  variant = "circle",
  docked = true,
  theme: themeOverride,
  style,
  disabled,
  ...rest
}: FABProps) {
  const palette = useResolvedTheme(themeOverride);
  const isEdge = variant === "edge";

  const content = isEdge ? (
    <>
      {icon ? <>{icon}</> : null}
      {children ?? (
        <Text style={[styles.edgeLabel, { color: palette.onPrimary }]}>
          {label ?? "求助"}
        </Text>
      )}
    </>
  ) : (
    (children ??
      icon ?? (
        <Text style={[styles.circleLabel, { color: palette.onPrimary }]}>
          {label ?? "+"}
        </Text>
      ))
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        isEdge ? styles.edge : styles.circle,
        isEdge && docked ? styles.edgeDocked : null,
        {
          backgroundColor: isEdge ? palette.heading : palette.primary,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  circleLabel: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
  edge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 36,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: -1, height: 1 },
  },
  edgeDocked: {
    position: "absolute",
    right: 0,
    top: "45%",
    zIndex: 50,
  },
  edgeLabel: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
});
