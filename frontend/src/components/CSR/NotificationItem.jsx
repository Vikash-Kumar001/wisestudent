import React from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  MessageSquare,
  Sparkles,
  Trash2,
  Check,
  ExternalLink,
} from "lucide-react";

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  alert: Bell,
  message: MessageSquare,
  achievement: Sparkles,
  general: Bell,
};

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  showActions = false,
  compact = false,
}) => {
  if (!notification) return null;
  const Icon = iconMap[notification.type] || Bell;
  
  // Format timestamp
  const formatTimestamp = (date) => {
    if (!date) return null;
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return notifDate.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: notifDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const timestamp = formatTimestamp(notification.createdAt);

  const handleMarkRead = () => {
    if (notification.isRead) return;
    onMarkRead?.(notification);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      onDelete?.(notification);
    }
  };

  const hasLink = notification.metadata?.link || notification.metadata?.actionLink;
  const linkUrl = notification.metadata?.link || notification.metadata?.actionLink;
  const linkLabel = notification.metadata?.actionLabel || "View details";

  return (
    <div
      className={`bg-white rounded-2xl border px-4 py-4 shadow-sm transition-all hover:shadow-md ${
        notification.isRead
          ? "border-slate-100"
          : "border-indigo-200 bg-indigo-50/50"
      } ${compact ? "text-sm" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 rounded-xl p-2 transition-colors ${
            notification.isRead
              ? "bg-slate-100 text-slate-500"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-slate-900 truncate ${
                  notification.isRead ? "" : "text-indigo-900"
                }`}
              >
                {notification.title || "New notification"}
              </p>
              {timestamp && (
                <span className="text-xs text-slate-400 mt-1 block">{timestamp}</span>
              )}
            </div>
            {!notification.isRead && (
              <span className="shrink-0 h-2 w-2 rounded-full bg-indigo-600 mt-1"></span>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed break-words">
            {notification.message}
          </p>
          {hasLink && linkUrl && (
            <a
              href={linkUrl}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              target={linkUrl.startsWith("http") ? "_blank" : undefined}
              rel={linkUrl.startsWith("http") ? "noreferrer" : undefined}
              onClick={handleMarkRead}
            >
              {linkLabel}
              {linkUrl.startsWith("http") && <ExternalLink className="h-3 w-3" />}
            </a>
          )}
          {showActions && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleMarkRead}
                disabled={notification.isRead}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  notification.isRead
                    ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                Mark read
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
