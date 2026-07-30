import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Key,
  MessagesSquare,
} from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsNavRow } from "@/components/settings/SettingsNavRow";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useLanguage, useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  fetchDeepSeekBalance,
  formatBalanceAmount,
  pickPrimaryBalance,
  type UserBalance,
} from "@/lib/deepseekBalance";
import { getDeepSeekApiKey } from "@/lib/deepseekConfig";
import {
  formatTokenCount,
  getTokenUsageStats,
  resetTokenUsageStats,
  type TokenUsageStats,
} from "@/lib/tokenUsageConfig";

function formatUpdatedAt(iso: string | null, locale: string, noRecords: string): string {
  if (!iso) {
    return noRecords;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return noRecords;
  }
  return date.toLocaleString(locale, {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TokenUsageSettingsScreen() {
  const t = useT();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [stats, setStats] = useState<TokenUsageStats | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const locale = language === "zh" ? "zh-CN" : "en-US";

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [apiKey, usageStats] = await Promise.all([
        getDeepSeekApiKey(),
        getTokenUsageStats(),
      ]);
      setStats(usageStats);
      setHasApiKey(Boolean(apiKey));

      if (!apiKey) {
        setBalance(null);
        setErrorMessage(t("usage.needApiKey"));
        return;
      }

      const nextBalance = await fetchDeepSeekBalance();
      setBalance(nextBalance);
      setErrorMessage(null);
    } catch {
      setErrorMessage(t("usage.loadFailed"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const handleResetStats = () => {
    Alert.alert(t("usage.resetTitle"), t("usage.resetBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("usage.resetAction"),
        style: "destructive",
        onPress: () => {
          void resetTokenUsageStats().then(async () => {
            const nextStats = await getTokenUsageStats();
            setStats(nextStats);
          });
        },
      },
    ]);
  };

  const primaryBalance = balance ? pickPrimaryBalance(balance.balances) : null;
  const lastUpdatedText = formatUpdatedAt(
    stats?.lastUpdatedAt ?? null,
    locale,
    t("usage.noRecords")
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => void loadData(true)}
          tintColor={theme.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <>
          {!hasApiKey ? (
            <View
              style={[
                styles.noticeCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <AppIcon icon={Key} size={28} color={theme.primary} />
              <ThemedText type="defaultSemiBold">{t("usage.noApiTitle")}</ThemedText>
              <ThemedText type="secondary" style={styles.noticeText}>
                {t("usage.noApiBody")}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/(tabs)/settings/api-key")}
                style={({ pressed }) => [
                  styles.noticeButton,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.noticeButtonText}>
                  {t("usage.goConfigure")}
                </ThemedText>
              </Pressable>
            </View>
          ) : null}

          {errorMessage && hasApiKey ? (
            <View
              style={[
                styles.errorCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <ThemedText type="secondary">{errorMessage}</ThemedText>
            </View>
          ) : null}

          {primaryBalance ? (
            <View style={styles.section}>
              <ThemedText type="secondary" style={styles.sectionTitle}>
                {t("usage.balanceTitle")}
              </ThemedText>
              <View
                style={[
                  styles.balanceHero,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <ThemedText type="secondary">{t("usage.availableBalance")}</ThemedText>
                <ThemedText type="title" style={styles.balanceAmount}>
                  {formatBalanceAmount(
                    primaryBalance.total_balance,
                    primaryBalance.currency
                  )}
                </ThemedText>
                <ThemedText type="secondary">
                  {balance?.isAvailable ? t("usage.balanceOk") : t("usage.balanceLow")}
                </ThemedText>
                <View style={styles.balanceBreakdown}>
                  <View style={styles.breakdownItem}>
                    <ThemedText type="secondary">{t("usage.topupBalance")}</ThemedText>
                    <ThemedText type="defaultSemiBold">
                      {formatBalanceAmount(
                        primaryBalance.topped_up_balance,
                        primaryBalance.currency
                      )}
                    </ThemedText>
                  </View>
                  <View style={styles.breakdownItem}>
                    <ThemedText type="secondary">{t("usage.grantBalance")}</ThemedText>
                    <ThemedText type="defaultSemiBold">
                      {formatBalanceAmount(
                        primaryBalance.granted_balance,
                        primaryBalance.currency
                      )}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <ThemedText type="secondary" style={styles.sectionTitle}>
              {t("usage.localUsage")}
            </ThemedText>
            <SettingsGroup>
              <SettingsNavRow
                title={t("usage.totalTokens")}
                value={formatTokenCount(stats?.totalTokens ?? 0)}
                icon={BarChart3}
              />
              <SettingsNavRow
                title={t("usage.inputTokens")}
                value={formatTokenCount(stats?.promptTokens ?? 0)}
                icon={ArrowDown}
              />
              <SettingsNavRow
                title={t("usage.outputTokens")}
                value={formatTokenCount(stats?.completionTokens ?? 0)}
                icon={ArrowUp}
              />
              <SettingsNavRow
                title={t("usage.requestCount")}
                value={String(stats?.requestCount ?? 0)}
                icon={MessagesSquare}
                showDivider={false}
              />
            </SettingsGroup>
            <ThemedText type="secondary" style={styles.hint}>
              {t("usage.lastUpdated", { time: lastUpdatedText })}
            </ThemedText>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleResetStats}
            style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.resetText}>{t("usage.resetLocal")}</ThemedText>
          </Pressable>
        </>
      )}
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
  loadingWrap: {
    paddingVertical: 48,
    alignItems: "center",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    marginLeft: 4,
  },
  balanceHero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 8,
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 36,
    lineHeight: 42,
  },
  balanceBreakdown: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  breakdownItem: {
    alignItems: "center",
    gap: 4,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 4,
  },
  noticeCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  noticeText: {
    textAlign: "center",
    lineHeight: 22,
  },
  noticeButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  noticeButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  errorCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  resetButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  resetText: {
    color: Colors.red,
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.72,
  },
});
