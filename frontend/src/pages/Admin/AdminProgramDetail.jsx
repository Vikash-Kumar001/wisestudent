import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Users,
  School,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

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
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-600";
    case "approved":
      return "bg-blue-100 text-blue-700";
    case "implementation_in_progress":
      return "bg-amber-100 text-amber-700";
    case "mid_program_review_completed":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const getCheckpointStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "acknowledged":
      return "bg-amber-500";
    case "ready":
      return "bg-blue-500";
    default:
      return "bg-slate-300";
  }
};

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CHECKPOINT_NAMES = {
  1: "Program Approval",
  2: "Onboarding Confirmation",
  3: "Mid-Program Review",
  4: "Completion Review",
  5: "Extension/Renewal",
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "schools", label: "Schools" },
  { id: "checkpoints", label: "Checkpoints" },
];

const AdminProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [schools, setSchools] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const res = await programAdminService.getProgram(programId);
      setProgram(res?.data);
    } catch (err) {
      console.error("Failed to fetch program:", err);
      toast.error("Failed to load program");
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckpoints = async () => {
    try {
      const res = await programAdminService.getCheckpoints(programId);
      setCheckpoints(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch checkpoints:", err);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await programAdminService.getAssignedSchools(programId);
      setSchools(res?.data?.schools || []);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchProgram();
      fetchCheckpoints();
      fetchSchools();
    }
  }, [programId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading program...</span>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500">Program not found</p>
          <button
            onClick={() => navigate("/admin/programs")}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/programs")}
              className="p-2 rounded-xl border-2 border-gray-100 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Super Admin</p>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {program.name}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(program.status)}`}>
                  {formatStatus(program.status)}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/admin/programs/${programId}/metrics`)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Metrics
            </button>
            <button
              onClick={() => navigate(`/admin/programs/${programId}/reports`)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Reports
            </button>
            {["draft", "approved"].includes(program.status) && (
              <button
                onClick={() => navigate(`/admin/programs/${programId}/edit`)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Program
              </button>
            )}
          </div>
        </header>

        {/* TABS */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Program Info */}
            <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Program Information</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-xs text-slate-400">CSR Partner</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {program.csrPartner?.companyName || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="text-sm text-slate-700 mt-1">
                    {program.description || "No description"}
                  </p>
                </div>
              </div>
            </section>

            {/* Scope */}
            <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Scope</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Geography</p>
                    <p className="text-sm text-slate-700">
                      {program.scope?.geography?.states?.join(", ") || "All India"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">School Categories</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {program.scope?.schoolCategories?.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                      >
                        {cat}
                      </span>
                    )) || <span className="text-sm text-slate-500">All categories</span>}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Target Students</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatNumber(program.scope?.targetStudentCount) || "Not set"}
                  </p>
                </div>
              </div>
            </section>

            {/* Duration */}
            <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Duration</h2>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-slate-700">
                    {formatDate(program.duration?.startDate)} –{" "}
                    {formatDate(program.duration?.endDate)}
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Metrics */}
            <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Metrics</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <School className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-xs text-slate-400">Schools</p>
                    <p className="text-lg font-bold text-slate-900">{schools.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-slate-400">Students</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatNumber(program.metrics?.totalStudents || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "schools" && (
          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Assigned Schools</h2>
              <button
                onClick={() => navigate(`/admin/programs/${programId}/schools`)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
              >
                Manage Schools
              </button>
            </div>

            {schools.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <School className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No schools assigned yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <th className="px-4 py-3">School</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Students</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schools.slice(0, 10).map((school, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {school.schoolName || school.school?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {school.district || school.school?.district || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatNumber(school.studentsCovered)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {school.implementationStatus || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {schools.length > 10 && (
              <div className="p-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => navigate(`/admin/programs/${programId}/schools`)}
                  className="text-indigo-600 text-sm font-semibold hover:underline"
                >
                  View all {schools.length} schools
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "checkpoints" && (
          <section className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Program Checkpoints</h2>
              <button
                onClick={() => navigate(`/admin/programs/${programId}/checkpoints`)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
              >
                Manage Checkpoints
              </button>
            </div>

            {checkpoints.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No checkpoints triggered yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {checkpoints.slice(0, 5).map((checkpoint) => (
                  <div
                    key={checkpoint.checkpointNumber}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getCheckpointStatusColor(
                          checkpoint.status
                        )}`}
                      >
                        {checkpoint.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {checkpoint.checkpointNumber}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {CHECKPOINT_NAMES[checkpoint.checkpointNumber]}
                        </p>
                        <p className="text-xs text-slate-500">
                          {checkpoint.triggeredAt && `Triggered: ${formatDate(checkpoint.triggeredAt)}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        checkpoint.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : checkpoint.status === "acknowledged"
                          ? "bg-amber-100 text-amber-700"
                          : checkpoint.status === "ready"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {checkpoint.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 border-t border-slate-100 text-center">
              <button
                onClick={() => navigate(`/admin/programs/${programId}/checkpoints`)}
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                View all checkpoints
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminProgramDetail;
