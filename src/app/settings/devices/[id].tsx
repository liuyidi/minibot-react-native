import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
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
import { markDevicesListDirty } from "@/lib/auth/devicesListDirty";
import {
  fetchSecuritySnapshot,
  maskIpForDisplay,
  revokeSecuritySession,
  type SecurityDevice,
} from "@/lib/auth/security";

export default function DeviceDetailScreen() {
  const t = useT();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { getAccessToken } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [device, setDevice] = useState<SecurityDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token || !id) {
        throw new Error(t("devices.deviceMissing"));
      }
      const snapshot = await fetchSecuritySnapshot(token);
      const found = snapshot.devices.find((item) => item.id === id) ?? null;
      if (!found) {
        Alert.alert(t("devices.deviceMissing"));
        router.back();
        return;
      }
      setDevice(found);
    } catch {
      Alert.alert(t("devices.deviceMissing"));
      router.back();
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, id, t]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const loginMethod = [device?.appName, device?.system].filter(Boolean).join(" · ");
  const maskedIp = device?.ipAddress ? maskIpForDisplay(device.ipAddress) : null;
  const ipLine = [maskedIp, device?.location ? `(${device.location})` : null]
    .filter(Boolean)
    .join(" ");

  const handleRevoke = () => {
    if (!device || device.isCurrent) {
      return;
    }
    Alert.alert(t("devices.revokeConfirmTitle"), t("devices.revokeConfirmMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("devices.revoke"),
        style: "destructive",
        onPress: () => {
          void (async () => {
            setRevoking(true);
            try {
              const token = await getAccessToken();
              if (!token) {
                throw new Error(t("devices.revokeFailed"));
              }
              await revokeSecuritySession(token, device.id);
              markDevicesListDirty();
              router.back();
            } catch (err) {
              const message =
                err instanceof Error && /current/i.test(err.message)
                  ? t("devices.cannotRevokeCurrent")
                  : err instanceof Error
                    ? err.message
                    : t("devices.revokeFailed");
              Alert.alert(t("devices.revokeFailed"), message);
            } finally {
              setRevoking(false);
            }
          })();
        },
      },
    ]);
  };

  if (loading || !device) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: device.isCurrent ? Math.max(insets.bottom, 24) : 120 },
        ]}
      >
        <View
          style={[
            styles.hero,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AppIcon
            icon={resolveDeviceArtwork(device)}
            size={56}
            color={theme.text}
          />
        </View>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {device.name}
        </ThemedText>
        {device.isCurrent ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <ThemedText type="secondary" style={styles.badgeText}>
              {t("devices.currentBadge")}
            </ThemedText>
          </View>
        ) : null}

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <InfoRow
            label={t("devices.lastSeen")}
            value={device.lastSeenAt}
            borderColor={theme.border}
          />
          {loginMethod ? (
            <InfoRow
              label={t("devices.loginMethod")}
              value={loginMethod}
              borderColor={theme.border}
            />
          ) : null}
          {ipLine ? (
            <InfoRow
              label={t("devices.ip")}
              value={ipLine}
              borderColor={theme.border}
              showDivider={false}
            />
          ) : null}
        </View>
      </ScrollView>

      {!device.isCurrent ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: theme.background },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            disabled={revoking}
            onPress={handleRevoke}
            style={({ pressed }) => [
              styles.revokeButton,
              { backgroundColor: theme.red },
              (pressed || revoking) && styles.pressed,
            ]}
          >
            {revoking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.revokeText}>{t("devices.revoke")}</ThemedText>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function InfoRow({
  label,
  value,
  borderColor,
  showDivider = true,
}: {
  label: string;
  value: string;
  borderColor: string;
  showDivider?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        showDivider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
      ]}
    >
      <ThemedText type="secondary" style={styles.infoLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: "center",
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
  },
  badge: {
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
  },
  card: {
    alignSelf: "stretch",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  revokeButton: {
    borderRadius: 999,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  revokeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.72,
  },
});
