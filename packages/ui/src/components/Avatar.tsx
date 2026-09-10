import {
  View,
  Text,
  Image,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type AvatarProps = {
  uri?: string;
  initials?: string;
  size?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({
  uri,
  initials,
  size = 40,
  theme: themeOverride,
  style,
}: AvatarProps) {
  const palette = useResolvedTheme(themeOverride);
  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: palette.surface,
          },
          style as object,
        ]}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            color: palette.text,
            fontSize: Math.max(12, size * 0.36),
          },
        ]}
      >
        {(initials ?? "?").slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  initials: {
    fontWeight: "600",
  },
});
