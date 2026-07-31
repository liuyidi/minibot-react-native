import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExternalLink } from "@/components/ExternalLink";
import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getAppVersion } from "@/lib/settings/appVersion";

const APP_VERSION = getAppVersion();

export default function AboutAppScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const t = useT();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.hero,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={[styles.logo, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.logoText}>MB</ThemedText>
        </View>
        <ThemedText type="title" style={styles.appName}>
          Minibot
        </ThemedText>
        <ThemedText type="secondary">
          {t("about.versionLabel", { version: APP_VERSION })}
        </ThemedText>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText type="defaultSemiBold">{t("about.introTitle")}</ThemedText>
        <ThemedText type="secondary" style={styles.paragraph}>
          {t("about.introBody1")}
        </ThemedText>
        <ThemedText type="secondary" style={styles.paragraph}>
          {t("about.introBody2")}
        </ThemedText>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <ThemedText type="defaultSemiBold">{t("about.linksTitle")}</ThemedText>
        <ExternalLink href="https://github.com/liuyidi/minibot">
          <ThemedText type="link">{t("about.repoLink")}</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://github.com/liuyidi/minibot-react-native">
          <ThemedText type="link">{t("about.githubLink")}</ThemedText>
        </ExternalLink>
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
    gap: 16,
  },
  hero: {
    alignItems: "center",
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  appName: {
    fontSize: 24,
  },
  section: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  paragraph: {
    lineHeight: 22,
  },
});
