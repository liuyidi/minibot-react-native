import {
  Pressable,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Star } from "lucide-react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";

export type RateProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** @default 5 */
  count?: number;
  /** Allow clearing by tapping the active star again. @default true */
  allowClear?: boolean;
  /** @default false */
  readonly?: boolean;
  size?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Rate({
  value: valueProp,
  defaultValue = 0,
  onChange,
  count = 5,
  allowClear = true,
  readonly = false,
  size = 28,
  theme: themeOverride,
  style,
}: RateProps) {
  const palette = useResolvedTheme(themeOverride);
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue,
    onChange,
  );

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }, (_, i) => {
        const star = i + 1;
        const active = star <= value;
        return (
          <Pressable
            key={star}
            disabled={readonly}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star}`}
            hitSlop={4}
            onPress={() => {
              if (allowClear && value === star) setValue(0);
              else setValue(star);
            }}
            style={({ pressed }) => [
              { opacity: readonly ? 1 : pressed ? 0.7 : 1 },
            ]}
          >
            <Star
              size={size}
              color={active ? palette.yellow : palette.border}
              fill={active ? palette.yellow : "transparent"}
              strokeWidth={active ? 0 : 2}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
