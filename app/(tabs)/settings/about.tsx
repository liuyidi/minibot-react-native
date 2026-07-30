import { CloudDownload, Info } from "lucide-react-native";
import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsNavRow } from "@/components/settings/SettingsNavRow";
import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getAppVersion } from "@/lib/appVersion";

const APP_VERSION = getAppVersion();

export default function AboutSettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const handleCheckUpdate = () => {
    Alert.alert(
      t("about.upToDateTitle"),
      t("about.upToDateBody", { version: APP_VERSION })
    );
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
      <SettingsGroup>
        <SettingsNavRow
          title={t("about.checkUpdate")}
          value={`v${APP_VERSION}`}
          icon={CloudDownload}
          onPress={handleCheckUpdate}
        />
        <SettingsNavRow
          title={t("about.aboutApp")}
          icon={Info}
          showDivider={false}
          onPress={() => router.push("/(tabs)/settings/about-app")}
        />
      </SettingsGroup>

      <View style={styles.footer}>
        <ThemedText type="secondary">Minibot</ThemedText>
        <ThemedText type="secondary">
          {t("common.version")} {APP_VERSION}
        </ThemedText>
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
  footer: {
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
});
