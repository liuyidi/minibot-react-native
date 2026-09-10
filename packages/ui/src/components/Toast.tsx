import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

type ToastContextValue = {
  show: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export type ToastProviderProps = {
  children: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function ToastProvider({
  children,
  theme: themeOverride,
  style,
}: ToastProviderProps) {
  const palette = useResolvedTheme(themeOverride);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string, durationMs = 2500) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => {
      setMessage(null);
      timerRef.current = null;
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <View
          pointerEvents="none"
          style={[
            styles.host,
            { backgroundColor: palette.heading },
            style,
          ]}
        >
          <Text style={[styles.text, { color: palette.onPrimary }]}>
            {message}
          </Text>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

/** Controlled toast host for Storybook / non-provider usage. */
export type ToastHostProps = {
  message: string | null;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function ToastHost({
  message,
  theme: themeOverride,
  style,
}: ToastHostProps) {
  const palette = useResolvedTheme(themeOverride);
  if (!message) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.host, { backgroundColor: palette.heading }, style]}
    >
      <Text style={[styles.text, { color: palette.onPrimary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
