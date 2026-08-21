import { Redirect, router } from "expo-router";

import { MiniLoginScreen } from "@/components/auth/MiniLoginScreen";
import { useAuth } from "@/context/AuthContext";

type AuthEntryScreenProps = {
  mode: "login" | "register";
};

export function AuthEntryScreen({ mode }: AuthEntryScreenProps) {
  const {
    startEmailCode,
    verifyEmailCode,
    loginWithGoogle,
    loginWithGitHub,
    enterGuestMode,
    isAuthenticated,
    isReady,
  } = useAuth();

  if (isReady && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const goTabs = () => {
    router.replace("/(tabs)");
  };

  return (
    <MiniLoginScreen
      mode={mode}
      brand="Minibot"
      onSendCode={startEmailCode}
      onVerifyCode={async (email, code, options) => {
        await verifyEmailCode(email, code, options);
        goTabs();
      }}
      onGooglePress={async () => {
        await loginWithGoogle();
        goTabs();
      }}
      onGitHubPress={async () => {
        await loginWithGitHub();
        goTabs();
      }}
      onDemoPress={
        mode === "login"
          ? async () => {
              await enterGuestMode();
              goTabs();
            }
          : undefined
      }
      onSwitchMode={() => {
        router.replace(mode === "login" ? "/(auth)/register" : "/(auth)/login");
      }}
    />
  );
}
