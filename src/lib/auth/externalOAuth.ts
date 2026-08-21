import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { getAuthApiBaseUrl } from "@/lib/chat/apiConfig";
import type { AuthUser } from "@/types/auth";

WebBrowser.maybeCompleteAuthSession();

export type ExternalAuthProvider = "google" | "github";

export type ExternalAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

function authBase(): string {
  return getAuthApiBaseUrl().replace(/\/+$/, "");
}

/** Deep-link return URL captured by AuthSession (Expo Go or standalone). */
export function getNativeOAuthRedirectUri(): string {
  return Linking.createURL("oauth");
}

export function createExternalLoginStartUrl(
  provider: ExternalAuthProvider,
  redirectUri: string
): string {
  const next = `/oauth/app-callback?redirect_uri=${encodeURIComponent(redirectUri)}`;
  const params = new URLSearchParams({ next });
  return `${authBase()}/api/v1/auth/${provider}/start?${params.toString()}`;
}

export function parseExternalAuthCallbackUrl(url: string): ExternalAuthTokens | null {
  try {
    const parsed = new URL(url);
    const params = parsed.searchParams;
    // Some Expo URLs put query after `/--/oauth`
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const expiresRaw = params.get("expires_in");
    if (!accessToken || !refreshToken) {
      return null;
    }
    const expiresIn = Number(expiresRaw);
    return {
      accessToken,
      refreshToken,
      expiresIn: Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 1800,
    };
  } catch {
    return null;
  }
}

export async function fetchAuthUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch(`${authBase()}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json().catch(() => ({}))) as AuthUser & { detail?: string };
  if (!response.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Failed to load profile");
  }
  if (!data.id || !data.email) {
    throw new Error("Invalid user profile");
  }
  return data;
}

/**
 * Open Google/GitHub OAuth in the system auth session and return tokens.
 */
export async function loginWithExternalProvider(
  provider: ExternalAuthProvider
): Promise<ExternalAuthTokens> {
  const redirectUri = getNativeOAuthRedirectUri();
  const startUrl = createExternalLoginStartUrl(provider, redirectUri);
  const result = await WebBrowser.openAuthSessionAsync(startUrl, redirectUri);
  if (result.type !== "success" || !result.url) {
    throw new Error(result.type === "cancel" ? "登录已取消" : "登录未完成");
  }
  const tokens = parseExternalAuthCallbackUrl(result.url);
  if (!tokens) {
    throw new Error("OAuth 回调缺少 token");
  }
  return tokens;
}
