import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

type RenameSessionModalProps = {
  visible: boolean;
  initialTitle: string;
  onCancel: () => void;
  onSubmit: (title: string) => void;
};

export function RenameSessionModal({
  visible,
  initialTitle,
  onCancel,
  onSubmit,
}: RenameSessionModalProps) {
  const theme = useAppTheme();
  const t = useT();
  const [value, setValue] = useState(initialTitle);

  useEffect(() => {
    if (visible) {
      setValue(initialTitle);
    }
  }, [visible, initialTitle]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {t("drawer.renameTitle")}
          </ThemedText>
          <TextInput
            value={value}
            onChangeText={setValue}
            autoFocus
            placeholder={t("drawer.renamePlaceholder")}
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.background,
              },
            ]}
            onSubmitEditing={() => onSubmit(value.trim())}
          />
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
            >
              <ThemedText>{t("common.cancel")}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSubmit(value.trim())}
              style={({ pressed }) => [
                styles.btn,
                styles.primary,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={{ color: theme.onPrimary, fontWeight: "700" }}>
                {t("common.save")}
              </ThemedText>
            </Pressable>
          </View>
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
    paddingHorizontal: 28,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 17,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primary: {},
  pressed: {
    opacity: 0.75,
  },
});
