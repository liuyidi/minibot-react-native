import { Stack } from "expo-router";

import { renderSettingsStackHeader } from "@/components/settings/SettingsStackHeader";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function SettingsLayout() {
  const theme = useAppTheme();
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        header: renderSettingsStackHeader,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: t("settingsTitles.profile") }} />
      <Stack.Screen
        name="appearance"
        options={{ title: t("settingsTitles.appearance") }}
      />
      <Stack.Screen name="language" options={{ title: t("settingsTitles.language") }} />
      <Stack.Screen name="account" options={{ title: t("settingsTitles.account") }} />
      <Stack.Screen name="api-key" options={{ title: t("settingsTitles.apiKey") }} />
      <Stack.Screen name="server" options={{ title: t("settingsTitles.server") }} />
      <Stack.Screen name="model" options={{ title: t("settingsTitles.model") }} />
      <Stack.Screen name="thinking" options={{ title: t("settingsTitles.thinking") }} />
      <Stack.Screen name="usage" options={{ title: t("settingsTitles.usage") }} />
      <Stack.Screen name="about" options={{ title: t("settingsTitles.about") }} />
      <Stack.Screen name="about-app" options={{ title: t("settingsTitles.aboutApp") }} />
    </Stack>
  );
}
