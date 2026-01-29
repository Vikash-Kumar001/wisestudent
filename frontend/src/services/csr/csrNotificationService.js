import api from "../../utils/api";

const CSR_NOTIFICATIONS = "/api/csr/notifications";

/**
 * List CSR notifications (doc alignment: GET /api/csr/notifications)
 * @param {Object} params - { limit? }
 */
export const list = (params = {}) =>
  api.get(CSR_NOTIFICATIONS, { params }).then((res) => res.data);

/**
 * Mark a notification as read (doc alignment: PUT /api/csr/notifications/:id/read)
 * @param {string} id - Notification ID
 */
export const markAsRead = (id) =>
  api.put(`${CSR_NOTIFICATIONS}/${id}/read`).then((res) => res.data);

/**
 * Unread count (derived from list response; no separate endpoint)
 */
export const unreadCount = () =>
  api.get(`${CSR_NOTIFICATIONS}?limit=1`).then((res) => ({
    count: res.data?.unreadCount ?? 0,
  }));

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () =>
  api.put(`${CSR_NOTIFICATIONS}/read-all`).then((res) => res.data);

const csrNotificationService = {
  list,
  markAsRead,
  unreadCount,
  markAllAsRead,
};

export default csrNotificationService;
