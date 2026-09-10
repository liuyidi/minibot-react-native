import { useCallback, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 1,
  theme: themeOverride,
  style,
}: SliderProps) {
  const palette = useResolvedTheme(themeOverride);
  const [width, setWidth] = useState(0);

  const clamp = useCallback(
    (n: number) => Math.min(max, Math.max(min, n)),
    [min, max]
  );

  const ratio = max === min ? 0 : (clamp(value) - min) / (max - min);

  const updateFromX = (x: number) => {
    if (width <= 0) return;
    const next = min + (x / width) * (max - min);
    onValueChange(clamp(next));
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const onPress = (e: GestureResponderEvent) => {
    updateFromX(e.nativeEvent.locationX);
  };

  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      onLayout={onLayout}
      onPress={onPress}
      style={[styles.wrap, style]}
    >
      <View style={[styles.track, { backgroundColor: palette.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.round(ratio * 100)}%`,
              backgroundColor: palette.primary,
            },
          ]}
        />
      </View>
      <View
        pointerEvents="none"
        style={[
          styles.thumb,
          {
            left: `${Math.round(ratio * 100)}%`,
            backgroundColor: palette.card,
            borderColor: palette.primary,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 32,
    justifyContent: "center",
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    borderWidth: 2,
  },
});
