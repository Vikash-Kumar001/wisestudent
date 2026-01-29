import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Loader2, AlertCircle, Save } from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];

const SCHOOL_CATEGORIES = [
  { id: "government", label: "Government" },
  { id: "aided", label: "Government Aided" },
  { id: "low_income_private", label: "Low-income Private" },
];

const toDateInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const AdminProgramEdit = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    states: [],
    districts: [],
    schoolCategories: [],
    targetStudentCount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!programId) return;
      setFetchLoading(true);
      setFetchError(null);
      try {
        const res = await programAdminService.getProgram(programId);
        const p = res?.data ?? res;
        if (!p) {
          setFetchError("Program not found");
          return;
        }
        setProgram(p);
        const scope = p.scope || {};
        const geo = scope.geography || {};
        const states = Array.isArray(geo.states) ? geo.states : [];
        const districts = Array.isArray(geo.districts) ? geo.districts : [];
        const schoolCategory = scope.schoolCategory ?? scope.schoolCategories ?? [];
        const categories = Array.isArray(schoolCategory) ? schoolCategory : [];
        const duration = p.duration || {};
        setForm({
          name: p.name ?? "",
          description: p.description ?? "",
          states,
          districts,
          schoolCategories: categories,
          targetStudentCount: scope.targetStudentCount != null ? String(scope.targetStudentCount) : "",
          startDate: toDateInput(duration.startDate),
          endDate: toDateInput(duration.endDate),
        });
      } catch (err) {
        console.error("Failed to load program:", err);
        setFetchError(err?.response?.data?.message || "Failed to load program");
        toast.error("Failed to load program");
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [programId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const toggleState = (state) => {
    setForm((prev) => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter((s) => s !== state)
        : [...prev.states, state],
    }));
    if (errors.states) setErrors((prev) => ({ ...prev, states: null }));
  };

  const toggleCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      schoolCategories: prev.schoolCategories.includes(categoryId)
        ? prev.schoolCategories.filter((c) => c !== categoryId)
        : [...prev.schoolCategories, categoryId],
    }));
    if (errors.schoolCategories) setErrors((prev) => ({ ...prev, schoolCategories: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Program name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.states.length === 0) newErrors.states = "Select at least one state";
    if (form.schoolCategories.length === 0) newErrors.schoolCategories = "Select at least one school category";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    setLoading(true);
    try {
      await programAdminService.updateProgram(programId, {
        name: form.name.trim(),
        description: form.description.trim(),
        scope: {
          geography: { states: form.states, districts: form.districts },
          schoolCategory: form.schoolCategories,
          targetStudentCount: form.targetStudentCount ? parseInt(form.targetStudentCount, 10) : 0,
        },
        duration: { startDate: form.startDate, endDate: form.endDate },
      });
      toast.success("Program updated successfully");
      navigate(`/admin/programs/${programId}`);
    } catch (err) {
      console.error("Failed to update program:", err);
      toast.error(err?.response?.data?.message || "Failed to update program");
      if (err?.response?.data?.errors && typeof err.response.data.errors === "object") {
        setErrors((prev) => ({ ...prev, ...err.response.data.errors }));
      }
    } finally {
      setLoading(false);
    }
  };

  const canEdit = program && ["draft", "approved"].includes(program.status);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="font-medium">Loading program...</span>
        </div>
      </div>
    );
  }

  if (fetchError || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Unable to load program</h2>
          <p className="text-sm text-slate-600 mb-6">{fetchError || "Program not found"}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/admin/programs")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Program cannot be edited</h2>
          <p className="text-sm text-slate-600 mb-6">
            Only draft or approved programs can be edited. This program is {program.status?.replace(/_/g, " ")}.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/admin/programs/${programId}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" />
              View Program
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const partnerName =
    program.csrPartnerId?.companyName ?? (typeof program.csrPartnerId === "string" ? "—" : "—");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-7 h-7 text-indigo-600" />
                Edit Program
              </h1>
              <p className="text-sm text-slate-600 mt-1">Modify program scope, duration, and details.</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">CSR Partner</h2>
            <div className="rounded-xl border-2 border-gray-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
              {partnerName} (cannot be changed)
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">Program Information</h2>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Program Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Program name"
                className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                maxLength={500}
                className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.description ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                }`}
              />
              <p className="mt-1 text-xs text-slate-400">{form.description.length}/500</p>
              {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">Scope</h2>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                States <span className="text-rose-500">*</span>
              </label>
              <div className="mt-3 flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-100 rounded-xl bg-slate-50/50">
                {INDIAN_STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleState(state)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      form.states.includes(state)
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
              {errors.states && <p className="mt-1 text-xs text-rose-500">{errors.states}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">Districts (optional)</label>
              <input
                type="text"
                value={form.districts.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "districts",
                    e.target.value.split(",").map((d) => d.trim()).filter(Boolean)
                  )
                }
                placeholder="Districts separated by commas"
                className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                School Categories <span className="text-rose-500">*</span>
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
                {SCHOOL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      form.schoolCategories.includes(cat.id)
                        ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                        : "bg-slate-50 text-slate-600 border-2 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {errors.schoolCategories && <p className="mt-1 text-xs text-rose-500">{errors.schoolCategories}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">Target Student Count (optional)</label>
              <input
                type="number"
                value={form.targetStudentCount}
                onChange={(e) => handleChange("targetStudentCount", e.target.value)}
                min="0"
                className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">Duration</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.startDate ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-xs text-rose-500">{errors.startDate}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.endDate ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-xs text-rose-500">{errors.endDate}</p>}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              type="button"
              onClick={() => navigate(`/admin/programs/${programId}`)}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.section>
        </form>
      </div>
    </div>
  );
};

export default AdminProgramEdit;
