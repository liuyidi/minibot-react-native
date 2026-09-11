import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";

export type SegmentedOption = {
  label: string;
  value: string;
};

export type SegmentedControlProps = {
  options: SegmentedOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. Defaults to first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedControl({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  theme: themeOverride,
  style,
}: SegmentedControlProps) {
  const palette = useResolvedTheme(themeOverride);
  const fallback = defaultValue ?? options[0]?.value ?? "";
  const [value, setValue] = useControllableState(valueProp, fallback, onChange);

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setValue(opt.value)}
            style={[
              styles.segment,
              selected && {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? palette.heading : palette.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
