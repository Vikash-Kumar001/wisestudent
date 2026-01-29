import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  CheckCircle,
  UserX,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import csrProgramService from "../../services/csr/programService";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const CSRStudentReach = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async (showToast = false) => {
    if (!refreshing) setLoading(true);
    setRefreshing(true);
    setError("");
    try {
      const programsRes = await csrProgramService.getMyPrograms();
      const programs = programsRes?.data || [];

      if (programs.length === 0) {
        navigate("/csr/no-program", { replace: true });
        return;
      }

      const res = await csrProgramService.getStudentReach(programs[0]._id);
      const payload = res?.data ?? res;

      if (payload) {
        setData(payload);
        if (showToast) toast.success("Student reach data refreshed");
      } else {
        setError("Failed to load student reach data");
      }
    } catch (err) {
      console.error("Failed to load student reach:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to load student reach data";
      setError(errorMessage);

      if (err?.response?.status === 404 || errorMessage.toLowerCase().includes("no programs")) {
        navigate("/csr/no-program", { replace: true });
        return;
      }

      if (showToast) toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => fetchData(true);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading student reach data...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">{error}</h2>
            <p className="text-sm text-amber-700 mb-4">
              Please try again or contact support if the issue persists.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={() => navigate("/csr/profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activePct = Math.min(100, Math.max(0, Number(data?.activePercentage) || 0));
  const completionPct = Math.min(100, Math.max(0, Number(data?.completionRate) || 0));
  const dropoffPct = Math.min(100, Math.max(0, Number(data?.dropoffRate) || 0));
  const timeline = Array.isArray(data?.timeline) ? data.timeline : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Student Metrics
              </p>
              <h1 className="text-3xl font-bold text-slate-900">Student Reach</h1>
              <p className="text-sm text-slate-500 mt-1">
                Track onboarded students, activity, and completion across your program.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* METRIC CARDS */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total Onboarded
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatNumber(data?.totalOnboarded)}
              </p>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
                <UserCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Active Students
                </p>
                <p className="text-2xl font-semibold text-slate-900">{activePct}%</p>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Completion Rate
                </p>
                <p className="text-2xl font-semibold text-slate-900">{completionPct}%</p>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100">
              <UserX className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Drop-off Rate
              </p>
              <p className="text-2xl font-semibold text-slate-900">{dropoffPct}%</p>
            </div>
          </article>
        </section>

        {/* TIMELINE CHART */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Students Onboarded Over Time
            </h2>
            <p className="text-xs text-slate-500">Monthly onboarding trend</p>
          </div>

          <div className="h-80">
            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => [formatNumber(value), "Onboarded"]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Onboarded"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-center text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No timeline data yet</p>
                  <p className="text-xs mt-1">
                    Onboarding trends will appear here as students join the program.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {refreshing && data && (
          <div className="fixed bottom-4 right-4 bg-white rounded-xl border border-slate-200 px-4 py-2 shadow-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span className="text-xs text-slate-600">Refreshing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRStudentReach;
