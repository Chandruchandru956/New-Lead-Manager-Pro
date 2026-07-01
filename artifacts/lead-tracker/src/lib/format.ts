import { formatDistanceToNow, format } from "date-fns";

export function formatCurrency(value?: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (e) {
    return "—";
  }
}

export function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (e) {
    return "—";
  }
}
