import { createAuthClient } from "@mini-auth/auth-rn";
import type { AuthResponse } from "@mini-auth/auth-rn";

import { getAuthApiBaseUrl } from "@/lib/chat/apiConfig";

/** Singleton IdP client — base URL from app.json / getAuthApiBaseUrl(). */
export const authClient = createAuthClient({
  baseUrl: getAuthApiBaseUrl(),
});

const DEMO_EMAIL = "demo@mini-auth.dev";
const DEMO_NICKNAME = "demo";

export type EmailCodeStartResult = {
  email: string;
  expires_in: number;
  resend_after_seconds: number;
  debug_code?: string | null;
};

function authBase(): string {
  return getAuthApiBaseUrl().replace(/\/+$/, "");
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${authBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { detail?: string };
  if (!response.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "请求失败");
  }
  return data;
}

/**
 * Guest entry → mini-auth demo-login (issues real tokens for Gateway Bearer).
 */
export async function demoLogin(): Promise<AuthResponse> {
  const data = await postJson<AuthResponse>("/api/v1/auth/demo-login", {
    email: DEMO_EMAIL,
    nickname: DEMO_NICKNAME,
  });
  if (!data.tokens?.access_token || !data.tokens?.refresh_token || !data.user) {
    throw new Error("Demo login response is missing tokens");
  }
  return data;
}

export async function startEmailLogin(email: string): Promise<EmailCodeStartResult> {
  return postJson<EmailCodeStartResult>("/api/v1/auth/email/start", {
    email: email.trim().toLowerCase(),
  });
}

export async function verifyEmailLogin(
  email: string,
  code: string,
  options?: { username?: string }
): Promise<AuthResponse> {
  const nickname = options?.username?.trim();
  const data = await postJson<AuthResponse>("/api/v1/auth/email/verify", {
    email: email.trim().toLowerCase(),
    code: code.trim(),
    ...(nickname ? { nickname } : {}),
  });
  if (!data.tokens?.access_token || !data.tokens?.refresh_token || !data.user) {
    throw new Error("登录响应缺少 token");
  }
  return data;
}
