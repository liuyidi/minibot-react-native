import { getAuthApiBaseUrl } from "@/lib/chat/apiConfig";

export type SecurityDeviceKind = "browser" | "desktop" | "mobile";

export type SecurityDevice = {
  id: string;
  name: string;
  system: string;
  loggedInAt: string;
  lastSeenAt: string;
  kind: SecurityDeviceKind;
  isCurrent: boolean;
  clientId?: string | null;
  appName?: string | null;
  ipAddress?: string | null;
  location?: string | null;
};

export type SecurityOperation = {
  id: string;
  action: string;
  device: string;
  occurredAt: string;
  location: string;
  kind?: SecurityDeviceKind | null;
  appName?: string | null;
  ipAddress?: string | null;
  ipMasked?: string | null;
  status?: string | null;
};

export type SecuritySnapshot = {
  devices: SecurityDevice[];
};

type ApiSecurityDevice = {
  id: string;
  name: string;
  system: string;
  logged_in_at: string;
  last_seen_at: string;
  kind: SecurityDeviceKind;
  is_current: boolean;
  client_id?: string | null;
  app_name?: string | null;
  ip_address?: string | null;
  location?: string | null;
};

type ApiSecurityOperation = {
  id: string;
  action: string;
  device: string;
  occurred_at: string;
  location: string;
  kind?: SecurityDeviceKind | null;
  app_name?: string | null;
  ip_address?: string | null;
  ip_masked?: string | null;
  status?: string | null;
};

type ErrorPayload = {
  detail?: string | { code?: string; message?: string };
};

function authHeaders(accessToken: string): HeadersInit {
  return { Authorization: `Bearer ${accessToken}` };
}

function mapDevice(device: ApiSecurityDevice): SecurityDevice {
  return {
    id: device.id,
    name: device.name,
    system: device.system,
    loggedInAt: device.logged_in_at,
    lastSeenAt: device.last_seen_at || device.logged_in_at,
    kind: device.kind,
    isCurrent: device.is_current,
    clientId: device.client_id,
    appName: device.app_name,
    ipAddress: device.ip_address,
    location: device.location,
  };
}

function mapOperation(item: ApiSecurityOperation): SecurityOperation {
  return {
    id: item.id,
    action: item.action,
    device: item.device,
    occurredAt: item.occurred_at,
    location: item.location,
    kind: item.kind,
    appName: item.app_name,
    ipAddress: item.ip_address,
    ipMasked: item.ip_masked,
    status: item.status,
  };
}

async function readErrorDetail(response: Response): Promise<string> {
  const data = (await response.json().catch(() => ({}))) as ErrorPayload;
  if (typeof data.detail === "string") {
    return data.detail;
  }
  if (data.detail && typeof data.detail === "object") {
    if (typeof data.detail.message === "string") {
      return data.detail.message;
    }
    if (typeof data.detail.code === "string") {
      return data.detail.code;
    }
  }
  return "Security API request failed";
}

export function maskIpForDisplay(ip: string | null | undefined): string | null {
  if (ip == null) {
    return null;
  }
  const value = ip.trim();
  if (!value) {
    return null;
  }
  if (value.includes(":")) {
    const parts = value.split(":");
    const kept = parts.filter((part) => part).slice(0, 3);
    return kept.length > 0 ? `${kept.join(":")}:***` : "***";
  }
  const parts = value.split(".");
  if (parts.length === 4 && parts.every((part) => /^\d+$/.test(part))) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  }
  return value;
}

export async function fetchSecuritySnapshot(accessToken: string): Promise<SecuritySnapshot> {
  const response = await fetch(`${getAuthApiBaseUrl()}/api/v1/security/snapshot`, {
    headers: authHeaders(accessToken),
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response));
  }
  const data = (await response.json()) as { devices?: ApiSecurityDevice[] };
  return {
    devices: (data.devices ?? []).map(mapDevice),
  };
}

export async function fetchSecurityOperations(
  accessToken: string
): Promise<SecurityOperation[]> {
  const response = await fetch(`${getAuthApiBaseUrl()}/api/v1/security/operations`, {
    headers: authHeaders(accessToken),
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response));
  }
  const data = (await response.json()) as ApiSecurityOperation[];
  return data.map(mapOperation);
}

export async function revokeSecuritySession(
  accessToken: string,
  sessionId: string
): Promise<void> {
  const response = await fetch(
    `${getAuthApiBaseUrl()}/api/v1/security/sessions/${encodeURIComponent(sessionId)}`,
    {
      method: "DELETE",
      headers: authHeaders(accessToken),
    }
  );
  if (response.status === 409) {
    const detail = await readErrorDetail(response);
    if (detail === "current_device" || /current/i.test(detail)) {
      throw new Error("Cannot revoke the current device session");
    }
    throw new Error(detail);
  }
  if (!response.ok) {
    throw new Error(await readErrorDetail(response));
  }
}
