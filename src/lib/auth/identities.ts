import { getAuthApiBaseUrl } from "@/lib/chat/apiConfig";

export type LinkedIdentity = {
  provider: "google" | "github";
  displayName: string | null;
};

export type UserIdentities = {
  google: LinkedIdentity | null;
  github: LinkedIdentity | null;
};

const EMPTY_IDENTITIES: UserIdentities = {
  google: null,
  github: null,
};

export async function fetchUserIdentities(accessToken: string): Promise<UserIdentities> {
  const response = await fetch(`${getAuthApiBaseUrl()}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json().catch(() => ({}))) as {
    identities?: Array<{ provider?: string; display_name?: string | null }>;
    detail?: string;
  };
  if (!response.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Failed to load identities");
  }

  const identities = data.identities ?? [];
  const google = identities.find((item) => item.provider === "google");
  const github = identities.find((item) => item.provider === "github");

  return {
    google: google
      ? {
          provider: "google",
          displayName: google.display_name?.trim() || null,
        }
      : null,
    github: github
      ? {
          provider: "github",
          displayName: github.display_name?.trim() || null,
        }
      : null,
  };
}

export function formatIdentityHubValue(
  identities: UserIdentities,
  email: string,
  labels: {
    googleBound: string;
    githubBound: string;
    unbound: string;
  },
  maskEmailFn: (email: string) => string
): string {
  if (identities.google) {
    return identities.google.displayName || labels.googleBound;
  }
  if (identities.github) {
    return identities.github.displayName || labels.githubBound;
  }
  if (email) {
    return maskEmailFn(email);
  }
  return labels.unbound;
}

export { EMPTY_IDENTITIES };
