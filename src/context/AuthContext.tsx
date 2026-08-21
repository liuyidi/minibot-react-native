import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authClient, demoLogin, startEmailLogin, verifyEmailLogin } from "@/lib/auth/client";
import type { EmailCodeStartResult } from "@/lib/auth/client";
import {
  fetchAuthUser,
  loginWithExternalProvider,
} from "@/lib/auth/externalOAuth";
import {
  clearAuthSession,
  getGuestMode,
  getStoredAuthSession,
  isAccessTokenExpired,
  saveAuthSession,
  setGuestMode,
} from "@/lib/auth/config";
import { setAccountInfo, DEFAULT_ACCOUNT, clearAccountInfo } from "@/lib/settings/accountConfig";
import { setAppearanceMode } from "@/lib/settings/appearanceConfig";
import {
  clearUserProfile,
  DEFAULT_PROFILE,
  setUserProfile,
} from "@/lib/settings/userProfileConfig";
import type { AuthUser, LoginPayload, RegisterPayload, StoredAuthSession } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  session: StoredAuthSession | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  canAccessApp: boolean;
  isReady: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  startEmailCode: (email: string) => Promise<EmailCodeStartResult>;
  verifyEmailCode: (
    email: string,
    code: string,
    options?: { username?: string }
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncUserToLocalProfile(user: AuthUser): Promise<void> {
  await Promise.all([
    setUserProfile({
      nickname: user.nickname,
      bio: user.bio?.trim() || DEFAULT_PROFILE.bio,
      avatarColor: DEFAULT_PROFILE.avatarColor,
    }),
    setAccountInfo({
      ...DEFAULT_ACCOUNT,
      email: user.email,
      phone: user.phone ?? "",
    }),
  ]);
}

async function clearLocalUserData(): Promise<void> {
  await Promise.all([
    clearAuthSession(),
    setGuestMode(false),
    clearUserProfile(),
    clearAccountInfo(),
    setAppearanceMode("system"),
  ]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredAuthSession | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [stored, guest] = await Promise.all([
        getStoredAuthSession(),
        getGuestMode(),
      ]);
      setSession(stored);
      // Prefer real session over stale guest flag.
      setIsGuest(!stored && guest);
      setIsReady(true);
    })();
  }, []);

  const applyAuthResponse = useCallback(
    async (user: AuthUser, accessToken: string, refreshToken: string, expiresIn: number) => {
      await setGuestMode(false);
      setIsGuest(false);
      const nextSession = await saveAuthSession(user, accessToken, refreshToken, expiresIn);
      await syncUserToLocalProfile(user);
      setSession(nextSession);
    },
    []
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authClient.login(payload);
      await applyAuthResponse(
        response.user,
        response.tokens.access_token,
        response.tokens.refresh_token,
        response.tokens.expires_in
      );
    },
    [applyAuthResponse]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authClient.register(payload);
      await applyAuthResponse(
        response.user,
        response.tokens.access_token,
        response.tokens.refresh_token,
        response.tokens.expires_in
      );
    },
    [applyAuthResponse]
  );

  const startEmailCode = useCallback(async (email: string) => {
    return startEmailLogin(email);
  }, []);

  const verifyEmailCode = useCallback(
    async (email: string, code: string, options?: { username?: string }) => {
      const response = await verifyEmailLogin(email, code, options);
      await applyAuthResponse(
        response.user,
        response.tokens.access_token,
        response.tokens.refresh_token,
        response.tokens.expires_in
      );
    },
    [applyAuthResponse]
  );

  const completeExternalLogin = useCallback(
    async (provider: "google" | "github") => {
      const tokens = await loginWithExternalProvider(provider);
      const user = await fetchAuthUser(tokens.accessToken);
      await applyAuthResponse(
        user,
        tokens.accessToken,
        tokens.refreshToken,
        tokens.expiresIn
      );
    },
    [applyAuthResponse]
  );

  const loginWithGoogle = useCallback(async () => {
    await completeExternalLogin("google");
  }, [completeExternalLogin]);

  const loginWithGitHub = useCallback(async () => {
    await completeExternalLogin("github");
  }, [completeExternalLogin]);

  const logout = useCallback(async () => {
    if (session?.refreshToken) {
      try {
        await authClient.logout(session.refreshToken);
      } catch {
        // still clear local session
      }
    }
    await clearLocalUserData();
    setSession(null);
    setIsGuest(false);
  }, [session?.refreshToken]);

  const enterGuestMode = useCallback(async () => {
    // Production gateway requires mini-auth Bearer; use demo-login for guest.
    const response = await demoLogin();
    await applyAuthResponse(
      response.user,
      response.tokens.access_token,
      response.tokens.refresh_token,
      response.tokens.expires_in
    );
    await setGuestMode(true);
    setIsGuest(true);
  }, [applyAuthResponse]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!session) {
      return null;
    }

    if (!isAccessTokenExpired(session.expiresAt)) {
      return session.accessToken;
    }

    try {
      const tokens = await authClient.refresh(session.refreshToken);
      const nextSession = await saveAuthSession(
        session.user,
        tokens.access_token,
        tokens.refresh_token,
        tokens.expires_in
      );
      setSession(nextSession);
      return nextSession.accessToken;
    } catch {
      await clearLocalUserData();
      setSession(null);
      return null;
    }
  }, [session]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      isAuthenticated: Boolean(session?.accessToken),
      isGuest,
      canAccessApp: Boolean(session?.accessToken) || isGuest,
      isReady,
      login,
      register,
      startEmailCode,
      verifyEmailCode,
      loginWithGoogle,
      loginWithGitHub,
      logout,
      enterGuestMode,
      getAccessToken,
    }),
    [
      session,
      isGuest,
      isReady,
      login,
      register,
      startEmailCode,
      verifyEmailCode,
      loginWithGoogle,
      loginWithGitHub,
      logout,
      enterGuestMode,
      getAccessToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
