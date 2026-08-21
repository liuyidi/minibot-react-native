import Constants from "expo-constants";
import { Platform } from "react-native";

const AUTH_API_PREFIX = "/api/v1/auth";

/** Production mini-auth IdP. */
export const AUTH_BASE_URL_PROD = "https://auth.liuyidi.me";

function resolveDevBaseUrl(): string {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://127.0.0.1:8000";
}

/**
 * Base URL for mini-auth (`/api/v1/auth/*`), no trailing slash.
 * Precedence: `extra.chatApiBaseUrl` / `extra.authApiBaseUrl` → else prod.
 * Localhost only when explicitly set in extra (or unset + `__DEV__` local override via extra).
 */
export function getAuthApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra;
  const fromExtra =
    (typeof extra?.authApiBaseUrl === "string" && extra.authApiBaseUrl) ||
    (typeof extra?.chatApiBaseUrl === "string" && extra.chatApiBaseUrl) ||
    "";
  const trimmed = fromExtra.trim().replace(/\/$/, "");
  if (trimmed) {
    return trimmed;
  }

  // No extra → production IdP (including __DEV__ so Expo Go hits auth.liuyidi.me by default).
  return AUTH_BASE_URL_PROD;
}

/** @deprecated Use getAuthApiBaseUrl — kept for older call sites. */
export function getChatApiBaseUrl(): string {
  return getAuthApiBaseUrl();
}

/** Dev-only helper when explicitly targeting a local mini-auth. */
export function getLocalAuthApiBaseUrl(): string {
  return resolveDevBaseUrl();
}

export function getAuthApiUrl(path: "" | "register" | "login" | "refresh" | "logout"): string {
  const suffix = path ? `/${path}` : "";
  return `${getAuthApiBaseUrl()}${AUTH_API_PREFIX}${suffix}`;
}
