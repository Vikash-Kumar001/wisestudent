import React from "react";
import { XCircle, LogOut, Mail, Building2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthUtils";
import toast from "react-hot-toast";

const CSRRejected = () => {
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
  };

  // Get rejection reason from user data if available
  const rejectionReason = user?.rejectionReason || "No specific reason provided.";
  const rejectedAt = user?.rejectedAt
    ? new Date(user.rejectedAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center space-y-6 max-w-md w-full">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-rose-600" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Application Not Approved</h1>
            <p className="text-sm text-slate-500 mt-2">
              Unfortunately, your CSR partnership request was not approved.
            </p>
          </div>

          {/* Rejection Reason */}
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-rose-600 font-semibold">
                  Reason
                </p>
                <p className="text-sm text-rose-800 mt-1">{rejectionReason}</p>
              </div>
            </div>
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
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                Rejected
              </span>
            </div>
            {rejectedAt && (
              <p className="text-xs text-slate-400 text-right">Rejected on: {rejectedAt}</p>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-left">
            <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">
              What can you do?
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Contact our support team for clarification</li>
              <li>• Address the concerns mentioned above</li>
              <li>• Re-apply with updated information</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:support@wisestudent.com?subject=CSR Application Rejection Query"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRRejected;
