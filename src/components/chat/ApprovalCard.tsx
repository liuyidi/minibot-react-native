import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { PendingApproval } from "@/lib/minibot/wsTurn";

type ApprovalCardProps = {
  approval: PendingApproval;
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
};

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  disabled = false,
}: ApprovalCardProps) {
  const theme = useAppTheme();
  const { t } = useLanguage();
  const toolNames = (approval.tool_calls ?? [])
    .map((call) => call.name)
    .filter((name): name is string => Boolean(name?.trim()))
    .join(", ");

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {t("chat.approvalTitle")}
      </ThemedText>
      {approval.reason ? (
        <ThemedText type="secondary" style={styles.body}>
          {t("chat.approvalReason", { reason: approval.reason })}
        </ThemedText>
      ) : null}
      {approval.risk ? (
        <ThemedText type="secondary" style={styles.body}>
          {t("chat.approvalRisk", { risk: approval.risk })}
        </ThemedText>
      ) : null}
      {toolNames ? (
        <ThemedText type="secondary" style={styles.body}>
          {t("chat.approvalTools", { tools: toolNames })}
        </ThemedText>
      ) : null}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onReject}
          style={({ pressed }) => [
            styles.button,
            styles.reject,
            { borderColor: theme.border },
            (pressed || disabled) && styles.dimmed,
          ]}
        >
          <ThemedText style={styles.rejectText}>{t("chat.approvalReject")}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onApprove}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            (pressed || disabled) && styles.dimmed,
          ]}
        >
          <ThemedText style={[styles.approveText, { color: theme.onPrimary }]}>
            {t("chat.approvalApprove")}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 15,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 11,
  },
  reject: {
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
  },
  rejectText: {
    fontWeight: "600",
    fontSize: 15,
  },
  approveText: {
    fontWeight: "700",
    fontSize: 15,
  },
  dimmed: {
    opacity: 0.7,
  },
});
