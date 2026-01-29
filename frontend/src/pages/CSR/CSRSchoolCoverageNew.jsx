import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  School,
  Users,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import csrProgramService from "../../services/csr/programService";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const getStatusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "in_progress":
      return "bg-amber-100 text-amber-700";
    case "pending":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const formatStatus = (status) => {
  if (!status) return "—";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CSRSchoolCoverageNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [page, setPage] = useState(1);

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

      const res = await csrProgramService.getSchoolCoverage(programs[0]._id, {
        district: districtFilter || undefined,
        page,
        limit: 50,
      });
      const payload = res?.data ?? res;

      if (payload) {
        setData(payload);
        if (showToast) toast.success("School coverage data refreshed");
      } else {
        setError("Failed to load school coverage data");
      }
    } catch (err) {
      console.error("Failed to load school coverage:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to load school coverage data";
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
  }, [districtFilter, page]);

  const handleRefresh = () => {
    setPage(1);
    fetchData(true);
  };

  const districts = useMemo(() => {
    if (!data?.schools || !Array.isArray(data.schools)) return [];
    const unique = [
      ...new Set(
        data.schools.map((s) => s.district).filter((d) => d != null && d !== "")
      ),
    ];
    return unique.sort();
  }, [data?.schools]);

  const schools = Array.isArray(data?.schools) ? data.schools : [];
  const pagination = data?.pagination || {};
  const totalSchools = data?.totalSchools ?? 0;
  const totalStudents = data?.totalStudents ?? 0;

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading school coverage data...</span>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Program Coverage
              </p>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                School Coverage
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                  <School className="w-4 h-4" />
                  {formatNumber(totalSchools)}
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Schools and students covered by your program.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="">All Districts</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* SUMMARY STATS */}
        <section className="grid gap-4 md:grid-cols-2">
          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
              <School className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total Schools
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatNumber(totalSchools)}
              </p>
            </div>
          </article>
          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total Students
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatNumber(totalStudents)}
              </p>
            </div>
          </article>
        </section>

        {/* SCHOOL TABLE */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">District / City</th>
                  <th className="px-4 py-3">Students Covered</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schools.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <MapPin className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        No schools found
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {districtFilter
                          ? "Try changing the district filter or refresh."
                          : "Schools will appear here once they are added to your program."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  schools.map((school, index) => (
                    <tr
                      key={`${school.schoolName}-${school.district ?? ""}-${index}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="font-semibold text-slate-900">
                            {school.schoolName ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {[school.district, school.state]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>
                      <td className="px-4 py-4 font-semibold text-emerald-600">
                        {formatNumber(school.studentsCovered)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            school.status
                          )}`}
                        >
                          {formatStatus(school.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Page {pagination.page ?? 1} of {pagination.pages ?? 1}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (pagination.pages ?? 1)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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

export default CSRSchoolCoverageNew;
