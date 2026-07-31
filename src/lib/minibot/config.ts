import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL_KEY = "@minibot/baseUrl";
const SECRET_KEY = "@minibot/authSecret";
const AUTO_CONNECT_KEY = "@minibot/autoConnect";

/** iOS / Web — public domain (TLS + SNI). */
export const MINIBOT_BASE_URL_IOS = "https://bot.liuyidi.me";

/** Android — ECS IP + gateway port (avoids domain/TLS quirks on some devices). */
export const MINIBOT_BASE_URL_ANDROID = "http://116.62.35.76:8766";

/** Old built-in locals — treat as unset so apps pick up platform defaults. */
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
  // Android previously defaulted to the public domain; force IP built-in unless a
  // real debug override (non-domain) was saved.
  if (Platform.OS === "android" && cleaned === MINIBOT_BASE_URL_IOS) {
    return null;
  }
  return cleaned;
}

/** Hardcoded gateway origin for the current platform (no trailing slash). */
export function getBuiltInMinibotBaseUrl(): string {
  if (Platform.OS === "android") {
    return MINIBOT_BASE_URL_ANDROID;
  }
  return MINIBOT_BASE_URL_IOS;
}

/**
 * Resolve minibot gateway origin.
 * Prefers a debug override from the hidden server page; otherwise platform built-in.
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
