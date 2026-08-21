import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  TokenResponse,
} from "@mini-auth/auth-rn";

export type { AuthResponse, AuthUser, LoginPayload, RegisterPayload, TokenResponse };

export type AuthTokens = TokenResponse;

export type StoredAuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};
