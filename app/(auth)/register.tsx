import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthFormField } from "@/components/auth/AuthFormField";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { register, isAuthenticated, isReady } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isReady && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedNickname = nickname.trim();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      Alert.alert(t("auth.invalidEmailTitle"), t("auth.invalidEmailBody"));
      return;
    }
    if (password.length < 8) {
      Alert.alert(t("auth.passwordTooShortTitle"), t("auth.passwordTooShortBody"));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("auth.passwordMismatchTitle"), t("auth.passwordMismatchBody"));
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: trimmedEmail,
        password,
        nickname: trimmedNickname || undefined,
      });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        t("auth.registerFailed"),
        error instanceof Error ? error.message : t("auth.tryLater")
      );
    } finally {
      setIsSubmitting(false);
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
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t("auth.register")}
          </ThemedText>
          <ThemedText type="secondary">{t("auth.registerSubtitle")}</ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AuthFormField
            label={t("auth.email")}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <AuthFormField
            label={t("auth.nicknameOptional")}
            value={nickname}
            onChangeText={setNickname}
            placeholder={t("me.defaultName")}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <AuthFormField
            label={t("auth.password")}
            value={password}
            onChangeText={setPassword}
            placeholder={t("auth.passwordHint")}
            secureTextEntry
            showToggle
            isVisible={isPasswordVisible}
            onToggleVisibility={() => setIsPasswordVisible((current) => !current)}
          />
          <AuthFormField
            label={t("auth.confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            secureTextEntry
            showToggle
            isVisible={isPasswordVisible}
            onToggleVisibility={() => setIsPasswordVisible((current) => !current)}
          />

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={() => void handleRegister()}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.primary },
              (pressed || isSubmitting) && styles.pressed,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <ThemedText style={[styles.primaryButtonText, { color: theme.onPrimary }]}>
                {t("auth.register")}
              </ThemedText>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <ThemedText type="secondary">{t("auth.hasAccount")}</ThemedText>
          <Link href="/(auth)/login" asChild>
            <Pressable accessibilityRole="link">
              <ThemedText type="link">{t("auth.goLogin")}</ThemedText>
            </Pressable>
          </Link>
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
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 32,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 14,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pressed: {
    opacity: 0.88,
  },
});
