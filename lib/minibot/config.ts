import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_URL_KEY = "@minibot/baseUrl";
const SECRET_KEY = "@minibot/authSecret";
const AUTO_CONNECT_KEY = "@minibot/autoConnect";

/** Production gateway (bot.liuyidi.me). Override in Settings or AsyncStorage. */
export const DEFAULT_MINIBOT_BASE_URL = "https://bot.liuyidi.me";

/** Old built-in locals — treat as unset so apps pick up production default. */
const LEGACY_LOCAL_BASE_URLS = new Set([
  "http://127.0.0.1:8766",
  "http://10.0.2.2:8766",
  "http://localhost:8766",
]);

function normalizeBaseUrl(raw: string | null | undefined): string | null {
  const cleaned = raw?.trim().replace(/\/$/, "") ?? "";
  if (!cleaned || LEGACY_LOCAL_BASE_URLS.has(cleaned)) {
    return null;
  }
  return cleaned;
}

/** Resolve minibot gateway origin (no trailing slash). */
export async function getMinibotBaseUrl(): Promise<string> {
  const stored = normalizeBaseUrl(await AsyncStorage.getItem(BASE_URL_KEY));
  if (stored) {
    return stored;
  }
  const fromExtra = normalizeBaseUrl(
    typeof Constants.expoConfig?.extra?.minibotBaseUrl === "string"
      ? Constants.expoConfig.extra.minibotBaseUrl
      : null,
  );
  if (fromExtra) {
    return fromExtra;
  }
  return DEFAULT_MINIBOT_BASE_URL;
}

export async function setMinibotBaseUrl(url: string): Promise<void> {
  const cleaned = url.trim().replace(/\/$/, "");
  if (!cleaned) {
    await AsyncStorage.removeItem(BASE_URL_KEY);
    return;
  }
  await AsyncStorage.setItem(BASE_URL_KEY, cleaned);
}

export async function getMinibotAuthSecret(): Promise<string> {
  const stored = await AsyncStorage.getItem(SECRET_KEY);
  if (stored != null) {
    return stored;
  }
  const fromExtra = Constants.expoConfig?.extra?.minibotAuthSecret;
  return typeof fromExtra === "string" ? fromExtra : "";
}

export async function setMinibotAuthSecret(secret: string): Promise<void> {
  await AsyncStorage.setItem(SECRET_KEY, secret);
}

export async function getMinibotAutoConnect(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(AUTO_CONNECT_KEY);
  if (raw == null) {
    return true;
  }
  return raw === "1";
}

export async function setMinibotAutoConnect(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(AUTO_CONNECT_KEY, enabled ? "1" : "0");
}
