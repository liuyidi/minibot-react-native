import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import { useLanguage } from "@/context/LanguageContext";
import { LEGAL_DOCS, resolveLegalDoc } from "@/lib/legal/docs";

export default function AuthLegalScreen() {
  const { language } = useLanguage();
  const { doc: docParam } = useLocalSearchParams<{ doc?: string }>();
  const doc = resolveLegalDoc(docParam);
  const config = LEGAL_DOCS[doc];
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const title = useMemo(() => {
    if (doc === "privacy") {
      return language === "zh" ? "隐私政策" : "Privacy Policy";
    }
    return language === "zh" ? "服务条款" : "Terms of Service";
  }, [doc, language]);

  const failedText =
    language === "zh" ? "页面加载失败，请稍后重试。" : "Failed to load the page.";

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title, headerShown: true }} />
      {failed ? (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>{failedText}</Text>
        </View>
      ) : (
        <WebView
          source={{ uri: config.url }}
          style={styles.webview}
          onLoadStart={() => {
            setLoading(true);
            setFailed(false);
          }}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#080808" />
            </View>
          )}
        />
      )}
      {loading && !failed ? (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#080808" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  fallbackText: {
    color: "#666666",
    fontSize: 15,
    textAlign: "center",
  },
});
