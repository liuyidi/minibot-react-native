import {
  View,
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type TabItem = {
  key: string;
  label: string;
};

export type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Tabs({
  items,
  value,
  onChange,
  theme: themeOverride,
  style,
}: TabsProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: palette.border },
        style,
      ]}
    >
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item.key)}
            style={({ pressed }) => [
              styles.tab,
              {
                borderBottomColor: active ? palette.primary : "transparent",
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active ? palette.primary : palette.textSecondary,
                  fontWeight: active ? "600" : "400",
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 15,
  },
});
