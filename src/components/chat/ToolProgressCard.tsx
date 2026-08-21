import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { ToolProgressLine } from "@/lib/minibot/wsTurn";

type ToolProgressCardProps = {
  lines: ToolProgressLine[];
};

export function ToolProgressCard({ lines }: ToolProgressCardProps) {
  const theme = useAppTheme();
  const { t } = useLanguage();

  if (!lines.length) {
    return null;
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {t("chat.toolsProgress")}
      </ThemedText>
      {lines.map((line) => {
        const label = line.name?.trim() || line.text.trim() || "tool";
        const phase = line.phase?.trim();
        return (
          <ThemedText key={line.id} type="secondary" style={styles.row}>
            {phase ? `${label} · ${phase}` : label}
          </ThemedText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 0,
    marginRight: 8,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  title: {
    fontSize: 13,
    marginBottom: 2,
  },
  row: {
    fontSize: 13,
    lineHeight: 18,
  },
});
