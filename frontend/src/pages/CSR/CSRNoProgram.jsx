import React from "react";
import { CheckCircle, User, LogOut, Building2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthUtils";
import toast from "react-hot-toast";

const CSRNoProgram = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center space-y-6 max-w-md w-full">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome to WiseStudent CSR Portal</h1>
            <p className="text-sm text-slate-500 mt-2">Your account has been approved!</p>
          </div>

          {/* Info Box */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="text-sm text-emerald-700">
              No programs have been assigned yet. Once a program is created for your organization,
              you will be able to view and monitor it here.
            </p>
          </div>

          {/* Company Info */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Company</p>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.organization || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm font-semibold text-slate-900">{user?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-400">Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Approved
              </span>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-left">
            <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">
              What happens next?
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our team will set up your CSR program</li>
              <li>• You'll receive a notification once it's ready</li>
              <li>• You can then view schools, metrics, and reports</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/csr/profile")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md"
            >
              <User className="w-4 h-4" />
              View Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Support Link */}
          <p className="text-xs text-slate-400">
            Questions about your program?{" "}
            <a href="mailto:support@wisestudent.com" className="text-indigo-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CSRNoProgram;
