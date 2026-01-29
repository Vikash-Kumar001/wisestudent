import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
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

const getTrendIcon = (trend) => {
  switch (trend) {
    case "increasing":
      return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    case "declining":
      return <TrendingDown className="w-5 h-5 text-rose-500" />;
    default:
      return <Minus className="w-5 h-5 text-slate-400" />;
  }
};

const CSREngagement = () => {
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

      const res = await csrProgramService.getEngagement(programs[0]._id);
      const payload = res?.data ?? res;

      if (payload) {
        setData(payload);
        if (showToast) toast.success("Engagement data refreshed");
      } else {
        setError("Failed to load engagement data");
      }
    } catch (err) {
      console.error("Failed to load engagement:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to load engagement data";
      setError(errorMessage);

      if (
        err?.response?.status === 404 ||
        errorMessage.toLowerCase().includes("no programs")
      ) {
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
          <span>Loading engagement data...</span>
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

  const participationPct = Math.min(
    100,
    Math.max(0, Number(data?.participationRate) || 0)
  );
  const trend = (data?.engagementTrend || "stable").toLowerCase();
  const weeklyTrend = Array.isArray(data?.weeklyTrend) ? data.weeklyTrend : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Engagement Metrics
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                Engagement & Participation
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Understand how students are participating in the program.
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
        <section className="grid gap-4 md:grid-cols-3">
          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Avg Sessions/Student
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatNumber(data?.averageSessionsPerStudent)}
              </p>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Participation Rate
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {participationPct}%
                </p>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${participationPct}%` }}
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div
              className={`p-3 rounded-xl ${
                trend === "increasing"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100"
                  : trend === "declining"
                  ? "bg-gradient-to-br from-rose-50 to-rose-100"
                  : "bg-gradient-to-br from-slate-50 to-slate-100"
              }`}
            >
              {getTrendIcon(trend)}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Engagement Trend
              </p>
              <p className="text-xl font-semibold text-slate-900 capitalize">
                {trend || "Stable"}
              </p>
            </div>
          </article>
        </section>

        {/* AUTO-GENERATED INSIGHT BOX */}
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Auto-Generated Insight
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                {data?.autoInsight ||
                  "Student engagement data is being collected and will be available soon."}
              </p>
            </div>
          </div>
        </section>

        {/* WEEKLY TREND CHART */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Weekly Engagement Trend
            </h2>
            <p className="text-xs text-slate-500">
              Sessions and participation over time
            </p>
          </div>

          <div className="h-80">
            {weeklyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="week"
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
                    formatter={(value) => [formatNumber(value)]}
                    labelFormatter={(label) => `Week: ${label}`}
                  />
                  <Bar
                    dataKey="sessions"
                    name="Sessions"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="participation"
                    name="Participation"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-center text-slate-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No weekly trend data yet</p>
                  <p className="text-xs mt-1">
                    Weekly sessions and participation will appear here as data is
                    collected.
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

export default CSREngagement;
