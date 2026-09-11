import type { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type PickerGroupItem = {
  title?: string;
  children: ReactNode;
};

export type PickerGroupProps = {
  /** Side-by-side picker panels (e.g. 取车时间 | 还车时间). */
  items: PickerGroupItem[];
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function PickerGroup({ items, theme: themeOverride, style }: PickerGroupProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View style={[styles.row, style]}>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          {item.title ? (
            <Text style={[styles.title, { color: palette.textSecondary }]}>
              {item.title}
            </Text>
          ) : null}
          {item.children}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  item: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 13,
    marginBottom: 4,
  },
});
