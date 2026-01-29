import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Send,
  Loader2,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import csrPartnerService from "../../services/admin/csrPartnerService";

const NOTIFICATION_TYPES = [
  "info",
  "reminder",
  "alert",
  "csr_approved",
  "program_created",
  "checkpoint_triggered",
  "report_generated",
];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

const AdminCSRNotifications = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notifPagination, setNotifPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [notifLoading, setNotifLoading] = useState(true);
  const [filters, setFilters] = useState({
    sponsorId: "",
    type: "",
    fromDate: "",
    toDate: "",
  });

  // Send form
  const [form, setForm] = useState({
    sponsorIds: [],
    title: "",
    message: "",
    link: "",
    type: "info",
    sendEmail: true,
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      setPartnersLoading(true);
      try {
        const res = await csrPartnerService.listPartners({
          status: "approved",
          limit: 500,
        });
        setPartners(res?.data || []);
      } catch (err) {
        console.error("Failed to load partners:", err);
        toast.error("Failed to load CSR partners");
      } finally {
        setPartnersLoading(false);
      }
    };
    loadPartners();
  }, []);

  const fetchNotifications = async (page = 1) => {
    setNotifLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(filters.sponsorId && { sponsorId: filters.sponsorId }),
        ...(filters.type && { type: filters.type }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
      };
      const res = await csrPartnerService.listNotifications(params);
      setNotifications(res?.data || []);
      setNotifPagination(res?.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
    } catch (err) {
      console.error("Failed to load notifications:", err);
      toast.error("Failed to load notifications");
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [filters.sponsorId, filters.type, filters.fromDate, filters.toDate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.sponsorIds?.length) {
      toast.error("Select at least one CSR partner");
      return;
    }
    setSending(true);
    try {
      await csrPartnerService.sendNotification({
        sponsorIds: form.sponsorIds,
        title: form.title.trim(),
        message: form.message?.trim() || "",
        type: form.type,
        link: form.link?.trim() || undefined,
        sendEmail: form.sendEmail,
      });
      toast.success("Notification sent");
      setForm((prev) => ({ ...prev, title: "", message: "", link: "", sponsorIds: [] }));
      fetchNotifications(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const togglePartner = (id) => {
    setForm((prev) =>
      prev.sponsorIds.includes(id)
        ? { ...prev, sponsorIds: prev.sponsorIds.filter((x) => x !== id) }
        : { ...prev, sponsorIds: [...prev.sponsorIds, id] }
    );
  };

  const selectAllPartners = () => {
    const ids = partners.map((p) => p._id);
    setForm((prev) => ({ ...prev, sponsorIds: ids }));
  };
  const clearPartners = () => setForm((prev) => ({ ...prev, sponsorIds: [] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/csr/partners")}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-indigo-600" />
              CSR Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Send notifications to CSR partners and view sent notifications
            </p>
          </div>
        </div>

        {/* Send notification */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Send notification
            </h2>
          </div>
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipients (CSR partners)</label>
              {partnersLoading ? (
                <p className="text-slate-500 text-sm">Loading partners...</p>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={selectAllPartners}
                    className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={clearPartners}
                    className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    Clear
                  </button>
                  {partners.map((p) => (
                    <label
                      key={p._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.sponsorIds.includes(p._id)}
                        onChange={() => togglePartner(p._id)}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-sm text-slate-700">{p.companyName || p.email}</span>
                    </label>
                  ))}
                  {!partners.length && (
                    <span className="text-sm text-slate-500">No approved CSR partners</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Notification title"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Optional message body"
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link (optional)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                placeholder="/csr/overview"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {NOTIFICATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <label className="inline-flex items-center gap-2 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) => setForm((p) => ({ ...p, sendEmail: e.target.checked }))}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Also send email</span>
              </label>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={sending || !form.title?.trim() || !form.sponsorIds?.length}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send notification
              </button>
            </div>
          </form>
        </section>

        {/* View sent notifications */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Sent notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={filters.sponsorId}
                onChange={(e) => setFilters((f) => ({ ...f, sponsorId: e.target.value }))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">All partners</option>
                {partners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.companyName || p.email}
                  </option>
                ))}
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">All types</option>
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              />
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            {notifLoading ? (
              <div className="flex items-center gap-2 text-slate-500 py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-slate-500 py-8 text-center">No notifications found</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Partner</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Title</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((n) => (
                        <tr key={n._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {formatDate(n.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {n.sponsorId?.companyName || n.sponsorId?.email || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {n.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{n.title || "—"}</td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                            {n.message || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {notifPagination.pages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-slate-500">
                      Total: {notifPagination.total} • Page {notifPagination.page} of{" "}
                      {notifPagination.pages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={notifPagination.page <= 1}
                        onClick={() => fetchNotifications(notifPagination.page - 1)}
                        className="p-2 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={notifPagination.page >= notifPagination.pages}
                        onClick={() => fetchNotifications(notifPagination.page + 1)}
                        className="p-2 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCSRNotifications;
