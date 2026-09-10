import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type CardProps = ViewProps & {
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Card({ theme: themeOverride, style, children, ...rest }: CardProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
});
