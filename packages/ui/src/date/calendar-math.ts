import { formatDate } from "./format";
import { parseDate } from "./parse";

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Sunday-first weekday index 0–6. */
export function weekdaySun0(date: Date): number {
  return date.getDay();
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function compareDay(a: Date, b: Date): number {
  const aa = startOfDay(a).getTime();
  const bb = startOfDay(b).getTime();
  return aa === bb ? 0 : aa < bb ? -1 : 1;
}

export function isWeekend(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}

export function clampDate(date: Date, min?: Date | null, max?: Date | null): Date {
  let d = startOfDay(date);
  if (min && compareDay(d, min) < 0) d = startOfDay(min);
  if (max && compareDay(d, max) > 0) d = startOfDay(max);
  return d;
}

export function nightCount(start: Date, end: Date): number {
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function durationLabel(start: Date, end: Date): { days: number; hours: number } {
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return { days: 0, hours: 0 };
  const totalHours = Math.floor(ms / 3_600_000);
  return { days: Math.floor(totalHours / 24), hours: totalHours % 24 };
}

export type MonthCell =
  | { kind: "empty" }
  | { kind: "day"; date: Date; key: string };

/** Build one month grid (Sun–Sat columns). */
export function buildMonthCells(year: number, monthIndex: number): MonthCell[] {
  const first = new Date(year, monthIndex, 1);
  const lead = weekdaySun0(first);
  const count = daysInMonth(year, monthIndex);
  const cells: MonthCell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ kind: "empty" });
  for (let d = 1; d <= count; d++) {
    const date = new Date(year, monthIndex, d);
    cells.push({ kind: "day", date, key: formatDate(date) });
  }
  return cells;
}

export function eachMonth(from: Date, to: Date): { year: number; monthIndex: number }[] {
  const out: { year: number; monthIndex: number }[] = [];
  let cur = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);
  while (cur.getTime() <= end.getTime()) {
    out.push({ year: cur.getFullYear(), monthIndex: cur.getMonth() });
    cur = addMonths(cur, 1);
  }
  return out;
}

export function dateFromYmdParts(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

export function safeParseOrToday(value?: string | null): Date {
  if (value) {
    const p = parseDate(value);
    if (p) return p;
  }
  return startOfDay(new Date());
}
