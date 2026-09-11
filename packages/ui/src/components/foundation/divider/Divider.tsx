import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type DividerProps = {
  inset?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Divider({ inset = false, theme: themeOverride, style }: DividerProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor: palette.border,
          marginLeft: inset ? 16 : 0,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});
