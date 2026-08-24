import React, { useState, useEffect } from "react";
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
  Plus,
  Edit2,
  X,
  Target,
  LayoutTemplate,
  Users,
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
import { useTargets } from "../context/TargetsContext.jsx";

// ─── Fixed tier labels (visual only — no values stored in template) ──────────
const TIER_LABELS = [
  {
    key: "baseline",
    label: "Min Expected",
    badge: "Baseline",
    badgeBg: "bg-orange-500/10 text-orange-600 border border-orange-400/30",
  },
  {
    key: "target",
    label: "Performance",
    badge: "Target",
    badgeBg: "bg-emerald-500/10 text-emerald-600 border border-emerald-400/30",
  },
  {
    key: "star",
    label: "Out Performance",
    badge: "Star",
    badgeBg: "bg-indigo-500/10 text-indigo-600 border border-indigo-400/30",
  },
];

const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

// ─── Template Card ─────────────────────────────────────────────────────────
function TemplateCard({ template, onEdit, onDelete }) {
  return (
    <div className="bg-brand-light border border-brand-secondary rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-base font-bold text-brand-primary">
          {template.categoryName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-brand-secondary text-brand-primary/70 bg-brand-secondary/20">
            {template.type}
          </span>
          <button
            onClick={() => onEdit(template)}
            className="p-1 text-brand-primary/50 hover:text-teal-500 hover:bg-teal-500/10 rounded transition-colors"
            title="Edit template"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(template)}
            className="p-1 text-brand-primary/50 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
            title="Delete template"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {template.description && (
        <p className="text-xs text-brand-primary/50 mb-4">
          {template.description}
        </p>
      )}

      {/* 3 tier badges — visual labels only, no numeric values */}
      <div className="flex flex-wrap gap-2 mt-3">
        {TIER_LABELS.map((t) => (
          <span
            key={t.key}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.badgeBg}`}
          >
            {t.badge}
          </span>
        ))}
        <span className="text-[11px] text-brand-primary/40 italic self-center">
          All tiers included · Target calls set per employee
        </span>
      </div>
    </div>
  );
}

export default function TeamPerformance() {
  const navigate = useNavigate();
  const { performersList } = useDashboard();
  const { currentUser, addSalesPerson, deleteSalesPerson, allUsers } = useAuth();
  const {
    templates,
    repAssignments,
    loading: targetsLoading,
    fetchTemplates,
    fetchAssignments,
    saveTemplate,
    deleteTemplate,
    assignTemplate,
    getRepAssignment,
    getTemplateForAssignment,
  } = useTargets();

  const isManager = currentUser && currentUser.role === "Sales Manager";

  // ── Page tabs ──────────────────────────────────────────────────────────────
  const [pageTab, setPageTab] = useState("performance"); // "performance" | "templates"

  // ── Sales Rep creation ────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("General Services");
  const [createError, setCreateError] = useState("");

  // ── Rep deletion ───────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // ── Template modal state ───────────────────────────────────────────────────
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [tplForm, setTplForm] = useState({
    categoryName: "",
    type: "Core Service",
    description: "",
  });
  const [tplError, setTplError] = useState("");
  const [tplSaving, setTplSaving] = useState(false);

  // ── Assign modal state ─────────────────────────────────────────────────────
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRep, setAssignRep] = useState(null);
  const [assignTemplateId, setAssignTemplateId] = useState("");
  const [assignTiers, setAssignTiers] = useState({
    baseline: { callsPerDay: "", conversionPct: "", expectedConversionPct: "", monthlyClosings: "", expectedClosures: "" },
    target: { callsPerDay: "", conversionPct: "", expectedConversionPct: "", monthlyClosings: "", expectedClosures: "" },
    star: { callsPerDay: "", conversionPct: "", expectedConversionPct: "", monthlyClosings: "", expectedClosures: "" },
  });
  const [assignMonth, setAssignMonth] = useState(currentMonth);
  const [assignError, setAssignError] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  // ── Delete template confirm ────────────────────────────────────────────────
  const [deleteTplTarget, setDeleteTplTarget] = useState(null);

  // Load templates & assignments on mount (manager only)
  useEffect(() => {
    if (isManager) {
      fetchTemplates();
      fetchAssignments();
    }
  }, [isManager]);

  // ─── Sales rep handlers ────────────────────────────────────────────────────

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (
      !newName.trim() ||
      !newEmail.trim() ||
      !newPassword ||
      !confirmPassword
    ) {
      setCreateError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setCreateError("Passwords do not match.");
      return;
    }

    try {
      await addSalesPerson(newName.trim(), newEmail.trim(), newPassword, newSpecialization);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setNewSpecialization("General Services");
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

  // ─── Template modal handlers ───────────────────────────────────────────────

  const openNewTemplate = () => {
    setEditingTemplate(null);
    setTplForm({ categoryName: "", type: "Core Service", description: "" });
    setTplError("");
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setTplForm({
      categoryName: tpl.categoryName,
      type: tpl.type,
      description: tpl.description || "",
    });
    setTplError("");
    setTemplateModalOpen(true);
  };

  const updateTierField = (tierKey, field, value) => {
    setTplForm((prev) => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tierKey]: { ...prev.tiers[tierKey], [field]: value },
      },
    }));
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setTplError("");
    if (!tplForm.categoryName.trim()) {
      setTplError("Category name is required.");
      return;
    }
    setTplSaving(true);
    try {
      const payload = {
        ...(editingTemplate ? { _id: editingTemplate._id } : {}),
        categoryName: tplForm.categoryName,
        type: tplForm.type,
        description: tplForm.description,
      };
      await saveTemplate(payload);
      setTemplateModalOpen(false);
    } catch (err) {
      setTplError(err.message || "Failed to save template.");
    } finally {
      setTplSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTplTarget) return;
    try {
      await deleteTemplate(deleteTplTarget._id);
      setDeleteTplTarget(null);
    } catch (err) {
      // silently log
      console.error(err);
    }
  };

  // ─── Assign target handlers ────────────────────────────────────────────────

  const openAssign = (rep) => {
    setAssignRep(rep);
    const existing = getRepAssignment(rep.id, currentMonth);
    setAssignTemplateId(existing?.templateId || (templates[0]?._id ?? ""));
    setAssignTiers({
      baseline: {
        callsPerDay: existing?.tiers?.baseline?.callsPerDay ?? "",
        conversionPct: existing?.tiers?.baseline?.conversionPct ?? "",
        expectedConversionPct: existing?.tiers?.baseline?.expectedConversionPct ?? "",
        monthlyClosings: existing?.tiers?.baseline?.monthlyClosings ?? "",
        expectedClosures: existing?.tiers?.baseline?.expectedClosures ?? "",
      },
      target: {
        callsPerDay: existing?.tiers?.target?.callsPerDay ?? "",
        conversionPct: existing?.tiers?.target?.conversionPct ?? "",
        expectedConversionPct: existing?.tiers?.target?.expectedConversionPct ?? "",
        monthlyClosings: existing?.tiers?.target?.monthlyClosings ?? "",
        expectedClosures: existing?.tiers?.target?.expectedClosures ?? "",
      },
      star: {
        callsPerDay: existing?.tiers?.star?.callsPerDay ?? "",
        conversionPct: existing?.tiers?.star?.conversionPct ?? "",
        expectedConversionPct: existing?.tiers?.star?.expectedConversionPct ?? "",
        monthlyClosings: existing?.tiers?.star?.monthlyClosings ?? "",
        expectedClosures: existing?.tiers?.star?.expectedClosures ?? "",
      },
    });
    setAssignMonth(currentMonth);
    setAssignError("");
    setAssignOpen(true);
  };

  const updateAssignTier = (tierKey, field, value) => {
    setAssignTiers((prev) => ({
      ...prev,
      [tierKey]: { ...prev[tierKey], [field]: value },
    }));
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    setAssignError("");
    if (!assignTemplateId) {
      setAssignError("Please select a template.");
      return;
    }
    setAssignSaving(true);
    try {
      await assignTemplate(
        assignRep.id,
        assignRep.name,
        assignTemplateId,
        {
          baseline: {
            callsPerDay: Number(assignTiers.baseline.callsPerDay) || 0,
            conversionPct: Number(assignTiers.baseline.conversionPct) || 0,
            expectedConversionPct: Number(assignTiers.baseline.expectedConversionPct) || 0,
            monthlyClosings: Number(assignTiers.baseline.monthlyClosings) || 0,
            expectedClosures: Number(assignTiers.baseline.expectedClosures) || 0,
          },
          target: {
            callsPerDay: Number(assignTiers.target.callsPerDay) || 0,
            conversionPct: Number(assignTiers.target.conversionPct) || 0,
            expectedConversionPct: Number(assignTiers.target.expectedConversionPct) || 0,
            monthlyClosings: Number(assignTiers.target.monthlyClosings) || 0,
            expectedClosures: Number(assignTiers.target.expectedClosures) || 0,
          },
          star: {
            callsPerDay: Number(assignTiers.star.callsPerDay) || 0,
            conversionPct: Number(assignTiers.star.conversionPct) || 0,
            expectedConversionPct: Number(assignTiers.star.expectedConversionPct) || 0,
            monthlyClosings: Number(assignTiers.star.monthlyClosings) || 0,
            expectedClosures: Number(assignTiers.star.expectedClosures) || 0,
          },
        },
        assignMonth,
        currentUser?.name || "Manager",
      );
      setAssignOpen(false);
    } catch (err) {
      setAssignError(err.message || "Failed to assign target.");
    } finally {
      setAssignSaving(false);
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
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight mb-1">
            Team Sales Performance Reports
          </h1>
          <p className="text-sm text-brand-primary/70">
            Track conversion weights, follow-up index completions, and converted
            leads per representative.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pageTab === "performance" && (
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
          )}
          {pageTab === "templates" && (
            <button
              onClick={openNewTemplate}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm"
            >
              <Plus size={18} />
              New Template
            </button>
          )}
        </div>
      </div>

      {/* ── Tab Switcher ──────────────────────────────────────────────────── */}
      <div className="flex border-b border-brand-secondary mb-6">
        <button
          onClick={() => setPageTab("performance")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${
            pageTab === "performance"
              ? "border-teal-500 text-teal-500"
              : "border-transparent text-brand-primary/60 hover:text-brand-primary"
          }`}
        >
          <Users size={16} />
          Team Performance
        </button>
        <button
          onClick={() => setPageTab("templates")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${
            pageTab === "templates"
              ? "border-teal-500 text-teal-500"
              : "border-transparent text-brand-primary/60 hover:text-brand-primary"
          }`}
        >
          <LayoutTemplate size={16} />
          Target Templates
          {templates.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-500">
              {templates.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: TEAM PERFORMANCE
      ══════════════════════════════════════════════════════════════════════ */}
      {pageTab === "performance" && (
        <>
          {/* Performer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performersList.map((p, index) => {
              const initials = p.name
                .split(" ")
                .map((w) => w[0])
                .join("");
              const isTop = index === 0;
              const isSecond = index === 1;
              const assignment = getRepAssignment(p.id, currentMonth);
              const tpl = getTemplateForAssignment(assignment);
              const tierCfg = TIER_LABELS[0]; // default badge for display
              const tierData = tpl?.tiers?.[assignment?.tier];

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
                    <span className="text-xs text-brand-primary/70 block mb-3">
                      Rank #{index + 1} • {p.assigned} Leads Managed
                    </span>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold mb-4 ${
                        isTop
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-brand-secondary/30 text-brand-primary border border-brand-secondary"
                      }`}
                    >
                      <Activity size={14} />
                      Score: {p.activityScore} / 100
                    </div>

                    {/* Target assignment badge */}
                    {assignment && tpl && (
                      <div className="w-full space-y-2 mt-2 pt-2 border-t border-brand-secondary/30">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                          <Target size={11} />
                          <span>{tpl.categoryName} Target</span>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5 text-[10px]">
                          {/* Baseline */}
                          <div className="flex items-center justify-between bg-orange-500/5 text-orange-600 px-2 py-1 rounded border border-orange-400/20">
                            <span className="font-semibold text-[9px]">
                              Baseline
                            </span>
                            <span>
                              {assignment.tiers?.baseline?.callsPerDay || "0"}{" "}
                              calls •{" "}
                              {assignment.tiers?.baseline?.conversionPct || "0"}
                              %
                            </span>
                          </div>
                          {/* Target */}
                          <div className="flex items-center justify-between bg-emerald-500/5 text-emerald-600 px-2 py-1 rounded border border-emerald-400/20">
                            <span className="font-semibold text-[9px]">
                              Target
                            </span>
                            <span>
                              {assignment.tiers?.target?.callsPerDay || "0"}{" "}
                              calls •{" "}
                              {assignment.tiers?.target?.conversionPct || "0"}%
                            </span>
                          </div>
                          {/* Star */}
                          <div className="flex items-center justify-between bg-indigo-500/5 text-indigo-600 px-2 py-1 rounded border border-indigo-400/20">
                            <span className="font-semibold text-[9px]">
                              Star
                            </span>
                            <span>
                              {assignment.tiers?.star?.callsPerDay || "0"} calls
                              • {assignment.tiers?.star?.conversionPct || "0"}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Table */}
          <div className="bg-brand-light border border-brand-secondary rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
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
                    Calls Made
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Conversion rate %
                  </th>
                  {/* <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Follow-up %
                  </th> */}
                  <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Activity Rating
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Active Target
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-brand-primary uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-secondary">
                {performersList.map((p, index) => {
                  const assignment = getRepAssignment(p.id, currentMonth);
                  const tpl = getTemplateForAssignment(assignment);

                  return (
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
                      <td className="py-3 px-4">
                        <div className="font-bold text-brand-primary">{p.name}</div>
                        <div className="text-[10px] text-teal-600 font-semibold bg-teal-500/10 px-1.5 py-0.5 rounded w-fit mt-1">
                          {allUsers.find((u) => u.name === p.name)?.specialization || "General Services"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-brand-primary">
                        {p.assigned}
                      </td>
                      <td className="py-3 px-4 text-brand-primary">{p.won}</td>
                      <td className="py-3 px-4 text-brand-primary">
                        <span className="font-bold">{p.callsMade}</span>
                        {assignment?.tiers?.target?.callsPerDay ? (
                          <span className="text-[10px] text-brand-primary/50 ml-1">
                            / {assignment.tiers.target.callsPerDay}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-teal-500">
                          {p.conversionRate}%
                        </span>
                      </td>
                      {/* <td className="py-3 px-4 text-brand-primary">
                        {p.fwCompletionRate}%
                      </td> */}
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
                      <td className="py-3 px-4 text-xs">
                        {assignment && tpl ? (
                          <div className="flex flex-col gap-1.5 py-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-400/30 w-fit">
                              {tpl?.categoryName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-brand-primary/40 italic">
                            No target set
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/salesperson/${encodeURIComponent(p.name)}`,
                              )
                            }
                            className="p-1.5 text-brand-primary/70 hover:text-teal-500 hover:bg-teal-500/10 rounded-lg transition-colors"
                            title="View Representative Details"
                          >
                            <Eye size={18} />
                          </button>
                          {/* Assign Target */}
                          <button
                            onClick={() => openAssign(p)}
                            disabled={templates.length === 0}
                            title={
                              templates.length === 0
                                ? "Create a template first"
                                : "Assign target tier"
                            }
                            className="p-1.5 text-brand-primary/70 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Target size={18} />
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: TARGET TEMPLATES
      ══════════════════════════════════════════════════════════════════════ */}
      {pageTab === "templates" && (
        <div className="space-y-5">
          {targetsLoading ? (
            <p className="text-sm text-brand-primary/60 text-center py-10">
              Loading templates…
            </p>
          ) : templates.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-brand-secondary rounded-2xl">
              <LayoutTemplate
                size={40}
                className="mx-auto text-brand-primary/20 mb-3"
              />
              <p className="text-sm font-semibold text-brand-primary/50 mb-1">
                No templates yet
              </p>
              <p className="text-xs text-brand-primary/40 mb-5">
                Create a template to define target benchmarks for your team.
              </p>
              <button
                onClick={openNewTemplate}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-xl transition-colors text-sm"
              >
                <Plus size={16} />
                Create First Template
              </button>
            </div>
          ) : (
            templates.map((tpl) => (
              <TemplateCard
                key={tpl._id}
                template={tpl}
                onEdit={openEditTemplate}
                onDelete={(t) => setDeleteTplTarget(t)}
              />
            ))
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Create / Edit Template
      ══════════════════════════════════════════════════════════════════════ */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-brand-secondary flex justify-between items-center">
              <h3 className="font-bold text-brand-primary text-lg">
                {editingTemplate ? "Edit Template" : "New Target Template"}
              </h3>
              <button
                onClick={() => setTemplateModalOpen(false)}
                className="text-brand-primary/50 hover:text-brand-primary"
              >
                <X size={20} />
              </button>
            </div>

            <form
              id="tpl-form"
              onSubmit={handleSaveTemplate}
              className="p-5 overflow-y-auto space-y-5"
            >
              {tplError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm">
                  {tplError}
                </div>
              )}

              {/* Basic info — no tier values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={tplForm.categoryName}
                    onChange={(e) =>
                      setTplForm({ ...tplForm, categoryName: e.target.value })
                    }
                    placeholder="e.g. Pet Services"
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                    Type Badge
                  </label>
                  <input
                    type="text"
                    value={tplForm.type}
                    onChange={(e) =>
                      setTplForm({ ...tplForm, type: e.target.value })
                    }
                    placeholder="e.g. Core Service, Recurring"
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={tplForm.description}
                    onChange={(e) =>
                      setTplForm({ ...tplForm, description: e.target.value })
                    }
                    placeholder="e.g. Walks, grooming, training, boarding, etc."
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Visual tier labels preview */}
              <div>
                <p className="text-xs font-bold text-brand-primary/70 mb-2">
                  Performance Tiers (visual labels)
                </p>
                <div className="flex gap-2">
                  {TIER_LABELS.map((t) => (
                    <span
                      key={t.key}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.badgeBg}`}
                    >
                      {t.badge}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-brand-primary/40 mt-1">
                  Target calls are set per employee when assigning this
                  template.
                </p>
              </div>
            </form>

            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="tpl-form"
                disabled={tplSaving}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60"
              >
                {tplSaving
                  ? "Saving…"
                  : editingTemplate
                    ? "Save Changes"
                    : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Assign Target Tier to Rep
      ══════════════════════════════════════════════════════════════════════ */}
      {assignOpen && assignRep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-brand-secondary flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-brand-primary text-base">
                  Assign Target
                </h3>
                <p className="text-xs text-brand-primary/60 mt-0.5 font-semibold">
                  Employee: {assignRep.name}
                </p>
              </div>
              <button
                onClick={() => setAssignOpen(false)}
                className="text-brand-primary/50 hover:text-brand-primary p-1 rounded-lg hover:bg-brand-secondary/30 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form
              id="assign-form"
              onSubmit={handleSaveAssignment}
              className="p-5 space-y-5 overflow-y-auto flex-1"
            >
              {assignError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm">
                  {assignError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary/70 mb-1.5">
                    Month
                  </label>
                  <input
                    type="month"
                    value={assignMonth}
                    onChange={(e) => setAssignMonth(e.target.value)}
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary/70 mb-1.5">
                    Template
                  </label>
                  <select
                    value={assignTemplateId}
                    onChange={(e) => setAssignTemplateId(e.target.value)}
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select a template…</option>
                    {templates.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.categoryName} ({t.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Tiers Inputs Grid */}
              {assignTemplateId && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-brand-primary/70">
                    Set Tier Benchmarks for {assignRep.name}
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Baseline Tier Card */}
                    <div className="rounded-xl border border-dashed border-orange-400 bg-orange-500/5 p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-primary">
                            Min Expected
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 border border-orange-400/30">
                            Baseline
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Calls / day
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.baseline.callsPerDay}
                              onChange={(e) =>
                                updateAssignTier(
                                  "baseline",
                                  "callsPerDay",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 120"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Conversion % (valid leads)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={assignTiers.baseline.conversionPct}
                              onChange={(e) =>
                                updateAssignTier(
                                  "baseline",
                                  "conversionPct",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 40"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Expected Conversion %
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={assignTiers.baseline.expectedConversionPct}
                              onChange={(e) =>
                                updateAssignTier(
                                  "baseline",
                                  "expectedConversionPct",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 40"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Monthly Closures Target
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.baseline.monthlyClosings}
                              onChange={(e) =>
                                updateAssignTier(
                                  "baseline",
                                  "monthlyClosings",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 20"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Expected Closures
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.baseline.expectedClosures}
                              onChange={(e) =>
                                updateAssignTier(
                                  "baseline",
                                  "expectedClosures",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 15"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-brand-primary/50 italic mt-3 pt-2 border-t border-brand-secondary/30">
                        Minimum acceptable performance to stay on track.
                      </p>
                    </div>

                    {/* Target Tier Card */}
                    <div className="rounded-xl border border-dashed border-emerald-400 bg-emerald-500/5 p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-primary">
                            Performance
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-400/30">
                            Target
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Calls / day
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.target.callsPerDay}
                              onChange={(e) =>
                                updateAssignTier(
                                  "target",
                                  "callsPerDay",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 200"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Conversion % (valid leads)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={assignTiers.target.conversionPct}
                              onChange={(e) =>
                                updateAssignTier(
                                  "target",
                                  "conversionPct",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 60"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Expected Conversion %
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={assignTiers.target.expectedConversionPct}
                              onChange={(e) =>
                                updateAssignTier(
                                  "target",
                                  "expectedConversionPct",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 60"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Monthly Closures Target
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.target.monthlyClosings}
                              onChange={(e) =>
                                updateAssignTier(
                                  "target",
                                  "monthlyClosings",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 30"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Expected Closures
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.target.expectedClosures}
                              onChange={(e) =>
                                updateAssignTier(
                                  "target",
                                  "expectedClosures",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 25"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-brand-primary/50 italic mt-3 pt-2 border-t border-brand-secondary/30">
                        Ideal daily performance for this category.
                      </p>
                    </div>

                    {/* Star Tier Card */}
                    <div className="rounded-xl border border-dashed border-indigo-400 bg-indigo-500/5 p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-primary">
                            Out Performance
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-400/30">
                            Star
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Calls / day
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.star.callsPerDay}
                              onChange={(e) =>
                                updateAssignTier(
                                  "star",
                                  "callsPerDay",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 250"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Conversion % (valid leads)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={assignTiers.star.conversionPct}
                              onChange={(e) =>
                                updateAssignTier(
                                  "star",
                                  "conversionPct",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 75"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Expected Conversion %
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={assignTiers.star.expectedConversionPct}
                              onChange={(e) =>
                                updateAssignTier(
                                  "star",
                                  "expectedConversionPct",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 75"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Monthly Closures Target
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.star.monthlyClosings}
                              onChange={(e) =>
                                updateAssignTier(
                                  "star",
                                  "monthlyClosings",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 40"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 mb-2"
                            />
                            <label className="block text-[10px] font-bold text-brand-primary/60 mb-1">
                              Expected Closures
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={assignTiers.star.expectedClosures}
                              onChange={(e) =>
                                updateAssignTier(
                                  "star",
                                  "expectedClosures",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 35"
                              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-brand-primary/50 italic mt-3 pt-2 border-t border-brand-secondary/30">
                        Over-achievement range that earns incentives.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAssignOpen(false)}
                className="px-4 py-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="assign-form"
                disabled={assignSaving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60"
              >
                {assignSaving ? "Saving…" : "Assign Target"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Add Sales Representative
      ══════════════════════════════════════════════════════════════════════ */}
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
              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm the password"
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  Specialization
                </label>
                <select
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                >
                  <option value="General Services">General Services (Combined Core)</option>
                  <option value="Pet Insurance">Pet Insurance</option>
                  <option value="All Services">All Services</option>
                </select>
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

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Delete Rep Confirmation
      ══════════════════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Delete Template Confirmation
      ══════════════════════════════════════════════════════════════════════ */}
      {deleteTplTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-light/60 backdrop-blur-sm">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-brand-secondary">
              <h3 className="font-bold text-brand-primary text-lg">
                Delete Template
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-brand-primary leading-relaxed">
                Are you sure you want to delete the{" "}
                <strong>{deleteTplTarget.categoryName}</strong> template? Any
                rep assignments using this template will also be cleared.
              </p>
            </div>
            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTplTarget(null)}
                className="px-4 py-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTemplate}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
