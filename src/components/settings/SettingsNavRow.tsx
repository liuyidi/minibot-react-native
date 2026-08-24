import type { LucideIcon } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAppTheme } from "@/hooks/useAppTheme";

type SettingsNavRowProps = {
  title: string;
  value?: string;
  icon?: LucideIcon;
  iconNode?: ReactNode;
  showDivider?: boolean;
  destructive?: boolean;
  onPress?: () => void;
};

export function SettingsNavRow({
  title,
  value,
  icon,
  iconNode,
  showDivider = true,
  destructive = false,
  onPress,
}: SettingsNavRowProps) {
  const theme = useAppTheme();

  const content = (
    <>
      {iconNode ? (
        <View style={styles.customIcon}>{iconNode}</View>
      ) : icon ? (
        <AppIcon
          icon={icon}
          size={20}
          color={destructive ? theme.red : theme.textSecondary}
        />
      ) : null}
      <ThemedText
        type="defaultSemiBold"
        numberOfLines={1}
        style={[styles.title, destructive ? { color: theme.red } : undefined]}
      >
        {title}
      </ThemedText>
      <View style={styles.trailing}>
        {value ? (
          <ThemedText type="secondary" numberOfLines={1} style={styles.value}>
            {value}
          </ThemedText>
        ) : null}
        {onPress && !destructive ? (
          <AppIcon icon={ChevronRight} size={18} color={theme.textSecondary} />
        ) : null}
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View
        style={[
          styles.row,
          showDivider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.border,
          },
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.border,
        },
        pressed ? styles.pressed : undefined,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
    maxWidth: "48%",
  },
  value: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 15,
  },
  pressed: {
    opacity: 0.72,
  },
  customIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
