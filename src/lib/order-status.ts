export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  confirmed: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  preparing: "bg-violet-100 text-violet-900 dark:bg-violet-900/30 dark:text-violet-200",
  out_for_delivery: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-200",
  delivered: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
};

export const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;