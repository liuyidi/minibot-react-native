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

import {
  getMinibotAuthSecret,
  getMinibotAutoConnect,
  getMinibotBaseUrl,
} from "@/lib/minibot/config";

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
    setLastError(null);
    const url = await getMinibotBaseUrl();
    const secret = await getMinibotAuthSecret();
    setBaseUrl(url);

    teardownWs();

    const next = createClient({
      baseUrl: url,
      getSecret: () => secret || undefined,
      reconnect: true,
      debug: __DEV__,
    });
    clientRef.current = next;
    setClient(next);

    try {
      const info = await next.bootstrap();
      setModelName(info.model_name ?? null);
      setRuntimeSurface(info.runtime_surface ?? null);
      const ws = next.ensureWs();
      unsubStatusRef.current = ws.onStatus((nextStatus) => {
        setStatus(nextStatus);
      });
      ws.connect();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "连接 minibot 失败";
      setLastError(message);
      setStatus("error");
      throw error;
    }
  }, [teardownWs]);

  const disconnect = useCallback(() => {
    teardownWs();
    setStatus("closed");
    setLastError(null);
  }, [teardownWs]);

  const refreshConfigAndReconnect = useCallback(async () => {
    await connect();
  }, [connect]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const url = await getMinibotBaseUrl();
      if (cancelled) return;
      setBaseUrl(url);
      const auto = await getMinibotAutoConnect();
      if (auto) {
        try {
          await connect();
        } catch {
          // surfaced via lastError / status
        }
      }
      if (!cancelled) {
        setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
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
    <MinibotContext.Provider value={value}>{children}</MinibotContext.Provider>
  );
}

export function useMinibot(): MinibotContextValue {
  const ctx = useContext(MinibotContext);
  if (!ctx) {
    throw new Error("useMinibot must be used within MinibotProvider");
  }
  return ctx;
}
