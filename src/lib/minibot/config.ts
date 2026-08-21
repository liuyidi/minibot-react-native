import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_URL_KEY = "@minibot/baseUrl";
const SECRET_KEY = "@minibot/authSecret";
const AUTO_CONNECT_KEY = "@minibot/autoConnect";

/** Public gateway (all platforms). */
export const MINIBOT_BASE_URL_DEFAULT = "https://bot.liuyidi.me";

/** @deprecated Use MINIBOT_BASE_URL_DEFAULT */
export const MINIBOT_BASE_URL_IOS = MINIBOT_BASE_URL_DEFAULT;

/** @deprecated Use MINIBOT_BASE_URL_DEFAULT — Android no longer forces ECS IP. */
export const MINIBOT_BASE_URL_ANDROID = MINIBOT_BASE_URL_DEFAULT;

/** Old built-in locals / ECS IP — treat as unset so apps pick up the public domain. */
const LEGACY_BASE_URLS = new Set([
  "http://127.0.0.1:8766",
  "http://10.0.2.2:8766",
  "http://localhost:8766",
  "http://116.62.35.76:8766",
]);

function normalizeBaseUrl(raw: string | null | undefined): string | null {
  const cleaned = raw?.trim().replace(/\/$/, "") ?? "";
  if (!cleaned || LEGACY_BASE_URLS.has(cleaned)) {
    return null;
  }
  return cleaned;
}

function baseUrlFromExtra(): string | null {
  const extra = Constants.expoConfig?.extra;
  const raw =
    (typeof extra?.minibotBaseUrl === "string" && extra.minibotBaseUrl) || "";
  return normalizeBaseUrl(raw);
}

/** Hardcoded gateway origin (no trailing slash). */
export function getBuiltInMinibotBaseUrl(): string {
  return baseUrlFromExtra() ?? MINIBOT_BASE_URL_DEFAULT;
}

/**
 * Resolve minibot gateway origin.
 * Prefers a debug override from the hidden server page; otherwise built-in / extra.
 */
export async function getMinibotBaseUrl(): Promise<string> {
  const stored = normalizeBaseUrl(await AsyncStorage.getItem(BASE_URL_KEY));
  if (stored) {
    return stored;
  }
  return getBuiltInMinibotBaseUrl();
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
  if (typeof fromExtra === "string") {
    return fromExtra;
  }
  return "";
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
