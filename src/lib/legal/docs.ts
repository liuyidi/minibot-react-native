export const LEGAL_DOCS = {
  terms: {
    url: "https://auth.liuyidi.me/terms",
    titleKey: "about.terms" as const,
  },
  privacy: {
    url: "https://auth.liuyidi.me/privacy",
    titleKey: "about.privacy" as const,
  },
} as const;

export type LegalDoc = keyof typeof LEGAL_DOCS;

export function resolveLegalDoc(raw: string | string[] | undefined): LegalDoc {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "privacy") {
    return "privacy";
  }
  return "terms";
}
