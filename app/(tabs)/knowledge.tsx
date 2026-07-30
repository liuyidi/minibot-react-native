import { BookOpen, FolderOpen, Plus } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function KnowledgeScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const placeholderKbs = useMemo(
    () => [
      {
        id: "1",
        title: t("knowledge.kbProduct"),
        description: t("knowledge.kbProductDesc"),
        docCount: 12,
      },
      {
        id: "2",
        title: t("knowledge.kbEngineering"),
        description: t("knowledge.kbEngineeringDesc"),
        docCount: 8,
      },
    ],
    [t]
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}
      >
        <ThemedText type="title" style={styles.title}>
          {t("knowledge.title")}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("knowledge.addA11y")}
          hitSlop={10}
          style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
        >
          <AppIcon icon={Plus} size={22} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="secondary" style={styles.hint}>
          {t("knowledge.hint")}
        </ThemedText>

        {placeholderKbs.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: theme.background }]}
            >
              <AppIcon icon={BookOpen} size={22} color={theme.primary} />
            </View>
            <View style={styles.cardBody}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                {item.title}
              </ThemedText>
              <ThemedText type="secondary" numberOfLines={2}>
                {item.description}
              </ThemedText>
              <ThemedText type="secondary" style={styles.meta}>
                {t("knowledge.docsCount", { count: item.docCount })}
              </ThemedText>
            </View>
          </Pressable>
        ))}

        <View
          style={[
            styles.emptyHint,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AppIcon icon={FolderOpen} size={28} color={theme.textSecondary} />
          <ThemedText type="secondary" style={styles.emptyText}>
            {t("knowledge.emptyHint")}
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 32,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    gap: 12,
  },
  hint: {
    marginBottom: 4,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
  },
  emptyHint: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.72,
  },
});
