import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Star,
  Clock,
  TrendingUp,
  UserPlus,
  Trash2,
  Medal,
  Activity,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useDashboard } from "../context/DashboardContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function TeamPerformance() {
  const navigate = useNavigate();
  const { performersList } = useDashboard();
  const { currentUser, addSalesPerson, deleteSalesPerson } = useAuth();

  const isManager = currentUser && currentUser.role === "Sales Manager";

  // State controls for Creation Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [createError, setCreateError] = useState("");

  // State controls for Deletion confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!newName.trim() || !newEmail.trim()) {
      setCreateError("All fields are required.");
      return;
    }

    try {
      await addSalesPerson(newName.trim(), newEmail.trim());
      setNewName("");
      setNewEmail("");
      setCreateOpen(false);
    } catch (err) {
      setCreateError(err.message || "Failed to add representative.");
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteError("");
    if (!deleteTarget) return;

    try {
      await deleteSalesPerson(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || "Could not delete this representative.");
    }
  };

  if (!isManager) {
    return (
      <div className="p-4 md:p-6 mt-6 max-w-2xl mx-auto text-center">
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-red-500 mb-3">
            Access Restricted
          </h2>
          <p className="text-brand-primary/70 mb-6 leading-relaxed">
            The Team Sales Performance Reports dashboard is restricted to Sales
            Managers only. Please contact your administrator if you believe this
            is in error.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-2.5 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Upper description header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight mb-1">
            Team Sales Performance Reports
          </h1>
          <p className="text-sm text-brand-primary/70">
            Track conversion weights, response times, follow-up index
            completions, and converted leads per representative.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateError("");
            setCreateOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm"
        >
          <UserPlus size={18} />
          Add Sales Representative
        </button>
      </div>

      {/* Podiums / Top Performer visual row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performersList.map((p, index) => {
          const initials = p.name
            .split(" ")
            .map((w) => w[0])
            .join("");
          const isTop = index === 0;
          const isSecond = index === 1;

          return (
            <div
              key={p.name}
              className={`relative bg-brand-light rounded-2xl overflow-hidden shadow-sm transition-transform hover:-translate-y-1 ${
                isTop
                  ? "border-2 border-amber-500 shadow-[0_4px_20px_-2px_rgba(245,158,11,0.3)]"
                  : "border border-brand-secondary"
              }`}
            >
              {isTop && (
                <div className="absolute top-3 right-3 text-amber-500">
                  <Trophy size={28} />
                </div>
              )}

              <div className="p-6 text-center">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-brand-primary font-bold text-xl mb-4 shadow-sm ${
                    isTop
                      ? "bg-amber-500"
                      : isSecond
                        ? "bg-brand-secondary/50"
                        : p.assigned === 0
                          ? "bg-brand-secondary/30"
                          : "bg-orange-800"
                  }`}
                >
                  {initials}
                </div>

                <h3 className="text-lg font-bold text-brand-primary leading-tight">
                  {p.name}
                </h3>
                <span className="text-xs text-brand-primary/70 block mb-4">
                  Rank #{index + 1} • {p.assigned} Leeds Managed
                </span>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold mb-6 ${
                    isTop
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-brand-secondary/30 text-brand-primary border border-brand-secondary"
                  }`}
                >
                  <Activity size={14} />
                  Score: {p.activityScore} / 100
                </div>

                <div className="grid grid-cols-2 gap-2 text-left mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-primary/70 block mb-0.5">
                      Conversion
                    </span>
                    <span className="text-sm font-black text-brand-primary">
                      {p.conversionRate}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-brand-primary/70 mb-1.5 uppercase">
                    <span>Follow-up</span>
                    <span
                      className={isTop ? "text-amber-500" : "text-teal-500"}
                    >
                      {p.fwCompletionRate}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-secondary/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isTop ? "bg-amber-500" : "bg-teal-500"}`}
                      style={{ width: `${p.fwCompletionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-brand-light border border-brand-secondary rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-brand-light border-b border-brand-secondary">
            <tr>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Ranking
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Representative Name
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Leads Assigned
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Leads Won
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Conversion rate %
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Follow-up %
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Avg Response Time
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Activity Rating
              </th>
              <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-secondary">
            {performersList.map((p, index) => (
              <tr
                key={p.name}
                className="hover:bg-brand-light/50 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <Medal
                      className={`${index === 0 ? "text-amber-500" : index === 1 ? "text-brand-primary/70" : "text-amber-700"}`}
                      size={18}
                    />
                    <span className="font-bold text-brand-primary">
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-brand-primary">
                  {p.name}
                </td>
                <td className="py-3 px-4 text-brand-primary">{p.assigned}</td>
                <td className="py-3 px-4 text-brand-primary">{p.won}</td>
                <td className="py-3 px-4">
                  <span className="font-bold text-teal-500">
                    {p.conversionRate}%
                  </span>
                </td>
                <td className="py-3 px-4 text-brand-primary">
                  {p.fwCompletionRate}%
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-brand-primary/70 text-sm">
                    <Clock size={14} />
                    <span>{p.responseTime}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={
                          star <= Math.round(p.activityScore / 20)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= Math.round(p.activityScore / 20)
                            ? "text-amber-500"
                            : "text-brand-primary/70"
                        }
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/salesperson/${encodeURIComponent(p.name)}`)
                      }
                      className="p-1.5 text-brand-primary/70 hover:text-teal-500 hover:bg-teal-500/10 rounded-lg transition-colors"
                      title="View Representative Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError("");
                        setDeleteTarget(p);
                      }}
                      disabled={
                        p.name?.toLowerCase() ===
                          currentUser?.name?.toLowerCase() ||
                        p.id === currentUser?.id
                      }
                      title={
                        p.name?.toLowerCase() ===
                        currentUser?.name?.toLowerCase()
                          ? "Cannot delete self"
                          : "Delete representative"
                      }
                      className="p-1.5 text-brand-primary/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brand-primary/70"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creation Dialog */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-light/60 backdrop-blur-sm">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-brand-secondary">
              <h3 className="font-bold text-brand-primary text-lg">
                Add New Sales Representative
              </h3>
            </div>

            <form
              id="create-form"
              onSubmit={handleCreateSubmit}
              className="p-5 space-y-4"
            >
              {createError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm">
                  {createError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  Representative Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  System/Inbox Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. rachel@petsfolio.com"
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  required
                />
              </div>
            </form>

            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
              >
                Register Representative
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-light/60 backdrop-blur-sm">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-brand-secondary">
              <h3 className="font-bold text-brand-primary text-lg">
                Delete Representative Confirmation
              </h3>
            </div>

            <div className="p-5">
              {deleteError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm mb-4">
                  {deleteError}
                </div>
              )}
              <p className="text-sm text-brand-primary leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-brand-primary">
                  {deleteTarget?.name}
                </strong>{" "}
                from Petsfolio Workspace? This will remove their profile from
                the dynamic leaderboards and team allocations.
              </p>
            </div>

            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
