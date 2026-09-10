import type { ReactNode } from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type ScreenProps = {
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  /** Optional padding (e.g. safe-area insets from the app). */
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
};

/** Full-screen surface. Safe-area insets stay in the app layer. */
export function Screen({
  children,
  theme: themeOverride,
  style,
  paddingTop,
  paddingBottom,
  paddingHorizontal,
}: ScreenProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: palette.background,
          paddingTop,
          paddingBottom,
          paddingHorizontal,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
