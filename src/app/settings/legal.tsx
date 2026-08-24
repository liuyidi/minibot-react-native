import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

const LEGAL_DOCS = {
  terms: {
    url: "https://auth.liuyidi.me/terms",
    titleKey: "about.terms" as const,
  },
  privacy: {
    url: "https://auth.liuyidi.me/privacy",
    titleKey: "about.privacy" as const,
  },
} as const;

type LegalDoc = keyof typeof LEGAL_DOCS;

function resolveDoc(raw: string | string[] | undefined): LegalDoc {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "privacy") {
    return "privacy";
  }
  return "terms";
}

export default function LegalDocumentScreen() {
  const theme = useAppTheme();
  const t = useT();
  const navigation = useNavigation();
  const { doc: docParam } = useLocalSearchParams<{ doc?: string }>();
  const doc = resolveDoc(docParam);
  const config = LEGAL_DOCS[doc];
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const title = useMemo(() => t(config.titleKey), [config.titleKey, t]);

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {failed ? (
        <View style={styles.fallback}>
          <ThemedText type="secondary">{t("about.legalLoadFailed")}</ThemedText>
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
            <View style={[styles.loading, { backgroundColor: theme.background }]}>
              <ActivityIndicator size="large" color={theme.text} />
            </View>
          )}
        />
      )}
      {loading && !failed ? (
        <View
          pointerEvents="none"
          style={[styles.loadingOverlay, { backgroundColor: theme.background }]}
        >
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
