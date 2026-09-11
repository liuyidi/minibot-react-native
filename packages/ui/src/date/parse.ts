/** Local calendar date — no timezone shift via `Date.UTC`. */
export function parseDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) {
    return null;
  }
  return dt;
}

export function parseTime(value: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function parseDateTime(value: string): Date | null {
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{1,2}:\d{2})$/.exec(value.trim());
  if (!m) return null;
  const date = parseDate(m[1]);
  const time = parseTime(m[2]);
  if (!date || !time) return null;
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
}
