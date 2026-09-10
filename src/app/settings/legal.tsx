import { useNavigation } from "expo-router/react-navigation";
import { useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { ThemedText } from "@/components/ThemedText";
import { useT } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LEGAL_DOCS, resolveLegalDoc } from "@/lib/legal/docs";

export default function LegalDocumentScreen() {
  const theme = useAppTheme();
  const t = useT();
  const navigation = useNavigation();
  const { doc: docParam } = useLocalSearchParams<{ doc?: string }>();
  const doc = resolveLegalDoc(docParam);
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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
