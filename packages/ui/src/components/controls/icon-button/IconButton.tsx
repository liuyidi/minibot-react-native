import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  children: ReactNode;
  theme?: Partial<UiTheme>;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  children,
  theme: themeOverride,
  size = 44,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
          backgroundColor: pressed ? palette.surface : "transparent",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
