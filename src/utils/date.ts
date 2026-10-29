/**
 * Date formatting utilities ensuring all dates reflect current live time.
 */

export function formatLiveDate(
  isoOrDate?: string | Date | null,
  includeTime = false,
): string {
  const dateObj = isoOrDate ? new Date(isoOrDate) : new Date();
  if (Number.isNaN(dateObj.getTime())) {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return dateObj.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatRelativeTime(isoOrDate?: string | Date | null): string {
  if (!isoOrDate) return "Just now";
  const dateObj = new Date(isoOrDate);
  if (Number.isNaN(dateObj.getTime())) return "Today";
  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - dateObj.getTime()) / 1000),
  );
  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatLiveDate(dateObj);
}

export function getOffsetIsoDate(minutesAgo = 0): string {
  return new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
}

