import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Target,
  TrendingUp,
  Minus,
  TrendingDown,
  DollarSign,
  Brain,
  Heart,
  BookOpen,
  Monitor,
  Scale,
  Cpu,
  Users,
  GraduationCap,
  Globe,
  Leaf,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import csrProgramService from "../../services/csr/programService";

const pillarIcons = {
  financialLiteracy: DollarSign,
  brainHealth: Brain,
  uvls: BookOpen,
  dcos: Monitor,
  moralValues: Scale,
  aiForAll: Cpu,
  healthMale: Users,
  healthFemale: Heart,
  entrepreneurshipHigherEd: GraduationCap,
  civicResponsibility: Globe,
  sustainability: Leaf,
};

const getLevelColor = (level) => {
  switch ((level || "").toLowerCase()) {
    case "high":
      return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" };
    case "medium":
      return { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" };
    case "low":
      return { bg: "bg-slate-100", text: "text-slate-600", bar: "bg-slate-400" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-500", bar: "bg-slate-200" };
  }
};

const getTrendIcon = (trend) => {
  switch ((trend || "stable").toLowerCase()) {
    case "increasing":
      return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case "declining":
      return <TrendingDown className="w-4 h-4 text-rose-500" />;
    default:
      return <Minus className="w-4 h-4 text-slate-400" />;
  }
};

const getLevelIconBg = (level) => {
  switch ((level || "").toLowerCase()) {
    case "high":
      return "bg-emerald-100 text-emerald-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-400";
  }
};

const PillarRow = ({ pillar, isLast }) => {
  const hasData = pillar?.hasData === true && pillar?.level != null;
  const level = (pillar?.level || "").toLowerCase();
  const colors = getLevelColor(hasData ? level : "");
  const levelWidth =
    level === "high" ? "100%" : level === "medium" ? "66%" : level === "low" ? "33%" : "0%";
  const Icon = pillarIcons[pillar?.id] || Target;
  const iconBg = getLevelIconBg(hasData ? level : "");

  return (
    <div
      className={`flex flex-col gap-3 py-4 ${!isLast ? "border-b border-slate-100" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">
            {pillar?.name || pillar?.id || "—"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Exposure level</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasData && getTrendIcon(pillar?.trend)}
          <span
            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}
          >
            {hasData ? level : "No data"}
          </span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
          style={{ width: levelWidth }}
        />
      </div>
    </div>
  );
};

const DEFAULT_DISCLAIMER =
  "Indicators reflect exposure trends only. They do not represent assessment, diagnosis, or scoring. These metrics show what topics students were exposed to, not their abilities or performance.";

const CSRReadinessExposure = () => {
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

      const res = await csrProgramService.getReadinessExposure(programs[0]._id);
      const payload = res?.data ?? res;

      if (payload) {
        setData(payload);
        if (showToast) toast.success("Readiness exposure data refreshed");
      } else {
        setError("Failed to load readiness exposure data");
      }
    } catch (err) {
      console.error("Failed to load readiness exposure:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to load readiness exposure data";
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

  const pillars = Array.isArray(data?.pillars) ? data.pillars : [];
  const levelCounts = useMemo(() => {
    const high = pillars.filter((p) => (p?.level || "").toLowerCase() === "high").length;
    const medium = pillars.filter((p) => (p?.level || "").toLowerCase() === "medium").length;
    const low = pillars.filter((p) => (p?.level || "").toLowerCase() === "low").length;
    const withData = pillars.filter((p) => p?.hasData === true && p?.level != null).length;
    return { high, medium, low, withData, total: pillars.length };
  }, [pillars]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading readiness exposure data...</span>
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

  const disclaimer = data?.disclaimer || DEFAULT_DISCLAIMER;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Exposure Metrics
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Target className="w-7 h-7 text-indigo-600" />
                Readiness Exposure
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Exposure students received across readiness pillars.
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

        {/* SUMMARY STRIP */}
        {pillars.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">Exposure summary</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {levelCounts.high} High
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {levelCounts.medium} Medium
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  {levelCounts.low} Low
                </span>
                <span className="text-xs text-slate-500 pl-1">
                  {levelCounts.withData} of {levelCounts.total} pillars with data
                </span>
              </div>
            </div>
          </section>
        )}

        {/* DISCLAIMER */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                Disclaimer
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{disclaimer}</p>
            </div>
          </div>
        </section>

        {/* PILLARS GRID */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-6 rounded-full bg-indigo-500" />
            <Target className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Exposure by pillar</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {pillars.length > 0 ? (
              <div className="px-5">
                {pillars.map((pillar, index) => (
                  <PillarRow
                    key={pillar?.id ?? pillar?.name ?? `pillar-${index}`}
                    pillar={pillar}
                    isLast={index === pillars.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No exposure data yet</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Pillar exposure levels will appear here as program data is collected.
                </p>
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

export default CSRReadinessExposure;
