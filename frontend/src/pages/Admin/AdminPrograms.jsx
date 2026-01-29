import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Search,
  Plus,
  Eye,
  Edit,
  Archive,
  RefreshCw,
  Building2,
  Users,
  School,
  Calendar,
  LayoutGrid,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";
import csrPartnerService from "../../services/admin/csrPartnerService";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const getStatusColor = (status) => {
  switch (String(status)) {
    case "draft":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    case "approved":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "implementation_in_progress":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case "mid_program_review_completed":
      return "bg-purple-100 text-purple-700 border border-purple-200";
    case "completed":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

const formatStatus = (status) => {
  if (!status) return "—";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const AdminPrograms = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [csrPartners, setCsrPartners] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [csrFilter, setCsrFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchPrograms = async (options = {}) => {
    const { showToast = false, resetPage = false } = options;
    if (!refreshing) setLoading(true);
    setRefreshing(true);
    setError(null);
    const nextPage = resetPage ? 1 : page;
    try {
      const params = { page: nextPage, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (csrFilter) params.csrPartnerId = csrFilter;

      const res = await programAdminService.listPrograms(params);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.programs ?? [];
      setPrograms(list);
      setPagination({
        page: res?.pagination?.page ?? nextPage,
        pages: res?.pagination?.pages ?? 1,
        total: res?.pagination?.total ?? 0,
        limit: res?.pagination?.limit ?? 20,
      });
      if (resetPage) setPage(1);
      if (showToast) toast.success("Programs list updated");
    } catch (err) {
      console.error("Failed to fetch programs:", err);
      setError(err?.response?.data?.message || "Failed to load programs");
      if (showToast) toast.error("Failed to load programs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCSRPartners = async () => {
    try {
      const res = await csrPartnerService.listPartners({ status: "approved" });
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
      setCsrPartners(list);
    } catch (err) {
      console.error("Failed to fetch CSR partners:", err);
    }
  };

  useEffect(() => {
    fetchCSRPartners();
  }, []);

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, csrFilter]);

  const handleRefresh = () => fetchPrograms({ showToast: true, resetPage: true });

  const handleArchive = async (program) => {
    if (!confirm(`Archive "${program.name}"? This cannot be undone.`)) return;
    try {
      await programAdminService.archiveProgram(program._id);
      toast.success("Program archived");
      fetchPrograms({ resetPage: false });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to archive program");
    }
  };

  const hasFilters = search || statusFilter || csrFilter;

  if (error && programs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Unable to load programs</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchPrograms({ resetPage: true })}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Super Admin</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-indigo-600" />
              Programs
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage CSR programs, schools, and checkpoints.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-gray-100 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/programs/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Program
            </button>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black text-slate-900">
                {formatNumber(pagination.total)}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-3">Total Programs</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black text-slate-900">
                {formatNumber(csrPartners.length)}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-3">CSR Partners (Approved)</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate("/admin/programs/create")}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-bold text-indigo-600">Create</span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-3">New Program</p>
          </motion.div>
        </section>

        {/* FILTERS */}
        <section className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search programs..."
              className="pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={csrFilter}
            onChange={(e) => {
              setCsrFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border-2 border-gray-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All CSR Partners</option>
            {csrPartners.map((partner) => (
              <option key={partner._id} value={partner._id}>
                {partner.companyName ?? "—"}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border-2 border-gray-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="implementation_in_progress">In Progress</option>
            <option value="mid_program_review_completed">Mid-Program Review</option>
            <option value="completed">Completed</option>
          </select>
        </section>

        {/* TABLE CARD */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-slate-600 font-medium">Loading programs...</span>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-14 h-14 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600 font-medium">No programs found</p>
              <p className="text-sm text-slate-500 mt-1">
                {hasFilters
                  ? "Try adjusting filters or clear search."
                  : 'Click "Create Program" to add a new CSR program.'}
              </p>
              {!hasFilters && (
                <button
                  onClick={() => navigate("/admin/programs/create")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Create Program
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                      <th className="px-5 py-4">Program</th>
                      <th className="px-5 py-4">CSR Partner</th>
                      <th className="px-5 py-4">Duration</th>
                      <th className="px-5 py-4">Schools</th>
                      <th className="px-5 py-4">Students</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {programs.map((program) => (
                      <tr
                        key={program._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <span className="font-semibold text-slate-900">
                              {program.name ?? "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            {(program.csrPartnerId?.companyName ?? program.csrPartner?.companyName) ?? "—"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            {formatDate(program.duration?.startDate)} – {formatDate(program.duration?.endDate)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <School className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            {formatNumber(program.schoolsAssigned ?? program.schoolCount ?? 0)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            {formatNumber(program.metrics?.totalStudents ?? 0)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                              program.status
                            )}`}
                          >
                            {formatStatus(program.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/programs/${program._id}`)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {["draft", "approved"].includes(program.status) && (
                              <button
                                onClick={() => navigate(`/admin/programs/${program._id}/edit`)}
                                className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {program.status !== "completed" && (
                              <button
                                onClick={() => handleArchive(program)}
                                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Archive"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination.pages > 1 && (
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Page {pagination.page} of {pagination.pages} ({formatNumber(pagination.total)} total)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= pagination.pages}
                      className="px-4 py-2 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default AdminPrograms;
