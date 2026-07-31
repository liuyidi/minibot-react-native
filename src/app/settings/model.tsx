import { CircleCheck } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useChatPreferences } from "@/context/ChatPreferencesContext";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MODEL_OPTIONS } from "@/lib/settings/modelLabels";

export default function ModelSettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const t = useT();
  const { model, setModel } = useChatPreferences();

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
        {t("model.hint")}
      </ThemedText>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {MODEL_OPTIONS.map((option, index) => {
          const isSelected = model === option.value;
          const isLast = index === MODEL_OPTIONS.length - 1;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => void setModel(option.value)}
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
              <ThemedText type="defaultSemiBold" style={styles.optionLabel}>
                {option.label}
              </ThemedText>
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
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  hint: {
    lineHeight: 22,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
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
  optionLabel: {
    flex: 1,
    fontSize: 16,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.72,
  },
});
