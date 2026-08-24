import { CircleCheck } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useAppearance } from "@/context/AppearanceContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { THEME_IDS, getThemeDefinition } from "@/lib/theme/registry";
import type { ThemeId } from "@/lib/theme/types";

export default function ThemeSettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { themeId, setThemeId } = useAppearance();

  const packDesc = (id: ThemeId) => {
    if (id === "brand") return t("theme.packBrandDesc");
    if (id === "claude") return t("theme.packClaudeDesc");
    return t("theme.packCodexDesc");
  };
  const packName = (id: ThemeId) => {
    if (id === "brand") return t("theme.packBrand");
    if (id === "claude") return t("theme.packClaude");
    return t("theme.packCodex");
  };

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
        {t("theme.hint")}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 10 },
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
  pressed: { opacity: 0.72 },
});
