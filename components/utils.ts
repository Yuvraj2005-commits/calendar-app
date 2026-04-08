export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return stripTime(a).getTime() < stripTime(b).getTime();
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
  const d = stripTime(date).getTime();
  const s = stripTime(start).getTime();
  const e = stripTime(end).getTime();
  return d > s && d < e;
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRangeLabel(start: Date | null, end: Date | null): string {
  if (!start) return "";
  if (!end) return formatShort(start);
  return `${formatShort(start)} – ${formatShort(end)}`;
}

export function getRangeKey(start: Date | null, end: Date | null): string {
  if (!start) return "";
  const s = toDateKey(start);
  const e = end ? toDateKey(end) : s;
  return `${s}__${e}`;
}