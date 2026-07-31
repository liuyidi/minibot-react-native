import { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import {
  handleWebViewBridgeMessage,
  markWebViewBridgeUnavailable,
  setWebViewCommandHandler,
  WEBVIEW_WS_BRIDGE_HTML,
} from "@/lib/minibot/webviewWebSocket";

/**
 * Hidden WebKit host for iOS WebSocket. Must stay mounted while minibot is used.
 */
export function WebViewWebSocketHost() {
  const ref = useRef<WebView>(null);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    setWebViewCommandHandler((cmd) => {
      const payload = JSON.stringify(cmd);
      // Prefer injectJavaScript — more reliable than postMessage across RN WebView versions.
      ref.current?.injectJavaScript(
        `window.__minibotHandle && window.__minibotHandle(${JSON.stringify(payload)}); true;`
      );
    });
    return () => {
      markWebViewBridgeUnavailable();
      setWebViewCommandHandler(null);
    };
  }, []);

  if (Platform.OS !== "ios") {
    return null;
  }

  const onMessage = (event: WebViewMessageEvent) => {
    handleWebViewBridgeMessage(event.nativeEvent.data);
  };

  return (
    <View style={styles.host} pointerEvents="none" collapsable={false}>
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        source={{ html: WEBVIEW_WS_BRIDGE_HTML }}
        onMessage={onMessage}
        onLoadEnd={() => {
          // Ask the page to re-announce readiness after load.
          ref.current?.injectJavaScript(
            "window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:'ready'})); true;"
          );
        }}
        javaScriptEnabled
        domStorageEnabled={false}
        // Keep the bridge alive in Expo Go background tabs.
        mediaPlaybackRequiresUserAction
        allowsInlineMediaPlayback
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    overflow: "hidden",
  },
  webview: {
    width: 1,
    height: 1,
    opacity: 0,
  },
});
