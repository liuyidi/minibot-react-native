import { AUTH_BASE_URL_PROD, getAuthApiBaseUrl, getAuthApiUrl } from "@/lib/chat/apiConfig";

describe("auth api config", () => {
  test("prod IdP constant", () => {
    expect(AUTH_BASE_URL_PROD).toBe("https://auth.liuyidi.me");
  });

  test("auth login path", () => {
    const url = getAuthApiUrl("login");
    expect(url.endsWith("/api/v1/auth/login")).toBe(true);
    expect(url.startsWith("http")).toBe(true);
  });

  test("getAuthApiBaseUrl returns a host", () => {
    const base = getAuthApiBaseUrl();
    expect(base.includes("://")).toBe(true);
    expect(base.endsWith("/")).toBe(false);
  });
});
