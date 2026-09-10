import {
  fetchSecurityOperations,
  fetchSecuritySnapshot,
  maskIpForDisplay,
  revokeSecuritySession,
} from "@/lib/auth/security";

jest.mock("@/lib/chat/apiConfig", () => ({
  getAuthApiBaseUrl: () => "https://auth.example.com",
}));

describe("security API client", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("maps snapshot devices from snake_case", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        devices: [
          {
            id: "1",
            name: "iPhone",
            system: "iOS",
            logged_in_at: "2026/09/10 10:00:00",
            last_seen_at: "2026/09/10 16:00:00",
            kind: "mobile",
            is_current: true,
            client_id: "minibot",
            app_name: "Minibot",
            ip_address: "1.2.3.4",
            location: "浙江省杭州市",
          },
        ],
      }),
    });

    const snap = await fetchSecuritySnapshot("tok");
    expect(snap.devices).toHaveLength(1);
    expect(snap.devices[0]).toEqual({
      id: "1",
      name: "iPhone",
      system: "iOS",
      loggedInAt: "2026/09/10 10:00:00",
      lastSeenAt: "2026/09/10 16:00:00",
      kind: "mobile",
      isCurrent: true,
      clientId: "minibot",
      appName: "Minibot",
      ipAddress: "1.2.3.4",
      location: "浙江省杭州市",
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://auth.example.com/api/v1/security/snapshot",
      { headers: { Authorization: "Bearer tok" } }
    );
  });

  test("maps operations from snake_case with enriched fields", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "op-1",
          action: "登录",
          device: "iPhone",
          occurred_at: "2026/09/10 10:00:00",
          location: "浙江省杭州市",
          kind: "mobile",
          app_name: "Minibot",
          ip_address: "115.196.84.12",
          ip_masked: "115.196.84.***",
          status: "设备活跃",
        },
      ],
    });

    const ops = await fetchSecurityOperations("tok");
    expect(ops[0]).toEqual({
      id: "op-1",
      action: "登录",
      device: "iPhone",
      occurredAt: "2026/09/10 10:00:00",
      location: "浙江省杭州市",
      kind: "mobile",
      appName: "Minibot",
      ipAddress: "115.196.84.12",
      ipMasked: "115.196.84.***",
      status: "设备活跃",
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://auth.example.com/api/v1/security/operations",
      { headers: { Authorization: "Bearer tok" } }
    );
  });

  test("revoke succeeds on 204", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => ({}),
    });

    await expect(revokeSecuritySession("tok", "session-1")).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://auth.example.com/api/v1/security/sessions/session-1",
      { method: "DELETE", headers: { Authorization: "Bearer tok" } }
    );
  });

  test("revoke throws on 409 current device", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ detail: "current_device" }),
    });

    await expect(revokeSecuritySession("tok", "1")).rejects.toThrow(/current/i);
  });

  test("maskIpForDisplay masks IPv4 and handles empty input", () => {
    expect(maskIpForDisplay("115.196.84.12")).toBe("115.196.84.***");
    expect(maskIpForDisplay(null)).toBeNull();
    expect(maskIpForDisplay("")).toBeNull();
    expect(maskIpForDisplay("  ")).toBeNull();
  });

  test("maskIpForDisplay masks IPv6", () => {
    expect(maskIpForDisplay("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(
      "2001:0db8:85a3:***"
    );
  });
});
