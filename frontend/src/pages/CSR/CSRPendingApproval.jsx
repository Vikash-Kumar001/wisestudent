import React from "react";
import { Clock, LogOut, RefreshCw, Mail, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthUtils";
import toast from "react-hot-toast";

const CSRPendingApproval = () => {
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center space-y-6 max-w-md w-full">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Approval Pending</h1>
            <p className="text-sm text-slate-500 mt-2">
              Your CSR account is being reviewed by our team.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-sm text-amber-700">
              This usually takes 1-2 business days. You will receive an email notification once your
              account is approved.
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
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                Pending Approval
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Check Status
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Support Link */}
          <p className="text-xs text-slate-400">
            Questions?{" "}
            <a href="mailto:support@wisestudent.com" className="text-indigo-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CSRPendingApproval;
