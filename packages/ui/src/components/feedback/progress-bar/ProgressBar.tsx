import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type ProgressBarProps = {
  /** 0–1 */
  progress: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  progress,
  theme: themeOverride,
  style,
}: ProgressBarProps) {
  const palette = useResolvedTheme(themeOverride);
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { backgroundColor: palette.border }, style]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${Math.round(clamped * 100)}%`,
            backgroundColor: palette.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
