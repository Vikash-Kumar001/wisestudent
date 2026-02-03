import CSRNotification from "../models/CSRNotification.js";

/** CSR notifications are automatically deleted after this many seconds (7 days) */
const CSR_NOTIFICATION_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Start periodic cleanup of CSR notifications older than 7 days.
 * @param {Object} [opts] - { ttlSeconds, intervalSeconds }
 * @returns {Function} Stop function (clearInterval)
 */
export function startCsrNotificationTTL(
  { ttlSeconds = CSR_NOTIFICATION_TTL_SECONDS, intervalSeconds = 3600 } = {}
) {
  const intervalMs = Math.max(60, intervalSeconds) * 1000;

  const tick = async () => {
    try {
      const cutoff = new Date(Date.now() - ttlSeconds * 1000);
      const result = await CSRNotification.deleteMany({ createdAt: { $lt: cutoff } });
      if (result.deletedCount > 0) {
        console.log(`[csrNotificationTTL] Deleted ${result.deletedCount} notification(s) older than 7 days`);
      }
    } catch (err) {
      console.warn("[csrNotificationTTL] cleanup error:", err.message);
    }
  };

  const timer = setInterval(tick, intervalMs);
  setTimeout(tick, 5000);
  return () => clearInterval(timer);
}
