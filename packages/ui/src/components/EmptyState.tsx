import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";
import { Button } from "./Button";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  theme: themeOverride,
  style,
}: EmptyStateProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View style={[styles.wrap, style]}>
      <Text style={[styles.title, { color: palette.heading }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: palette.textSecondary }]}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          theme={themeOverride}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  action: {
    marginTop: 12,
    alignSelf: "stretch",
  },
});
