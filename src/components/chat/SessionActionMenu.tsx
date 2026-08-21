import { Pin, Pencil, Trash2 } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

export type SessionActionMenuTarget = {
  id: string;
  title: string;
  pinned: boolean;
};

type SessionActionMenuProps = {
  target: SessionActionMenuTarget | null;
  onClose: () => void;
  onPin: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function SessionActionMenu({
  target,
  onClose,
  onPin,
  onRename,
  onDelete,
}: SessionActionMenuProps) {
  const theme = useAppTheme();
  const t = useT();
  const open = Boolean(target);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.sheet,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText type="secondary" numberOfLines={1} style={styles.title}>
            {target?.title}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={onPin}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <AppIcon icon={Pin} size={18} color={theme.text} />
            <ThemedText style={styles.rowLabel}>
              {target?.pinned ? t("drawer.unpin") : t("drawer.pin")}
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onRename}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <AppIcon icon={Pencil} size={18} color={theme.text} />
            <ThemedText style={styles.rowLabel}>{t("drawer.rename")}</ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onDelete}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <AppIcon icon={Trash2} size={18} color={theme.red} />
            <ThemedText style={[styles.rowLabel, { color: theme.red }]}>
              {t("drawer.delete")}
            </ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  sheet: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 2,
  },
  title: {
    fontSize: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.7,
  },
});
