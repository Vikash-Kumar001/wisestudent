import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, School, Users } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import csrSchoolService from "../../services/csrSchoolService";

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value);

const CSRSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const { socket } = useSocket();

  const normalizedSearchPattern = useMemo(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return null;
    const escaped = trimmed
      .split("")
      .map((char) => (/[\\^$*+?.()|[\]{}]/.test(char) ? `\\${char}` : char))
      .join("");
    return escaped
      .split("")
      .map((char) => `${char}\\s*`)
      .join("");
  }, [searchTerm]);

  const highlightText = (value) => {
    if (typeof value !== "string") return value;
    if (!value || !normalizedSearchPattern) return value;
    const regex = new RegExp(normalizedSearchPattern, "gi");
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(value)) !== null) {
      parts.push(value.slice(lastIndex, match.index));
      parts.push(
        <mark
          key={`${match.index}-${match[0]}`}
          className="bg-yellow-200 px-0.5 text-yellow-800 rounded"
        >
          {match[0]}
        </mark>
      );
      lastIndex = match.index + match[0].length;

      if (regex.lastIndex === match.index) {
        regex.lastIndex += 1;
      }
    }

    parts.push(value.slice(lastIndex));
    return parts;
  };

  const fetchSchools = useCallback(async (searchValue = "") => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchValue.trim()) params.search = searchValue.trim();
      const response = await csrSchoolService.getSchools(params);
      setSchools(response?.data?.schools || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError(err.response?.data?.message || err.message || "Failed to load schools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools("");
  }, [fetchSchools]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSchools(searchTerm);
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchTerm, fetchSchools]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSchools();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchSchools]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleBroadcast = () => {
      fetchSchools();
    };

    socket.on("csr-overview-broadcast", handleBroadcast);
    return () => {
      socket.off("csr-overview-broadcast", handleBroadcast);
    };
  }, [socket, fetchSchools]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchSchools(searchTerm);
  };

  const tableRows = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-6 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading schools...
            </span>
          </td>
        </tr>
      );
    }

    if (!schools.length) {
      return (
        <tr>
          <td colSpan={5} className="text-sm text-gray-500 text-center py-6">
            No schools matched your filters. Try expanding your search.
          </td>
        </tr>
      );
    }

        return schools.map((school) => (
          <tr key={school.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-4">
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-500" />
                {highlightText(school.name)}
              </div>
              <p className="text-xs text-slate-400 mt-1 tracking-wide normal-case">
                {highlightText(school.relationshipStatus || "Relationship details updating")}
              </p>
            </td>
            <td className="px-4 py-4 text-sm text-slate-600">{highlightText(school.address)}</td>
            <td className="px-4 py-4 text-sm font-semibold text-emerald-600">
              {formatNumber(school.totalStudents || 0)}
            </td>
            <td className="px-4 py-4 text-sm font-semibold text-sky-600">
              {formatNumber(school.totalTeachers || 0)}
            </td>
            <td className="px-4 py-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  school.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {school.isActive ? "Active" : "Inactive"}
              </span>
            </td>
          </tr>
        ));
  }, [loading, schools]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">CSR Directory</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              Schools
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                <Users className="w-3 h-3" />
                {schools.length}
              </span>
            </h1>
            {lastUpdated && (
              <p className="text-xs text-slate-500 mt-1">
                Last refreshed at {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full lg:max-w-md flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="search"
              aria-label="Search schools"
              placeholder="Search by school name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-sm text-slate-700 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xs font-semibold shadow-md hover:opacity-95 transition"
            >
              Search
            </button>
          </form>
        </header>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {error ? (
                <span className="text-red-600 font-semibold">{error}</span>
              ) : (
                "Listing all schools onboarded to WiseStudent."
              )}
            </p>
            <button
              type="button"
              onClick={fetchSchools}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white shadow-sm hover:shadow-md transition disabled:opacity-60"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-slate-500 uppercase">
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Total Students</th>
                  <th className="px-4 py-3">Total Teachers</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">{tableRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRSchools;
