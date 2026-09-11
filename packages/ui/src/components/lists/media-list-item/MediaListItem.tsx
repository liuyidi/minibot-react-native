import type { ReactNode } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Card } from "../../foundation/card";

export type MediaListItemProps = {
  /** Left media / thumbnail slot. */
  prefix?: ReactNode;
  title: string;
  /** Multi-line or custom description under title. */
  description?: ReactNode;
  /** Right column (price, action, etc.). */
  extra?: ReactNode;
  onPress?: () => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Slot-based list row: prefix | title/description | extra.
 * Suitable for product / package cards.
 */
export function MediaListItem({
  prefix,
  title,
  description,
  extra,
  onPress,
  theme: themeOverride,
  style,
}: MediaListItemProps) {
  const palette = useResolvedTheme(themeOverride);

  const body = (
    <Card theme={themeOverride} style={[styles.card, style]}>
      <View style={styles.row}>
        {prefix ? <View style={styles.prefix}>{prefix}</View> : null}
        <View style={styles.main}>
          <Text
            style={[styles.title, { color: palette.heading }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {description != null && description !== false ? (
            <View style={styles.description}>
              {typeof description === "string" ? (
                <Text
                  style={[styles.descText, { color: palette.textSecondary }]}
                >
                  {description}
                </Text>
              ) : (
                description
              )}
            </View>
          ) : null}
        </View>
        {extra ? <View style={styles.extra}>{extra}</View> : null}
      </View>
    </Card>
  );

  if (!onPress) return body;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 0.92 }}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  prefix: {
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  description: {
    gap: 2,
  },
  descText: {
    fontSize: 12,
    lineHeight: 18,
  },
  extra: {
    flexShrink: 0,
    alignItems: "flex-end",
    gap: 8,
  },
});
