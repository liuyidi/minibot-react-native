import { CircleCheck, Smartphone, Sun, Moon } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useAppearance } from "@/context/AppearanceContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AppearanceMode } from "@/lib/appearanceConfig";
import { THEME_IDS, getThemeDefinition } from "@/lib/theme/registry";
import type { ThemeId } from "@/lib/theme/types";

export default function AppearanceSettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { mode, setMode, themeId, setThemeId } = useAppearance();

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

  const packDesc = (id: ThemeId) =>
    id === "claude" ? t("appearance.packClaudeDesc") : t("appearance.packCodexDesc");
  const packName = (id: ThemeId) =>
    id === "claude" ? t("appearance.packClaude") : t("appearance.packCodex");

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="secondary" style={styles.sectionLabel}>
        {t("appearance.sectionTheme")}
      </ThemedText>
      <ThemedText type="secondary" style={styles.hint}>
        {t("appearance.themeHint")}
      </ThemedText>

      <View style={styles.themeGrid}>
        {THEME_IDS.map((id) => {
          const def = getThemeDefinition(id);
          const selected = themeId === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => void setThemeId(id as ThemeId)}
              style={({ pressed }) => [
                styles.themeCard,
                {
                  backgroundColor: theme.card,
                  borderColor: selected ? theme.primary : theme.border,
                  borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.swatchRow}>
                {def.swatches.map((color) => (
                  <View
                    key={color}
                    style={[styles.swatch, { backgroundColor: color }]}
                  />
                ))}
              </View>
              <View style={styles.themeMeta}>
                <ThemedText type="defaultSemiBold">{packName(id)}</ThemedText>
                {selected ? (
                  <AppIcon icon={CircleCheck} size={18} color={theme.primary} />
                ) : null}
              </View>
              <ThemedText type="secondary" style={styles.themeDesc} numberOfLines={2}>
                {packDesc(id)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText type="secondary" style={[styles.sectionLabel, styles.sectionGap]}>
        {t("appearance.sectionMode")}
      </ThemedText>
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionGap: { marginTop: 16 },
  hint: { lineHeight: 22, marginBottom: 4 },
  themeGrid: { gap: 10 },
  themeCard: { borderRadius: 16, padding: 14, gap: 8 },
  swatchRow: { flexDirection: "row", gap: 8 },
  swatch: { width: 28, height: 28, borderRadius: 8 },
  themeMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeDesc: { fontSize: 13, lineHeight: 18 },
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
