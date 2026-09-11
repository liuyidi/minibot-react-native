/** Per-day holiday meta for calendar cells. */
export type HolidayKind = "rest" | "work";

export type DayHolidayMeta = {
  /** Festival name shown above the day, e.g. 中秋节 */
  label?: string;
  /** 休 / 班 marker */
  kind?: HolidayKind;
};

export type YearHolidayMap = Record<string, DayHolidayMeta>;

/**
 * 2026 国务院放假调休（国办发明电〔2025〕7号）。
 * Keys: YYYY-MM-DD
 */
export const cnHolidays2026: YearHolidayMap = {
  "2026-01-01": { label: "元旦", kind: "rest" },
  "2026-01-02": { kind: "rest" },
  "2026-01-03": { kind: "rest" },
  "2026-01-04": { kind: "work" },

  "2026-02-14": { kind: "work" },
  "2026-02-15": { kind: "rest" },
  "2026-02-16": { label: "除夕", kind: "rest" },
  "2026-02-17": { label: "春节", kind: "rest" },
  "2026-02-18": { kind: "rest" },
  "2026-02-19": { kind: "rest" },
  "2026-02-20": { kind: "rest" },
  "2026-02-21": { kind: "rest" },
  "2026-02-22": { kind: "rest" },
  "2026-02-23": { kind: "rest" },
  "2026-02-28": { kind: "work" },

  "2026-04-04": { kind: "rest" },
  "2026-04-05": { label: "清明节", kind: "rest" },
  "2026-04-06": { kind: "rest" },

  "2026-05-01": { label: "劳动节", kind: "rest" },
  "2026-05-02": { kind: "rest" },
  "2026-05-03": { kind: "rest" },
  "2026-05-04": { kind: "rest" },
  "2026-05-05": { kind: "rest" },
  "2026-05-09": { kind: "work" },

  "2026-06-19": { label: "端午节", kind: "rest" },
  "2026-06-20": { kind: "rest" },
  "2026-06-21": { kind: "rest" },

  "2026-09-20": { kind: "work" },
  "2026-09-25": { label: "中秋节", kind: "rest" },
  "2026-09-26": { kind: "rest" },
  "2026-09-27": { kind: "rest" },

  "2026-10-01": { label: "国庆节", kind: "rest" },
  "2026-10-02": { kind: "rest" },
  "2026-10-03": { kind: "rest" },
  "2026-10-04": { kind: "rest" },
  "2026-10-05": { kind: "rest" },
  "2026-10-06": { kind: "rest" },
  "2026-10-07": { kind: "rest" },
  "2026-10-10": { kind: "work" },
};

/** 2025 国务院放假调休（国办发明电〔2024〕12号，摘要）。 */
export const cnHolidays2025: YearHolidayMap = {
  "2025-01-01": { label: "元旦", kind: "rest" },
  "2025-01-26": { kind: "work" },
  "2025-01-28": { kind: "rest" },
  "2025-01-29": { label: "除夕", kind: "rest" },
  "2025-01-30": { label: "春节", kind: "rest" },
  "2025-01-31": { kind: "rest" },
  "2025-02-01": { kind: "rest" },
  "2025-02-02": { kind: "rest" },
  "2025-02-03": { kind: "rest" },
  "2025-02-04": { kind: "rest" },
  "2025-02-08": { kind: "work" },
  "2025-04-04": { label: "清明节", kind: "rest" },
  "2025-04-05": { kind: "rest" },
  "2025-04-06": { kind: "rest" },
  "2025-04-27": { kind: "work" },
  "2025-05-01": { label: "劳动节", kind: "rest" },
  "2025-05-02": { kind: "rest" },
  "2025-05-03": { kind: "rest" },
  "2025-05-04": { kind: "rest" },
  "2025-05-05": { kind: "rest" },
  "2025-05-31": { kind: "work" },
  "2025-06-01": { label: "端午节", kind: "rest" },
  "2025-06-02": { kind: "rest" },
  "2025-09-28": { kind: "work" },
  "2025-10-01": { label: "国庆节", kind: "rest" },
  "2025-10-02": { kind: "rest" },
  "2025-10-03": { kind: "rest" },
  "2025-10-04": { kind: "rest" },
  "2025-10-05": { kind: "rest" },
  "2025-10-06": { label: "中秋节", kind: "rest" },
  "2025-10-07": { kind: "rest" },
  "2025-10-08": { kind: "rest" },
  "2025-10-11": { kind: "work" },
};

const builtinByYear: Record<number, YearHolidayMap> = {
  2025: cnHolidays2025,
  2026: cnHolidays2026,
};

let overrides: YearHolidayMap = {};

/** Merge extra / replacement day meta (same key wins over builtin). */
export function setHolidayOverrides(map: YearHolidayMap) {
  overrides = { ...map };
}

export function clearHolidayOverrides() {
  overrides = {};
}

export function getBuiltinHolidays(year: number): YearHolidayMap {
  return builtinByYear[year] ?? {};
}

export function getDayHolidayMeta(dateKey: string): DayHolidayMeta | undefined {
  if (overrides[dateKey]) return overrides[dateKey];
  const year = Number(dateKey.slice(0, 4));
  if (!Number.isFinite(year)) return undefined;
  return builtinByYear[year]?.[dateKey];
}

/** Resolve meta with optional per-call override map. */
export function resolveDayHolidayMeta(
  dateKey: string,
  extra?: YearHolidayMap | null,
): DayHolidayMeta | undefined {
  if (extra?.[dateKey]) return extra[dateKey];
  return getDayHolidayMeta(dateKey);
}
