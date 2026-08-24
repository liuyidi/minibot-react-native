import { CircleCheck, Smartphone, Sun, Moon } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useAppearance } from "@/context/AppearanceContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AppearanceMode } from "@/lib/settings/appearanceConfig";

export default function AppearanceSettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { mode, setMode } = useAppearance();

  const modeOptions: {
    value: AppearanceMode;
    label: string;
    description: string;
    icon: typeof Smartphone;
  }[] = [
    {
      value: "system",
      label: t("appearance.system"),
      description: t("appearance.systemDesc"),
      icon: Smartphone,
    },
    {
      value: "light",
      label: t("appearance.light"),
      description: t("appearance.lightDesc"),
      icon: Sun,
    },
    {
      value: "dark",
      label: t("appearance.dark"),
      description: t("appearance.darkDesc"),
      icon: Moon,
    },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="secondary" style={styles.hint}>
        {t("appearance.modeHint")}
      </ThemedText>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {modeOptions.map((option, index) => {
          const isSelected = mode === option.value;
          const isLast = index === modeOptions.length - 1;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => void setMode(option.value)}
              style={({ pressed }) => [
                styles.optionRow,
                !isLast && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: theme.background },
                ]}
              >
                <AppIcon
                  icon={option.icon}
                  size={20}
                  color={isSelected ? theme.primary : theme.textSecondary}
                />
              </View>
              <View style={styles.optionText}>
                <ThemedText type="defaultSemiBold" style={styles.optionLabel}>
                  {option.label}
                </ThemedText>
                <ThemedText type="secondary" style={styles.optionDesc}>
                  {option.description}
                </ThemedText>
              </View>
              {isSelected ? (
                <AppIcon icon={CircleCheck} size={22} color={theme.primary} />
              ) : (
                <View
                  style={[styles.radioOuter, { borderColor: theme.border }]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 10 },
  hint: { lineHeight: 22, marginBottom: 4 },
  card: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: { flex: 1, gap: 2 },
  optionLabel: { fontSize: 16 },
  optionDesc: { fontSize: 13 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  pressed: { opacity: 0.72 },
});
