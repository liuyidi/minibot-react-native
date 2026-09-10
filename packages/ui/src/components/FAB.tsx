import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type PressableProps,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type FABProps = Omit<PressableProps, "children" | "style"> & {
  /** Icon or short content inside the circle. */
  children?: ReactNode;
  /** Text label alternative when children omitted. */
  label?: string;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function FAB({
  children,
  label,
  theme: themeOverride,
  style,
  disabled,
  ...rest
}: FABProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: palette.primary,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {children ?? (
        <Text style={[styles.label, { color: palette.onPrimary }]}>
          {label ?? "+"}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
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
  label: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
});
