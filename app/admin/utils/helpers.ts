// app/admin/utils/helpers.ts
export function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (days === 1) {
    return "Igår";
  } else if (days < 7) {
    return `${days} dagar sedan`;
  } else {
    return date.toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPriorityColor(priority: number) {
  if (priority >= 4) return "text-red-600";
  if (priority >= 3) return "text-orange-600";
  return "text-green-600";
}

export function calculateProgress(startDate: number) {
  const now = Date.now();
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const typicalDays = 14;
  let progress = Math.min(95, Math.floor((daysSinceStart / typicalDays) * 100));
  return Math.max(5, Math.min(95, progress));
}

export function getProgressColor(progress: number, isOverdue: boolean = false) {
  if (isOverdue) return "bg-red-500";
  if (progress >= 75) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  return "bg-yellow-500";
}
