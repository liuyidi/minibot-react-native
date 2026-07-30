import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Server } from "lucide-react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useT } from "@/context/LanguageContext";
import { useMinibot } from "@/context/MinibotClientContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  getMinibotAuthSecret,
  getMinibotAutoConnect,
  getMinibotBaseUrl,
  setMinibotAuthSecret,
  setMinibotAutoConnect,
  setMinibotBaseUrl,
} from "@/lib/minibot/config";

export default function MinibotServerSettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const {
    client,
    status,
    modelName,
    runtimeSurface,
    lastError,
    isConnected,
    connect,
    disconnect,
    refreshConfigAndReconnect,
    baseUrl: liveBaseUrl,
  } = useMinibot();

  const statusLabel = useMemo(() => {
    const map: Record<string, string> = {
      idle: t("me.statusIdle"),
      connecting: t("me.statusConnecting"),
      open: t("me.statusOpen"),
      reconnecting: t("me.statusReconnecting"),
      closed: t("me.statusClosed"),
      error: t("me.statusError"),
    };
    return map[status] ?? status;
  }, [status, t]);

  const [baseUrl, setBaseUrlDraft] = useState("");
  const [secret, setSecretDraft] = useState("");
  const [autoConnect, setAutoConnect] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sessionCount, setSessionCount] = useState<number | null>(null);

  const loadLocal = useCallback(async () => {
    const [url, sec, auto] = await Promise.all([
      getMinibotBaseUrl(),
      getMinibotAuthSecret(),
      getMinibotAutoConnect(),
    ]);
    setBaseUrlDraft(url);
    setSecretDraft(sec);
    setAutoConnect(auto);
  }, []);

  useEffect(() => {
    void loadLocal();
  }, [loadLocal]);

  const handleSave = async () => {
    setBusy(true);
    try {
      await setMinibotBaseUrl(baseUrl);
      await setMinibotAuthSecret(secret);
      await setMinibotAutoConnect(autoConnect);
      await refreshConfigAndReconnect();
      Alert.alert(t("server.saved"), t("server.savedBody"));
    } catch (error) {
      Alert.alert(
        t("server.connectFailed"),
        error instanceof Error ? error.message : t("server.connectErrorFallback")
      );
    } finally {
      setBusy(false);
    }
  };

  const handleConnect = async () => {
    setBusy(true);
    try {
      await setMinibotBaseUrl(baseUrl);
      await setMinibotAuthSecret(secret);
      await connect();
    } catch (error) {
      Alert.alert(
        t("server.connectFailed"),
        error instanceof Error ? error.message : t("server.connectErrorFallback")
      );
    } finally {
      setBusy(false);
    }
  };

  const probeSessions = async () => {
    if (!client || !isConnected) {
      Alert.alert(t("server.notConnected"), t("server.connectFirst"));
      return;
    }
    setBusy(true);
    try {
      const sessions = await client.sessions.list();
      setSessionCount(sessions.length);
      Alert.alert(
        t("server.sessionsTitle"),
        t("server.sessionsCount", { count: sessions.length })
      );
    } catch (error) {
      Alert.alert(
        t("server.listFailed"),
        error instanceof Error ? error.message : t("server.listFailed")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.statusCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.background }]}>
          <AppIcon icon={Server} size={22} color={theme.primary} />
        </View>
        <View style={styles.statusBody}>
          <ThemedText type="defaultSemiBold">{statusLabel}</ThemedText>
          <ThemedText type="secondary" numberOfLines={2}>
            {liveBaseUrl || baseUrl || "—"}
          </ThemedText>
          {modelName ? (
            <ThemedText type="secondary">
              {t("server.modelLabel", { model: modelName })}
            </ThemedText>
          ) : null}
          {runtimeSurface ? (
            <ThemedText type="secondary">runtime：{runtimeSurface}</ThemedText>
          ) : null}
          {lastError ? (
            <ThemedText style={styles.errorText}>{lastError}</ThemedText>
          ) : null}
          {sessionCount != null ? (
            <ThemedText type="secondary">
              {t("server.remoteSessions", { count: sessionCount })}
            </ThemedText>
          ) : null}
        </View>
      </View>

      <ThemedText type="secondary" style={styles.label}>
        {t("server.baseUrl")}
      </ThemedText>
      <TextInput
        value={baseUrl}
        onChangeText={setBaseUrlDraft}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://bot.liuyidi.me"
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      />

      <ThemedText type="secondary" style={styles.label}>
        {t("server.authSecret")}
      </ThemedText>
      <TextInput
        value={secret}
        onChangeText={setSecretDraft}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        placeholder="X-Minibot-Auth"
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      />

      <View style={styles.switchRow}>
        <ThemedText type="defaultSemiBold">{t("server.autoConnect")}</ThemedText>
        <Switch
          value={autoConnect}
          onValueChange={(value) => {
            setAutoConnect(value);
            void setMinibotAutoConnect(value);
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void handleSave()}
        style={({ pressed }) => [
          styles.primaryBtn,
          { backgroundColor: theme.primary },
          pressed && styles.pressed,
          busy && styles.disabled,
        ]}
      >
        {busy ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <ThemedText style={[styles.primaryBtnText, { color: theme.onPrimary }]}>
            {t("server.saveReconnect")}
          </ThemedText>
        )}
      </Pressable>

      <View style={styles.rowBtns}>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void handleConnect()}
          style={({ pressed }) => [
            styles.secondaryBtn,
            { borderColor: theme.border, backgroundColor: theme.card },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("common.connect")}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={disconnect}
          style={({ pressed }) => [
            styles.secondaryBtn,
            { borderColor: theme.border, backgroundColor: theme.card },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("common.disconnect")}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={busy || !isConnected}
          onPress={() => void probeSessions()}
          style={({ pressed }) => [
            styles.secondaryBtn,
            { borderColor: theme.border, backgroundColor: theme.card },
            pressed && styles.pressed,
            (!isConnected || busy) && styles.disabled,
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("server.probeSessions")}</ThemedText>
        </Pressable>
      </View>

      <ThemedText type="secondary" style={styles.hint}>
        {t("server.hint")}
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 10 },
  statusCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBody: { flex: 1, gap: 2 },
  errorText: { color: Colors.red, marginTop: 4 },
  label: { marginTop: 4, fontSize: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: { fontWeight: "700", fontSize: 16 },
  rowBtns: { flexDirection: "row", gap: 8, marginTop: 4 },
  secondaryBtn: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  hint: { marginTop: 12, lineHeight: 20 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
});
