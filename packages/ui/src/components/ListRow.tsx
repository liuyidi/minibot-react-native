import type { ReactNode } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type ListRowProps = {
  title: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showDivider?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({
  title,
  value,
  onPress,
  destructive = false,
  showDivider = false,
  leading,
  trailing,
  theme: themeOverride,
  style,
}: ListRowProps) {
  const palette = useResolvedTheme(themeOverride);
  const titleColor = destructive ? palette.red : palette.text;

  const content = (
    <>
      <View style={styles.row}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        {value ? (
          <Text
            style={[styles.value, { color: palette.textSecondary }]}
            numberOfLines={1}
          >
            {value}
          </Text>
        ) : null}
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
      {showDivider ? (
        <View style={[styles.divider, { backgroundColor: palette.border }]} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.7 : 1 },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={style}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leading: {
    marginRight: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  value: {
    fontSize: 15,
    maxWidth: "45%",
  },
  trailing: {
    marginLeft: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});
