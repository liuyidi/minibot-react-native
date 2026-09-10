import { ChevronRight } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { resolveDeviceArtwork } from "@/lib/auth/deviceArtwork";
import {
  fetchSecuritySnapshot,
  type SecurityDevice,
} from "@/lib/auth/security";

export default function DevicesListScreen() {
  const t = useT();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { getAccessToken } = useAuth();
  const [devices, setDevices] = useState<SecurityDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "refresh") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error(t("devices.loadFailed"));
        }
        const snapshot = await fetchSecuritySnapshot(token);
        setDevices(snapshot.devices);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("devices.loadFailed"));
        setDevices([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getAccessToken, t]
  );

  useFocusEffect(
    useCallback(() => {
      void load("initial");
    }, [load])
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 24) },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void load("refresh")}
          tintColor={theme.textSecondary}
        />
      }
    >
      <View style={styles.sectionHeader}>
        <ThemedText type="secondary" style={styles.sectionTitle}>
          {t("devices.onlineCount").replace("{count}", String(devices.length))}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/settings/devices/history")}
          style={({ pressed }) => [styles.historyLink, pressed && styles.pressed]}
        >
          <ThemedText type="secondary" style={styles.historyText}>
            {t("devices.usageRecords")}
          </ThemedText>
          <AppIcon icon={ChevronRight} size={16} color={theme.textSecondary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <ThemedText type="secondary" style={styles.message}>
            {error}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => void load("initial")}
            style={({ pressed }) => [
              styles.retry,
              { borderColor: theme.border, backgroundColor: theme.card },
              pressed && styles.pressed,
            ]}
          >
            <ThemedText type="defaultSemiBold">{t("devices.retry")}</ThemedText>
          </Pressable>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText type="secondary">{t("devices.empty")}</ThemedText>
        </View>
      ) : (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {devices.map((device, index) => (
            <Pressable
              key={device.id}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/settings/devices/[id]",
                  params: { id: device.id },
                })
              }
              style={({ pressed }) => [
                styles.row,
                index < devices.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={resolveDeviceArtwork(device)}
                style={styles.icon}
                accessibilityIgnoresInvertColors
              />
              <View style={styles.rowBody}>
                <View style={styles.nameRow}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.name}>
                    {device.name}
                  </ThemedText>
                  {device.isCurrent ? (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: theme.background, borderColor: theme.border },
                      ]}
                    >
                      <ThemedText type="secondary" style={styles.badgeText}>
                        {t("devices.currentBadge")}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
                {device.location ? (
                  <ThemedText type="secondary" numberOfLines={1} style={styles.subtitle}>
                    {device.location}
                  </ThemedText>
                ) : null}
              </View>
              <AppIcon icon={ChevronRight} size={18} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  historyLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  historyText: {
    fontSize: 13,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 64,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    flexShrink: 1,
  },
  badge: {
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
  },
  subtitle: {
    fontSize: 13,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  message: {
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retry: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.72,
  },
});
