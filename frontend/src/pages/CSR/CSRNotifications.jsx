import React from "react";
import NotificationList from "../../components/CSR/NotificationList";
import { Bell } from "lucide-react";

const CSRNotifications = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500">Stay updated with your program activities and important updates.</p>
      </header>

      {/* NOTIFICATIONS LIST */}
      <NotificationList />
    </div>
  </div>
);

export default CSRNotifications;
