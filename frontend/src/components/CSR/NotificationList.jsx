import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Bell, Check } from "lucide-react";
import toast from "react-hot-toast";
import csrNotificationService from "../../services/csr/csrNotificationService";
import { useSocket } from "../../context/SocketContext";
import NotificationItem from "./NotificationItem";

const TYPE_FILTERS = [
  "all",
  "unread",
  "info",
  "success",
  "warning",
  "alert",
  "message",
  "achievement",
  "general",
];

const NotificationList = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (showToast = false) => {
    setLoading(true);
    setError("");
    try {
      const payload = await csrNotificationService.list({ limit: 50 });
      const raw = payload?.notifications || payload?.data || (Array.isArray(payload) ? payload : []);
      const list = raw.map((n) => ({ ...n, isRead: n.read ?? n.isRead }));
      setNotifications(list);
      setUnreadCount(payload?.unreadCount ?? list.filter((x) => !x.isRead).length);
      if (showToast && list.length > 0) {
        toast.success(`Loaded ${list.length} notification${list.length !== 1 ? "s" : ""}`);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Unable to load notifications.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const payload = await csrNotificationService.unreadCount();
      setUnreadCount(payload?.count ?? 0);
    } catch (err) {
      console.error("Unread count failed", err);
      // Don't show error toast for unread count failures
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    loadUnreadCount();
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  // Phase 8: Real-time CSR notifications (Socket.IO)
  useEffect(() => {
    const s = socket;
    if (!s) return;
    const handler = () => {
      fetchNotifications(false);
      loadUnreadCount();
      toast.success("New notification");
    };
    s.on("csr:notification:new", handler);
    return () => s.off("csr:notification:new", handler);
  }, [socket, fetchNotifications, loadUnreadCount]);

  const handleMarkRead = async (notification) => {
    if (notification?.isRead) return;
    
    // Optimistic update
    const previousNotifications = [...notifications];
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notification._id ? { ...item, isRead: true } : item
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await csrNotificationService.markAsRead(notification._id);
      // Reload unread count
      loadUnreadCount();
    } catch (err) {
      // Revert optimistic update on error
      setNotifications(previousNotifications);
      setUnreadCount((prev) => prev + 1);
      const errorMessage = err?.response?.data?.message || "Failed to mark notification as read";
      toast.error(errorMessage);
      console.error("Cannot mark notification read", err);
    }
  };

  // CSR notifications API does not support delete; hide delete in CSR context
  const handleDelete = async (notification) => {
    toast.error("Delete is not available for CSR notifications.");
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    // Optimistic update
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await csrNotificationService.markAllAsRead();
      toast.success("All notifications marked as read");
      loadUnreadCount();
    } catch (err) {
      // Revert optimistic update on error
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      const errorMessage = err?.response?.data?.message || "Failed to mark all notifications as read";
      toast.error(errorMessage);
      console.error("Failed to mark all read", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(true);
    await loadUnreadCount();
  };

  const filterOptions = useMemo(
    () =>
      TYPE_FILTERS.map((type) => ({
        value: type,
        label: type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1),
      })),
    []
  );

  const displayedNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }
    if (filter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }
    return notifications.filter((item) => item.type === filter);
  }, [filter, notifications]);

  return (
    <div className="space-y-6">
      {/* FILTERS AND ACTIONS */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">All Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <Check className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => {
                setError("");
                fetchNotifications();
              }}
              className="ml-4 text-rose-600 hover:text-rose-800 font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS LIST */}
      <section className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading notifications...</span>
            </div>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-900">No notifications</p>
            <p className="text-xs text-slate-500 mt-1">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : filter !== "all"
                ? `No ${filter} notifications found.`
                : "You'll see notifications about your programs here."}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Show all notifications
              </button>
            )}
          </div>
        ) : (
          <>
            {loading && (
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Refreshing...</span>
                </div>
              </div>
            )}
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                showActions
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default NotificationList;
