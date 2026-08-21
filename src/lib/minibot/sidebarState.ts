import { ApiError } from "@minibot/client";

export type SidebarStatePayload = {
  schema_version: number;
  pinned_keys: string[];
  archived_keys: string[];
  title_overrides: Record<string, string>;
  project_name_overrides: Record<string, string>;
  tags_by_key: Record<string, string[]>;
  collapsed_groups: Record<string, boolean>;
  view: {
    density: "comfortable" | "compact";
    show_previews: boolean;
    show_timestamps: boolean;
    show_archived: boolean;
    sort: "updated_desc" | "created_desc" | "title_asc";
  };
  updated_at?: string | null;
};

export const EMPTY_SIDEBAR_STATE: SidebarStatePayload = {
  schema_version: 1,
  pinned_keys: [],
  archived_keys: [],
  title_overrides: {},
  project_name_overrides: {},
  tags_by_key: {},
  collapsed_groups: {},
  view: {
    density: "compact",
    show_previews: false,
    show_timestamps: false,
    show_archived: false,
    sort: "updated_desc",
  },
  updated_at: null,
};

function normalizeState(raw: Partial<SidebarStatePayload> | null | undefined): SidebarStatePayload {
  return {
    ...EMPTY_SIDEBAR_STATE,
    ...raw,
    pinned_keys: Array.isArray(raw?.pinned_keys) ? raw!.pinned_keys : [],
    archived_keys: Array.isArray(raw?.archived_keys) ? raw!.archived_keys : [],
    title_overrides:
      raw?.title_overrides && typeof raw.title_overrides === "object"
        ? { ...raw.title_overrides }
        : {},
    project_name_overrides:
      raw?.project_name_overrides && typeof raw.project_name_overrides === "object"
        ? { ...raw.project_name_overrides }
        : {},
    tags_by_key:
      raw?.tags_by_key && typeof raw.tags_by_key === "object" ? { ...raw.tags_by_key } : {},
    collapsed_groups:
      raw?.collapsed_groups && typeof raw.collapsed_groups === "object"
        ? { ...raw.collapsed_groups }
        : {},
    view: {
      ...EMPTY_SIDEBAR_STATE.view,
      ...(raw?.view ?? {}),
    },
  };
}

export async function fetchSidebarState(
  baseUrl: string,
  token: string
): Promise<SidebarStatePayload> {
  const base = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/webui/sidebar-state`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new ApiError(res.status, `sidebar-state HTTP ${res.status}`);
  }
  const body = (await res.json()) as Partial<SidebarStatePayload>;
  return normalizeState(body);
}

export async function updateSidebarState(
  baseUrl: string,
  token: string,
  state: SidebarStatePayload
): Promise<SidebarStatePayload> {
  const base = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/webui/sidebar-state/update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });
  if (!res.ok) {
    throw new ApiError(res.status, `sidebar-state update HTTP ${res.status}`);
  }
  const body = (await res.json()) as Partial<SidebarStatePayload>;
  return normalizeState(body);
}

export function sessionKeyOf(idOrKey: string): string {
  const raw = idOrKey.trim();
  if (!raw) return raw;
  return raw.includes(":") ? raw : `websocket:${raw}`;
}
