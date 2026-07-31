import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import { Copy, Eye, EyeOff } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ExternalLink } from "@/components/ExternalLink";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  clearDeepSeekApiKey,
  getDeepSeekApiKey,
  maskApiKey,
  setDeepSeekApiKey,
} from "@/lib/deepseek/config";

export default function ApiKeySettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [draftKey, setDraftKey] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isSavedKeyVisible, setIsSavedKeyVisible] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);

  const loadData = useCallback(async () => {
    const key = await getDeepSeekApiKey();
    setSavedKey(key);
    setDraftKey("");
    setIsSavedKeyVisible(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const handleSaveApiKey = async () => {
    const trimmed = draftKey.trim();
    if (!trimmed) {
      Alert.alert(t("apiKey.emptyAlertTitle"), t("apiKey.emptyAlertBody"));
      return;
    }
    if (!trimmed.startsWith("sk-")) {
      Alert.alert(t("apiKey.formatWarnTitle"), t("apiKey.formatWarnBody"));
      return;
    }

    setIsSavingKey(true);
    try {
      await setDeepSeekApiKey(trimmed);
      setSavedKey(trimmed);
      setDraftKey("");
      setIsSavedKeyVisible(false);
      Alert.alert(t("apiKey.saveSuccessTitle"), t("apiKey.saveSuccessBody"));
    } catch {
      Alert.alert(t("apiKey.saveFailTitle"), t("apiKey.saveFailBody"));
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (!savedKey) {
      return;
    }
    await Clipboard.setStringAsync(savedKey);
    Alert.alert(t("apiKey.copiedTitle"), t("apiKey.copiedBody"));
  };

  const handleClearApiKey = () => {
    Alert.alert(t("apiKey.clearConfirmTitle"), t("apiKey.clearConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("apiKey.clearAction"),
        style: "destructive",
        onPress: async () => {
          await clearDeepSeekApiKey();
          setSavedKey(null);
          setDraftKey("");
          setIsSavedKeyVisible(false);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("settingsTitles.apiKey")}</ThemedText>
          {savedKey ? (
            <View style={styles.savedKeyRow}>
              <ThemedText
                type="secondary"
                style={styles.savedKeyText}
                numberOfLines={1}
              >
                {t("apiKey.configured", {
                  key: isSavedKeyVisible ? savedKey : maskApiKey(savedKey),
                })}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isSavedKeyVisible ? t("apiKey.hideA11y") : t("apiKey.showA11y")
                }
                hitSlop={8}
                onPress={() => setIsSavedKeyVisible((current) => !current)}
                style={styles.iconButton}
              >
                <AppIcon
                  icon={isSavedKeyVisible ? EyeOff : Eye}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("apiKey.copyA11y")}
                hitSlop={8}
                onPress={() => void handleCopyApiKey()}
                style={styles.iconButton}
              >
                <AppIcon
                  icon={Copy}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
          ) : (
            <ThemedText type="secondary">{t("apiKey.emptyBody")}</ThemedText>
          )}
          <View
            style={[
              styles.inputWrap,
              { borderColor: theme.border, backgroundColor: theme.background },
            ]}
          >
            <TextInput
              value={draftKey}
              onChangeText={setDraftKey}
              placeholder={savedKey ? t("apiKey.placeholderUpdate") : "sk-xxxxxxxxxxxxxxxx"}
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!isKeyVisible}
              style={[styles.input, { color: theme.text }]}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsKeyVisible((current) => !current)}
              style={styles.eyeButton}
            >
              <ThemedText type="link">
                {isKeyVisible ? t("apiKey.hide") : t("apiKey.show")}
              </ThemedText>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isSavingKey}
            onPress={() => void handleSaveApiKey()}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.primary },
              (pressed || isSavingKey) && styles.pressed,
            ]}
          >
            {isSavingKey ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <ThemedText style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
                {t("apiKey.save")}
              </ThemedText>
            )}
          </Pressable>
          {savedKey ? (
            <Pressable accessibilityRole="button" onPress={handleClearApiKey}>
              <ThemedText style={styles.clearKeyText}>{t("apiKey.clear")}</ThemedText>
            </Pressable>
          ) : null}
          <ExternalLink href="https://platform.deepseek.com/">
            <ThemedText type="link">{t("apiKey.getKeyLink")}</ThemedText>
          </ExternalLink>
        </View>

        <View
          style={[
            styles.helpCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("apiKey.howToTitle")}</ThemedText>
          <ThemedText type="secondary">{t("apiKey.howToBody")}</ThemedText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  savedKeyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  savedKeyText: {
    flex: 1,
    fontSize: 15,
  },
  iconButton: {
    padding: 6,
  },
  helpCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  primaryButton: {
    borderRadius: 14,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  clearKeyText: {
    color: Colors.red,
    fontSize: 15,
    fontWeight: "600",
    alignSelf: "center",
  },
  pressed: {
    opacity: 0.88,
  },
});
