import {
  BarChart3,
  Box,
  ChevronRight,
  CircleUser,
  Info,
  Key,
  Languages,
  Lightbulb,
  Palette,
} from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsNavRow } from "@/components/settings/SettingsNavRow";
import { ThemedText } from "@/components/ThemedText";
import { useChatPreferences } from "@/context/ChatPreferencesContext";
import { useAppearance } from "@/context/AppearanceContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMinibot } from "@/context/MinibotClientContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  maskEmail,
  maskPhone,
  type AccountInfo,
  getAccountInfo,
} from "@/lib/settings/accountConfig";
import { LANGUAGE_LABELS } from "@/lib/i18n/languageLabels";
import { getAppVersion } from "@/lib/settings/appVersion";
import { MODEL_LABELS } from "@/lib/settings/modelLabels";
import { getDeepSeekApiKey, maskApiKey } from "@/lib/deepseek/config";
import { formatTokenCount, getTokenUsageStats } from "@/lib/settings/tokenUsageConfig";
import {
  getProfileInitial,
  getUserProfile,
  type UserProfile,
} from "@/lib/settings/userProfileConfig";

const APP_VERSION = getAppVersion();

export default function SettingsHubScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { mode: appearanceMode, setMode, themeDefinition } = useAppearance();
  const { language } = useLanguage();
  const { model, isThinkingActive } = useChatPreferences();
  const { user: authUser, logout } = useAuth();
  const { status: minibotStatus, isConnected, modelName } = useMinibot();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [apiKeySummary, setApiKeySummary] = useState("—");
  const [usageSummary, setUsageSummary] = useState("0");

  const statusLabel = (status: string) => {
    switch (status) {
      case "idle":
        return t("me.statusIdle");
      case "connecting":
        return t("me.statusConnecting");
      case "open":
        return t("me.statusOpen");
      case "reconnecting":
        return t("me.statusReconnecting");
      case "closed":
        return t("me.statusClosed");
      case "error":
        return t("me.statusError");
      default:
        return status;
    }
  };

  const appearanceLabel = () => {
    switch (appearanceMode) {
      case "light":
        return t("appearance.light");
      case "dark":
        return t("appearance.dark");
      default:
        return t("appearance.system");
    }
  };

  const loadPreviewData = useCallback(async () => {
    const [nextProfile, nextAccount, apiKey, usageStats] = await Promise.all([
      getUserProfile(),
      getAccountInfo(),
      getDeepSeekApiKey(),
      getTokenUsageStats(),
    ]);
    setProfile(nextProfile);
    setAccount(nextAccount);
    setApiKeySummary(apiKey ? maskApiKey(apiKey) : "—");
    setUsageSummary(formatTokenCount(usageStats.totalTokens));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPreviewData();
    }, [loadPreviewData])
  );

  const handleLogout = () => {
    Alert.alert(t("me.logoutConfirmTitle"), t("me.logoutConfirmMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("me.logout"),
        style: "destructive",
        onPress: () => {
          void logout().then(async () => {
            await setMode("system");
            router.replace("/(auth)/login");
          });
        },
      },
    ]);
  };

  const profileName =
    authUser?.nickname ?? profile?.nickname ?? t("me.defaultName");
  const profileBio =
    authUser?.bio?.trim() ||
    profile?.bio ||
    authUser?.email ||
    t("me.defaultBio");

  const accountHubValue = account?.phone
    ? maskPhone(account.phone)
    : account?.wechatBound
      ? t("me.wechatBound")
      : account?.email
        ? maskEmail(account.email)
        : t("me.unbound");

  const serverValue = isConnected
    ? modelName
      ? t("me.connectedWithModel", { model: modelName })
      : t("me.statusOpen")
    : statusLabel(minibotStatus);

  const connectionTone = isConnected ? theme.green : theme.textSecondary;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 108,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("me.editProfile")}
        onPress={() => router.push("/settings/profile")}
        style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: profile?.avatarColor ?? theme.primary },
          ]}
        >
          <ThemedText style={styles.avatarText}>
            {getProfileInitial(profileName)}
          </ThemedText>
        </View>
        <View style={styles.identityText}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {profileName}
          </ThemedText>
          <ThemedText type="secondary" numberOfLines={2} style={styles.bio}>
            {profileBio}
          </ThemedText>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: connectionTone }]} />
            <ThemedText type="secondary" style={styles.statusLabel}>
              {serverValue}
            </ThemedText>
          </View>
        </View>
        <AppIcon icon={ChevronRight} size={20} color={theme.textSecondary} />
      </Pressable>

      <View style={styles.sections}>
        <SettingsGroup title={t("me.sectionPrefs")}>
          <SettingsNavRow
            title={t("me.appearance")}
            value={`${themeDefinition.name} · ${appearanceLabel()}`}
            icon={Palette}
            onPress={() => router.push("/settings/appearance")}
          />
          <SettingsNavRow
            title={t("me.language")}
            value={LANGUAGE_LABELS[language]}
            icon={Languages}
            onPress={() => router.push("/settings/language")}
          />
          <SettingsNavRow
            title={t("me.model")}
            value={MODEL_LABELS[model]}
            icon={Box}
            onPress={() => router.push("/settings/model")}
          />
          <SettingsNavRow
            title={t("me.thinking")}
            value={isThinkingActive ? t("common.on") : t("common.off")}
            icon={Lightbulb}
            showDivider={false}
            onPress={() => router.push("/settings/thinking")}
          />
        </SettingsGroup>

        <SettingsGroup title={t("me.sectionAccount")}>
          <SettingsNavRow
            title={t("me.account")}
            value={accountHubValue}
            icon={CircleUser}
            onPress={() => router.push("/settings/account")}
          />
          <SettingsNavRow
            title={t("me.apiKey")}
            value={apiKeySummary}
            icon={Key}
            onPress={() => router.push("/settings/api-key")}
          />
          <SettingsNavRow
            title={t("me.usage")}
            value={usageSummary}
            icon={BarChart3}
            showDivider={false}
            onPress={() => router.push("/settings/usage")}
          />
        </SettingsGroup>

        <SettingsGroup title={t("me.sectionAbout")}>
          <SettingsNavRow
            title={t("me.about")}
            value={`v${APP_VERSION}`}
            icon={Info}
            showDivider={false}
            onPress={() => router.push("/settings/about")}
          />
        </SettingsGroup>

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
        >
          <ThemedText style={[styles.logoutText, { color: theme.red }]}>
            {t("me.logout")}
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 28 },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  identityText: { flex: 1, gap: 4, minWidth: 0 },
  name: { fontSize: 24, letterSpacing: -0.3 },
  bio: { fontSize: 14, lineHeight: 20 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 13, flexShrink: 1 },
  sections: { gap: 22 },
  logout: { alignItems: "center", paddingVertical: 14 },
  logoutText: { fontSize: 16, fontWeight: "600" },
  pressed: { opacity: 0.72 },
});
