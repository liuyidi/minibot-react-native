import { Mail, Trash2 } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GitHubProviderIcon, GoogleProviderIcon } from "@/components/auth/ProviderIcons";
import { EditFieldModal } from "@/components/settings/EditFieldModal";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsNavRow } from "@/components/settings/SettingsNavRow";
import { useAppearance } from "@/context/AppearanceContext";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  EMPTY_IDENTITIES,
  fetchUserIdentities,
  type UserIdentities,
} from "@/lib/auth/identities";
import { deleteAccount } from "@/lib/auth/session";
import {
  DEFAULT_ACCOUNT,
  getAccountInfo,
  maskEmail,
  setAccountInfo,
  type AccountInfo,
} from "@/lib/settings/accountConfig";

export default function AccountSettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { setMode } = useAppearance();
  const { logout, getAccessToken, loginWithGoogle, loginWithGitHub } = useAuth();
  const [account, setAccount] = useState<AccountInfo>(DEFAULT_ACCOUNT);
  const [identities, setIdentities] = useState<UserIdentities>(EMPTY_IDENTITIES);
  const [editingField, setEditingField] = useState<"email" | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<"google" | "github" | null>(
    null
  );

  const loadData = useCallback(async () => {
    setAccount(await getAccountInfo());
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setIdentities(EMPTY_IDENTITIES);
      return;
    }
    try {
      setIdentities(await fetchUserIdentities(accessToken));
    } catch {
      setIdentities(EMPTY_IDENTITIES);
    }
  }, [getAccessToken]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const updateAccount = async (next: AccountInfo) => {
    setAccount(next);
    await setAccountInfo(next);
  };

  const handleFieldSave = (field: "email", value: string) => {
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      Alert.alert(t("account.invalidEmailTitle"), t("account.invalidEmailBody"));
      return;
    }
    void updateAccount({
      ...account,
      [field]: value,
    });
    setEditingField(null);
  };

  const handleProviderBind = (provider: "google" | "github") => {
    const isBound = provider === "google" ? identities.google : identities.github;
    if (isBound) {
      return;
    }

    const title =
      provider === "google" ? t("account.bindGoogleTitle") : t("account.bindGithubTitle");
    const body =
      provider === "google" ? t("account.bindGoogleBody") : t("account.bindGithubBody");

    Alert.alert(title, body, [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("account.bind"),
        onPress: () => {
          void (async () => {
            setLinkingProvider(provider);
            try {
              if (provider === "google") {
                await loginWithGoogle();
              } else {
                await loginWithGitHub();
              }
              await loadData();
            } catch (error) {
              Alert.alert(
                t("account.bindFailedTitle"),
                error instanceof Error ? error.message : t("account.bindFailedBody")
              );
            } finally {
              setLinkingProvider(null);
            }
          })();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("account.deleteAccountTitle"), t("account.deleteAccountBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("account.deleteConfirm"),
        style: "destructive",
        onPress: () => {
          void deleteAccount().then(async () => {
            await logout();
            await setMode("system");
            router.replace("/(auth)/login");
          });
        },
      },
    ]);
  };

  const providerValue = (linked: UserIdentities["google"]) =>
    linked ? linked.displayName || t("account.bound") : t("account.unbound");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 24,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SettingsGroup>
          <SettingsNavRow
            title={t("account.google")}
            value={providerValue(identities.google)}
            iconNode={<GoogleProviderIcon />}
            onPress={
              identities.google || linkingProvider === "google"
                ? undefined
                : () => handleProviderBind("google")
            }
          />
          <SettingsNavRow
            title={t("account.github")}
            value={providerValue(identities.github)}
            iconNode={<GitHubProviderIcon />}
            onPress={
              identities.github || linkingProvider === "github"
                ? undefined
                : () => handleProviderBind("github")
            }
          />
          <SettingsNavRow
            title={t("account.email")}
            value={account.email ? maskEmail(account.email) : t("account.notSet")}
            icon={Mail}
            showDivider={false}
            onPress={() => setEditingField("email")}
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsNavRow
            title={t("account.deleteAccountTitle")}
            icon={Trash2}
            destructive
            showDivider={false}
            onPress={handleDeleteAccount}
          />
        </SettingsGroup>

        <EditFieldModal
          visible={editingField === "email"}
          title={t("account.changeEmail")}
          value={account.email}
          placeholder="name@example.com"
          keyboardType="email-address"
          onClose={() => setEditingField(null)}
          onSave={(value) => handleFieldSave("email", value)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
