import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
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

import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  DEFAULT_PROFILE,
  getProfileInitial,
  getUserProfile,
  setUserProfile,
  type UserProfile,
} from "@/lib/settings/userProfileConfig";

const AVATAR_COLORS = [
  "#1A1C1F",
  "#C96442",
  "#6B7280",
  "#40C977",
  "#D29922",
  "#AD7BF9",
  "#FA423E",
];

export default function ProfileSettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void getUserProfile().then(setProfile);
    }, [])
  );

  const handleSave = async () => {
    const nickname = profile.nickname.trim();
    if (!nickname) {
      Alert.alert(t("profile.emptyNicknameTitle"), t("profile.emptyNicknameBody"));
      return;
    }

    setIsSaving(true);
    try {
      const nextProfile = {
        ...profile,
        nickname,
        bio: profile.bio.trim(),
      };
      await setUserProfile(nextProfile);
      setProfile(nextProfile);
      Alert.alert(t("profile.saveSuccessTitle"), t("profile.saveSuccessBody"));
    } catch {
      Alert.alert(t("profile.saveFailTitle"), t("profile.saveFailBody"));
    } finally {
      setIsSaving(false);
    }
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
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: profile.avatarColor }]}>
            <ThemedText style={styles.avatarText}>
              {getProfileInitial(profile.nickname)}
            </ThemedText>
          </View>
          <ThemedText type="secondary">{t("profile.avatarColor")}</ThemedText>
          <View style={styles.colorRow}>
            {AVATAR_COLORS.map((color) => {
              const selected = profile.avatarColor === color;
              return (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setProfile((current) => ({ ...current, avatarColor: color }))}
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    selected && styles.colorDotSelected,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.fieldCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("profile.nickname")}</ThemedText>
          <TextInput
            value={profile.nickname}
            onChangeText={(nickname) => setProfile((current) => ({ ...current, nickname }))}
            placeholder={t("profile.nicknamePlaceholder")}
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </View>

        <View
          style={[
            styles.fieldCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText type="defaultSemiBold">{t("profile.bio")}</ThemedText>
          <TextInput
            value={profile.bio}
            onChangeText={(bio) => setProfile((current) => ({ ...current, bio }))}
            placeholder={t("profile.bioPlaceholder")}
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.border },
            ]}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={() => void handleSave()}
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.primary },
            (pressed || isSaving) && styles.pressed,
          ]}
        >
          <ThemedText style={styles.saveButtonText}>
            {isSaving ? t("profile.saving") : t("common.save")}
          </ThemedText>
        </Pressable>
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
  avatarSection: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  fieldCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  saveButton: {
    borderRadius: 14,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.88,
  },
});
