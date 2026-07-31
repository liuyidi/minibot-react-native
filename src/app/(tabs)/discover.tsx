import {
  Blocks,
  Puzzle,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { TranslateFn } from "@/lib/i18n";

type DiscoverSection = "skills" | "mcp" | "tools";

type CatalogItem = {
  id: string;
  name: string;
  description: string;
  badge?: string;
};

function getSections(t: TranslateFn): {
  id: DiscoverSection;
  title: string;
  icon: LucideIcon;
}[] {
  return [
    { id: "skills", title: t("discover.skills"), icon: Sparkles },
    { id: "mcp", title: t("discover.mcp"), icon: Blocks },
    { id: "tools", title: t("discover.tools"), icon: Wrench },
  ];
}

function getCatalog(t: TranslateFn): Record<DiscoverSection, CatalogItem[]> {
  return {
    skills: [
      {
        id: "long-goal",
        name: "long-goal",
        description: t("discover.skillLongGoal"),
        badge: t("discover.badgeBuiltin"),
      },
      {
        id: "cron",
        name: "cron",
        description: t("discover.skillCron"),
        badge: t("discover.badgeBuiltin"),
      },
      {
        id: "github",
        name: "github",
        description: t("discover.skillGithub"),
        badge: t("discover.badgeBuiltin"),
      },
    ],
    mcp: [
      {
        id: "filesystem",
        name: "filesystem",
        description: t("discover.mcpFilesystem"),
        badge: "preset",
      },
      {
        id: "browser",
        name: "browser",
        description: t("discover.mcpBrowser"),
        badge: "preset",
      },
    ],
    tools: [
      {
        id: "shell",
        name: "shell",
        description: t("discover.toolShell"),
        badge: "core",
      },
      {
        id: "web_search",
        name: "web_search",
        description: t("discover.toolWebSearch"),
        badge: "core",
      },
      {
        id: "web_fetch",
        name: "web_fetch",
        description: t("discover.toolWebFetch"),
        badge: "core",
      },
    ],
  };
}

export default function DiscoverScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [section, setSection] = useState<DiscoverSection>("skills");

  const sections = useMemo(() => getSections(t), [t]);
  const catalog = useMemo(() => getCatalog(t), [t]);
  const items = catalog[section];

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
          {t("discover.title")}
        </ThemedText>
        <ThemedText type="secondary" style={styles.subtitle}>
          {t("discover.subtitle")}
        </ThemedText>
      </View>

      <View style={styles.segmentRow}>
        {sections.map((item) => {
          const active = section === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSection(item.id)}
              style={({ pressed }) => [
                styles.segment,
                {
                  backgroundColor: active ? theme.primary + "14" : theme.card,
                  borderColor: active ? theme.primary : theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <AppIcon
                icon={item.icon}
                size={16}
                color={active ? theme.primary : theme.textSecondary}
              />
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.segmentText,
                  active ? { color: theme.primary } : undefined,
                ]}
              >
                {item.title}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="secondary" style={styles.hint}>
          {t("discover.hint")}
        </ThemedText>

        {items.map((item) => (
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
              <AppIcon
                icon={section === "skills" ? Puzzle : sections.find((s) => s.id === section)!.icon}
                size={20}
                color={theme.primary}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  {item.name}
                </ThemedText>
                {item.badge ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: theme.background, borderColor: theme.border },
                    ]}
                  >
                    <ThemedText type="secondary" style={styles.badgeText}>
                      {item.badge}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
              <ThemedText type="secondary" numberOfLines={2}>
                {item.description}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  title: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 13,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
  },
  segmentText: {
    fontSize: 13,
  },
  content: {
    padding: 20,
    gap: 10,
  },
  hint: {
    marginBottom: 4,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    flexShrink: 1,
  },
  badge: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
  },
  pressed: {
    opacity: 0.72,
  },
});
