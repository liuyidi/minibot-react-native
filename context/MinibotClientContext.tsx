import {
  createClient,
  type ConnectionStatus,
  type MinibotClient,
} from "@minibot/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

import { WebViewWebSocketHost } from "@/components/WebViewWebSocketHost";
import {
  getMinibotAuthSecret,
  getMinibotAutoConnect,
  getMinibotBaseUrl,
} from "@/lib/minibot/config";
import { createIosWebSocket } from "@/lib/minibot/webviewWebSocket";

type MinibotContextValue = {
  client: MinibotClient | null;
  baseUrl: string;
  status: ConnectionStatus;
  modelName: string | null;
  runtimeSurface: string | null;
  lastError: string | null;
  isReady: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshConfigAndReconnect: () => Promise<void>;
};

const MinibotContext = createContext<MinibotContextValue | null>(null);

export function MinibotProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<MinibotClient | null>(null);
  const connectGenRef = useRef(0);
  const [client, setClient] = useState<MinibotClient | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [modelName, setModelName] = useState<string | null>(null);
  const [runtimeSurface, setRuntimeSurface] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const unsubStatusRef = useRef<(() => void) | null>(null);

  const teardownWs = useCallback(() => {
    unsubStatusRef.current?.();
    unsubStatusRef.current = null;
    try {
      clientRef.current?.ws.close();
    } catch {
      // ignore
    }
  }, []);

  const connect = useCallback(async () => {
    const gen = ++connectGenRef.current;
    setLastError(null);
    const url = await getMinibotBaseUrl();
    const secret = await getMinibotAuthSecret();
    if (gen !== connectGenRef.current) return;
    setBaseUrl(url);

    teardownWs();

    const next = createClient({
      baseUrl: url,
      getSecret: () => secret || undefined,
      reconnect: true,
      debug: __DEV__,
      // iOS Expo Go: SocketRocket aborts WSS TLS (OSStatus -9806). Use WebKit.
      socketFactory:
        Platform.OS === "ios"
          ? (wsUrl: string) => {
              if (__DEV__) {
                console.log("[minibot ws] iOS WebKit bridge →", wsUrl);
              }
              return createIosWebSocket(wsUrl);
            }
          : (wsUrl: string) => {
              if (__DEV__) {
                console.log("[minibot ws] connecting to", wsUrl);
              }
              return new WebSocket(wsUrl);
            },
    });
    clientRef.current = next;
    setClient(next);

    try {
      const info = await next.bootstrap();
      if (gen !== connectGenRef.current) return;
      setModelName(info.model_name ?? null);
      setRuntimeSurface(info.runtime_surface ?? null);
      const ws = next.ensureWs();
      const unsubStatus = ws.onStatus((nextStatus) => {
        setStatus(nextStatus);
        if (__DEV__) {
          console.log("[minibot ws] status", nextStatus);
        }
      });
      const unsubError = ws.onError((err) => {
        const detail =
          "reason" in err && typeof err.reason === "string" ? ` ${err.reason}` : "";
        const message = `WS error: ${err.kind}${detail}`;
        console.warn("[minibot ws]", message, err);
        setLastError(message);
      });
      unsubStatusRef.current = () => {
        unsubStatus();
        unsubError();
      };
      ws.connect();
    } catch (error) {
      if (gen !== connectGenRef.current) return;
      const message =
        error instanceof Error ? error.message : "连接 minibot 失败";
      setLastError(message);
      setStatus("error");
      throw error;
    }
  }, [teardownWs]);

  const disconnect = useCallback(() => {
    connectGenRef.current += 1;
    teardownWs();
    setStatus("closed");
    setLastError(null);
  }, [teardownWs]);

  const refreshConfigAndReconnect = useCallback(async () => {
    await connect();
  }, [connect]);

  useEffect(() => {
    let cancelled = false;
    const genAtStart = connectGenRef.current;
    void (async () => {
      const url = await getMinibotBaseUrl();
      if (cancelled) return;
      setBaseUrl(url);
      const auto = await getMinibotAutoConnect();
      if (cancelled) return;
      if (auto) {
        try {
          await connect();
        } catch {
          // surfaced via lastError / status
        }
      }
      if (!cancelled && connectGenRef.current >= genAtStart) {
        setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
      connectGenRef.current += 1;
      teardownWs();
    };
  }, [connect, teardownWs]);

  const value = useMemo<MinibotContextValue>(
    () => ({
      client,
      baseUrl,
      status,
      modelName,
      runtimeSurface,
      lastError,
      isReady,
      isConnected: status === "open",
      connect,
      disconnect,
      refreshConfigAndReconnect,
    }),
    [
      client,
      baseUrl,
      status,
      modelName,
      runtimeSurface,
      lastError,
      isReady,
      connect,
      disconnect,
      refreshConfigAndReconnect,
    ]
  );

  return (
    <MinibotContext.Provider value={value}>
      <WebViewWebSocketHost />
      {children}
    </MinibotContext.Provider>
  );
}

export function useMinibot(): MinibotContextValue {
  const ctx = useContext(MinibotContext);
  if (!ctx) {
    throw new Error("useMinibot must be used within MinibotProvider");
  }
  return ctx;
}
