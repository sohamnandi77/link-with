export function convertEpochToDateString(epochTime: number): string {
  const now = new Date();
  const date = new Date(epochTime);
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return minutes === 0
      ? "Just now"
      : `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "short",
  };

  if (days === 1) {
    return `Yesterday ${date.toLocaleString("en-US", formatOptions)}`;
  }

  if (days < 365) {
    return `${date.toLocaleString("en-US", formatOptions)}`;
  }

  formatOptions.year = "numeric";
  return `${date.toLocaleString("en-US", formatOptions)}`;
}
