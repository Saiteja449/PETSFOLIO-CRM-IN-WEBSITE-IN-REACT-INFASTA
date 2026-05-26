import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Star,
  CheckCircle2,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { useDashboard } from "../context/DashboardContext.jsx";
import { useLeads } from "../context/LeadsContext.jsx";
import { formatDate, getServiceColor, exportToCSV } from "../utils/helpers.js";

const CHART_COLORS = ["#2563eb", "#16a34a", "#ea580c", "#db2777", "#7c3aed"];

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useDashboard();
  const { leads } = useLeads();

  const handleExport = () => {
    exportToCSV(leads, "dashboard_leads_export.csv");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top Banner section */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time analytical performance summary for Petsfolio sales
            pipelines.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total Pipeline Leads
            </h3>
            <div className="text-3xl font-extrabold text-white mt-1">
              {stats.totalLeads}
            </div>
            <div className="text-xs font-semibold text-teal-500 flex items-center mt-1">
              Active and tracked clients
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-teal-500" />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Lead Conversion %
              </h3>
              <div className="text-3xl font-extrabold text-white mt-1">
                {stats.conversionRate}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 w-full bg-blue-500/10 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${stats.conversionRate}%` }}
            ></div>
          </div>
        </div>

        {/* To-Do followup Index */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Today's Follow-ups
            </h3>
            <div className="text-3xl font-extrabold text-orange-500 mt-1">
              {stats.todaysFollowupsCount}
            </div>
            <div
              className={`text-xs font-semibold flex items-center gap-1 mt-1 ${
                stats.overdueFollowupsCount > 0 ? "text-red-500" : "text-zinc-400"
              }`}
            >
              {stats.overdueFollowupsCount > 0 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {stats.overdueFollowupsCount} Overdue Backlogs
                </>
              ) : (
                "Fully streamlined"
              )}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              stats.todaysFollowupsCount > 0
                ? "bg-orange-500/10 text-orange-500"
                : "bg-blue-500/10 text-blue-500"
            }`}
          >
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* service level stats grid summaries */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          Service Performance Hubs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.revenueByServiceData.map((s, index) => {
            const numLeads =
              stats.leadsByServiceData.find((le) => le.name === s.name)
                ?.value || 0;
            const sColor = getServiceColor(s.name);
            return (
              <div
                key={s.name}
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, #18181b 60%, ${sColor}0f 100%)`,
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: sColor }}
                />
                <div className="p-4 pl-6">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {s.name}
                  </h3>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="block text-xs font-medium text-zinc-400">
                        Leads Count:
                      </span>
                      <span className="block text-lg font-extrabold text-zinc-100 leading-tight mt-0.5">
                        {numLeads}
                      </span>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-[400px]">
          <h3 className="text-base font-bold text-white mb-4">Leads by Service</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={stats.leadsByServiceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {stats.leadsByServiceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5", borderRadius: "8px" }}
                itemStyle={{ color: "#f4f4f5" }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-[400px]">
          <h3 className="text-base font-bold text-white mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={stats.leadSourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {stats.leadSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5", borderRadius: "8px" }}
                itemStyle={{ color: "#f4f4f5" }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 min-h-[400px]">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />{" "}
              Sales Leaderboard
            </h3>
            <button
              onClick={() => navigate("/performance")}
              className="text-sm font-bold text-teal-500 hover:text-teal-400 flex items-center gap-1 transition-colors"
            >
              View Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <ul className="space-y-0">
            {stats.performersList.map((p, index) => (
              <React.Fragment key={p.name}>
                {index > 0 && <li className="h-px bg-zinc-800 my-2" />}
                <li className="flex items-center px-2 py-3">
                  <div className="relative shrink-0 mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-zinc-950 ${
                        index === 0 ? "bg-teal-500" : "bg-zinc-700 text-white"
                      }`}
                    >
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-950 border-2 border-zinc-900 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-zinc-400"
                            : "bg-amber-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="min-w-0 truncate pr-4">
                      <div className="font-bold text-white text-sm truncate">
                        {p.name}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 truncate">
                        {p.assigned} assigned • {p.won} converted
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-emerald-500 text-sm">
                        {p.conversionRate}% Conv.
                      </div>
                    
                    </div>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Recent timeline feed */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 min-h-[400px]">
          <h3 className="text-base font-bold text-white mb-6 px-2">
            Recent Action timeline
          </h3>

          <ul className="space-y-0">
            {stats.recentActivities.slice(0, 5).map((act, index) => (
              <React.Fragment key={act.id}>
                {index > 0 && <li className="h-px bg-zinc-800 my-2" />}
                <li className="flex items-start px-2 py-3">
                  <div className="shrink-0 mr-4 mt-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        act.type.includes("Stage")
                          ? "bg-orange-500/10 text-orange-500"
                          : act.type.includes("Created")
                            ? "bg-teal-500/10 text-teal-500"
                            : "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {act.type.includes("Stage") ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : act.type.includes("Created") ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <div className="font-bold text-white text-sm truncate pr-2">
                        {act.leadName} ({act.author})
                      </div>
                      <div className="text-xs text-zinc-400 whitespace-nowrap">
                        {formatDate(act.date)}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {act.content}
                    </div>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
          {stats.recentActivities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm text-zinc-400">
                No recent audit events logged.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
