import { type ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";

type SettingsGroupProps = ViewProps & {
  children: ReactNode;
  /** Optional section label above the group. */
  title?: string;
};

export function SettingsGroup({
  children,
  title,
  style,
  ...rest
}: SettingsGroupProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrap}>
      {title ? (
        <ThemedText type="secondary" style={styles.title}>
          {title}
        </ThemedText>
      ) : null}
      <View
        style={[
          styles.group,
          { backgroundColor: theme.card, borderColor: theme.border },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
    paddingHorizontal: 4,
  },
  group: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
