function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function formatTime(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)}T${formatTime(date.getHours(), date.getMinutes())}`;
}

/** `09-11` style month-day for summaries. */
export function formatMonthDay(date: Date): string {
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
