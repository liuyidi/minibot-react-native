import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
  fetchSecurityOperations,
  maskIpForDisplay,
  type SecurityDeviceKind,
  type SecurityOperation,
} from "@/lib/auth/security";

type HistoryGroup = {
  dateLabel: string;
  items: SecurityOperation[];
};

function parseOccurredAt(value: string): { dateKey: string; time: string } {
  const trimmed = value.trim();
  const parts = trimmed.split(/\s+/);
  const dateKey = (parts[0] || trimmed).replace(/\//g, "-");
  const time = parts[1] || "";
  return { dateKey, time };
}

function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function groupOperations(
  items: SecurityOperation[],
  todayLabel: string
): HistoryGroup[] {
  const today = todayKey();
  const map = new Map<string, SecurityOperation[]>();
  for (const item of items) {
    const { dateKey } = parseOccurredAt(item.occurredAt);
    const bucket = map.get(dateKey);
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(dateKey, [item]);
    }
  }
  return Array.from(map.entries()).map(([dateKey, groupItems]) => ({
    dateLabel: dateKey === today || dateKey.replace(/-/g, "/") === today.replace(/-/g, "/")
      ? todayLabel
      : dateKey,
    items: groupItems,
  }));
}

function locationLine(item: SecurityOperation): string {
  const masked = item.ipMasked || maskIpForDisplay(item.ipAddress);
  if (item.location && masked && item.location !== masked && item.location !== item.ipAddress) {
    return `${item.location} (${masked})`;
  }
  if (item.location && item.location !== "-") {
    return masked && !item.location.includes("*") ? `${item.location} (${masked})` : item.location;
  }
  return masked || "";
}

export default function DeviceHistoryScreen() {
  const t = useT();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { getAccessToken } = useAuth();
  const [items, setItems] = useState<SecurityOperation[]>([]);
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
        setItems(await fetchSecurityOperations(token));
      } catch (err) {
        setError(err instanceof Error ? err.message : t("devices.loadFailed"));
        setItems([]);
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

  const groups = useMemo(
    () => groupOperations(items, t("devices.today")),
    [items, t]
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
      ) : groups.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText type="secondary">{t("devices.empty")}</ThemedText>
        </View>
      ) : (
        groups.map((group) => (
          <View key={group.dateLabel} style={styles.group}>
            <ThemedText type="secondary" style={styles.dateLabel}>
              {group.dateLabel}
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {group.items.map((item, index) => {
                const kind: SecurityDeviceKind = item.kind ?? "browser";
                const { time } = parseOccurredAt(item.occurredAt);
                const meta = locationLine(item);
                const status =
                  item.status ||
                  (item.action.includes("退出")
                    ? t("devices.statusRevoked")
                    : t("devices.statusActive"));
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.row,
                      index < group.items.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconWrap,
                        { backgroundColor: theme.background, borderColor: theme.border },
                      ]}
                    >
                      <AppIcon
                        icon={resolveDeviceArtwork({
                          name: item.device,
                          system: "",
                          kind,
                        })}
                        size={20}
                        color={theme.text}
                      />
                    </View>
                    <View style={styles.rowBody}>
                      <ThemedText type="defaultSemiBold" numberOfLines={1}>
                        {item.device}
                      </ThemedText>
                      {item.appName ? (
                        <ThemedText type="secondary" numberOfLines={1} style={styles.meta}>
                          {item.appName}
                        </ThemedText>
                      ) : null}
                      {meta ? (
                        <ThemedText type="secondary" numberOfLines={1} style={styles.meta}>
                          {meta}
                        </ThemedText>
                      ) : null}
                    </View>
                    <View style={styles.trailing}>
                      {time ? (
                        <ThemedText type="secondary" style={styles.time}>
                          {time}
                        </ThemedText>
                      ) : null}
                      <ThemedText type="defaultSemiBold" style={styles.status}>
                        {status}
                      </ThemedText>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
    flexGrow: 1,
  },
  group: {
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 4,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 72,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  meta: {
    fontSize: 12,
  },
  trailing: {
    alignItems: "flex-end",
    gap: 6,
  },
  time: {
    fontSize: 12,
  },
  status: {
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
