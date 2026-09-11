import type { ReactNode } from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import {
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export type SafeAreaPosition = "top" | "bottom";

export type SafeAreaProps = {
  /**
   * Which edge inset to reserve (`top` | `bottom`).
   */
  position: SafeAreaPosition;
  style?: StyleProp<ViewStyle>;
  /**
   * Optional content. When set, applies the inset as padding around children
   * instead of rendering an empty spacer.
   */
  children?: ReactNode;
};

/**
 * Safe-area spacer (or padded wrapper).
 *
 * Inside RN `Modal` (BottomSheet / Dialog / ActionSheet), provider insets are
 * often 0 — fall back to `initialWindowMetrics` so home-indicator gap remains.
 */
export function SafeArea({ position, style, children }: SafeAreaProps) {
  const insets = useSafeAreaInsets();
  const fallback = initialWindowMetrics?.insets;
  const size =
    position === "top"
      ? Math.max(insets.top, fallback?.top ?? 0)
      : Math.max(insets.bottom, fallback?.bottom ?? 0);

  if (children != null) {
    return (
      <View
        style={[
          position === "top" ? { paddingTop: size } : { paddingBottom: size },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.spacer, { height: size }, style]}
    />
  );
}

const styles = StyleSheet.create({
  spacer: {
    width: "100%",
    flexShrink: 0,
  },
});
