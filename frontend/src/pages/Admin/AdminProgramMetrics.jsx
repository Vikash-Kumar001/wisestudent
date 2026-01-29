import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  School,
  TrendingUp,
  BarChart3,
  Database,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const AdminProgramMetrics = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [program, setProgram] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [showRawData, setShowRawData] = useState(false);

  const fetchProgram = async () => {
    try {
      const res = await programAdminService.getProgram(programId);
      setProgram(res?.data);
    } catch (err) {
      console.error("Failed to fetch program:", err);
      toast.error("Failed to load program");
    }
  };

  const fetchMetrics = async () => {
    if (!refreshing) setLoading(true);
    try {
      const res = await programAdminService.getMetrics(programId);
      setMetrics(res?.data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      toast.error("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await programAdminService.refreshMetrics(programId);
      toast.success("Metrics refreshed");
      await fetchMetrics();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to refresh metrics");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchProgram();
      fetchMetrics();
    }
  }, [programId]);

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading metrics...</span>
        </div>
      </div>
    );
  }

  const data = metrics?.data || metrics;
  const studentReach = data?.studentReach || {};
  const engagement = data?.engagement || {};
  const recognition = data?.recognition || {};
  const schoolStats = data?.schoolStats || { totalSchools: 0, totalStudents: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/programs/${programId}`)}
              className="p-2 rounded-xl border-2 border-gray-100 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Super Admin</p>
              <p className="text-sm text-slate-600">{program?.name || "Program"}</p>
              <h1 className="text-2xl font-bold text-slate-900">Metrics Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawData((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Database className="w-4 h-4" />
              {showRawData ? "Hide raw data" : "View raw data"}
              {showRawData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Metrics"}
            </button>
          </div>
        </header>

        {data?.lastComputedAt && (
          <p className="text-xs text-slate-500">
            Last computed: {new Date(data.lastComputedAt).toLocaleString("en-IN")}
            {data.computedBy === "manual" && " (manual refresh)"}
          </p>
        )}

        <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Student Reach
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Total Onboarded</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(studentReach.totalOnboarded ?? schoolStats.totalStudents)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Active Students</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(studentReach.activeStudents)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Active %</p>
              <p className="text-xl font-bold text-slate-900">
                {studentReach.activePercentage != null ? `${studentReach.activePercentage}%` : "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Completion Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {studentReach.completionRate != null ? `${studentReach.completionRate}%` : "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Engagement
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Avg Sessions / Student</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(engagement.averageSessionsPerStudent) || "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Participation Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {engagement.participationRate != null ? `${engagement.participationRate}%` : "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400">Trend</p>
              <p className="text-lg font-semibold text-slate-900 capitalize">
                {engagement.engagementTrend || "-"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400">Auto Insight</p>
              <p className="text-sm text-slate-700 line-clamp-2">
                {engagement.autoInsight || "-"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <School className="w-5 h-5 text-teal-500" />
              Schools
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Schools in program</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(schoolStats.totalSchools)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Students covered</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(schoolStats.totalStudents)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Recognition
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Certificates issued</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(recognition.certificatesIssued)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Recognition kits</span>
                <span className="font-bold text-slate-900">
                  {formatNumber(recognition.recognitionKitsDispatched)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-600">Completion-based %</span>
                <span className="font-bold text-slate-900">
                  {recognition.completionBasedRecognition != null
                    ? `${recognition.completionBasedRecognition}%`
                    : "-"}
                </span>
              </div>
            </div>
          </section>
        </div>

        {showRawData && data && (
          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-500" />
              Raw metrics data
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Underlying data used for aggregated metrics. For debugging and audit.
            </p>
            <pre className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 overflow-x-auto max-h-96 overflow-y-auto font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminProgramMetrics;
