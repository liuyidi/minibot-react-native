import {
  createExternalLoginStartUrl,
  parseExternalAuthCallbackUrl,
} from "@/lib/auth/externalOAuth";

describe("external OAuth helpers", () => {
  test("builds start URL with native app-callback next", () => {
    const redirectUri = "exp://192.168.1.1:8081/--/oauth";
    const url = createExternalLoginStartUrl("google", redirectUri);
    const parsed = new URL(url);
    expect(parsed.pathname).toBe("/api/v1/auth/google/start");
    expect(parsed.searchParams.get("next")).toBe(
      `/oauth/app-callback?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  });

  test("parses tokens from callback URL", () => {
    const tokens = parseExternalAuthCallbackUrl(
      "minibot://oauth?access_token=a&refresh_token=r&expires_in=1800"
    );
    expect(tokens).toEqual({
      accessToken: "a",
      refreshToken: "r",
      expiresIn: 1800,
    });
  });
});
