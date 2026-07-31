import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EditFieldModal } from "@/components/settings/EditFieldModal";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsNavRow } from "@/components/settings/SettingsNavRow";
import { useAppearance } from "@/context/AppearanceContext";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  DEFAULT_ACCOUNT,
  getAccountInfo,
  maskEmail,
  maskPhone,
  setAccountInfo,
  type AccountInfo,
} from "@/lib/settings/accountConfig";
import { deleteAccount } from "@/lib/auth/session";

export default function AccountSettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { setMode } = useAppearance();
  const { logout } = useAuth();
  const [account, setAccount] = useState<AccountInfo>(DEFAULT_ACCOUNT);
  const [editingField, setEditingField] = useState<"phone" | "email" | null>(null);

  const loadData = useCallback(async () => {
    setAccount(await getAccountInfo());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const updateAccount = async (next: AccountInfo) => {
    setAccount(next);
    await setAccountInfo(next);
  };

  const handleFieldSave = (field: "phone" | "email", value: string) => {
    if (field === "phone" && value && !/^1\d{10}$/.test(value)) {
      Alert.alert(t("account.invalidPhoneTitle"), t("account.invalidPhoneBody"));
      return;
    }
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

  const handleWechatBind = () => {
    if (account.wechatBound) {
      Alert.alert(t("account.unbindWechatTitle"), t("account.unbindWechatBody"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("account.unbind"),
          style: "destructive",
          onPress: () => {
            void updateAccount({
              ...account,
              wechatBound: false,
              wechatNickname: "",
            });
          },
        },
      ]);
      return;
    }

    Alert.alert(t("account.bindWechatTitle"), t("account.bindWechatBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("account.bind"),
        onPress: () => {
          void updateAccount({
            ...account,
            wechatBound: true,
            wechatNickname: t("account.wechatUser"),
          });
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
            title={t("account.phone")}
            value={account.phone ? maskPhone(account.phone) : t("account.unbound")}
            icon={Phone}
            onPress={() => setEditingField("phone")}
          />
          <SettingsNavRow
            title={t("account.wechat")}
            value={
              account.wechatBound
                ? account.wechatNickname || t("account.bound")
                : t("account.unbound")
            }
            icon={MessageCircle}
            onPress={handleWechatBind}
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
          visible={editingField === "phone"}
          title={t("account.changePhone")}
          value={account.phone}
          placeholder={t("account.phonePlaceholder")}
          keyboardType="phone-pad"
          onClose={() => setEditingField(null)}
          onSave={(value) => handleFieldSave("phone", value)}
        />
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
