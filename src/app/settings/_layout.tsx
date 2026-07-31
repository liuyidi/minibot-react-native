import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AndroidEdgeSwipeBack } from "@/components/navigation/AndroidEdgeSwipeBack";
import { renderSettingsStackHeader } from "@/components/settings/SettingsStackHeader";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function SettingsLayout() {
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { canAccessApp, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (!canAccessApp) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        header: renderSettingsStackHeader,
        contentStyle: { backgroundColor: theme.background },
        animation: "slide_from_right",
        // iOS: native interactive pop. Android: AndroidEdgeSwipeBack via screenLayout.
        gestureEnabled: true,
      }}
      screenLayout={({ children }) => (
        <AndroidEdgeSwipeBack>{children}</AndroidEdgeSwipeBack>
      )}
    >
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
