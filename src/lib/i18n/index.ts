import { catalogs, type MessageCatalog } from "@/lib/i18n/messages";
import type { AppLanguage } from "@/lib/i18n/languageConfig";

type Params = Record<string, string | number>;

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function format(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] != null ? String(params[key]) : `{${key}}`
  );
}

export type TranslateFn = (path: string, params?: Params) => string;

export function createTranslator(language: AppLanguage): TranslateFn {
  const catalog: MessageCatalog = catalogs[language] ?? catalogs.zh;
  const fallback: MessageCatalog = catalogs.zh;

  return (path: string, params?: Params) => {
    const value = getPath(catalog, path) ?? getPath(fallback, path);
    if (typeof value !== "string") {
      return path;
    }
    return format(value, params);
  };
}

export function getCatalog(language: AppLanguage): MessageCatalog {
  return catalogs[language] ?? catalogs.zh;
}
