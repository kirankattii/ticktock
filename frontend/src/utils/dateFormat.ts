import { format, parseISO, addDays } from "date-fns";

export function formatDateLabel(date: string): string {
  const parsedDate = parseISO(date);
  return format(parsedDate, "MMM d");
}

export function formatWeekRange(startDate: string, endDate?: string): string {
  const start = parseISO(startDate);
  const end = endDate ? parseISO(endDate) : addDays(start, 6);

  const startDay = format(start, "d");
  const endDay = format(end, "d");
  const monthYear = format(start, "MMMM yyyy");

  return `${startDay} - ${endDay} ${monthYear}`;
}

export function formatWeekLabel(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
}
