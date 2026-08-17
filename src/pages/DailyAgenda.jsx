import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  AlertCircle,
  Zap,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useLeads } from "../context/LeadsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/helpers.js";

const LeadCard = ({ lead, navigate }) => (
  <div
    onClick={() => navigate(`/lead-details/${lead.id}`)}
    className="bg-brand-light border border-brand-secondary hover:border-teal-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(20,184,166,0.1)] group"
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-brand-primary group-hover:text-teal-500 transition-colors">
          {lead.name}
        </h4>
        <span className="text-xs font-medium text-brand-primary/70">
          {lead.services?.join(', ') || 'Grooming'} • {lead.stage}
        </span>
      </div>
      <ExternalLink className="text-brand-primary/50 group-hover:text-teal-500 w-4 h-4 transition-colors" />
    </div>

    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-2 text-sm text-brand-primary/80">
        <Phone size={14} className="text-brand-primary/50" />
        {lead.phone}
      </div>
      <div className="flex items-center gap-2 text-sm text-brand-primary/80">
        <Mail size={14} className="text-brand-primary/50" />
        <span className="truncate max-w-[150px]">
          {lead.email || "No email"}
        </span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-brand-secondary flex justify-between items-center">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary/70">
        <Calendar size={12} className="text-brand-primary/50" />
        {lead.nextFollowUp
          ? `Follow Up: ${formatDate(lead.nextFollowUp)}`
          : `Enquired: ${formatDate(lead.joinedAt || lead.createdAt)}`}
      </div>
      <span
        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          lead.status?.toLowerCase() === "not attended" ||
          (lead.nextFollowUp &&
            lead.nextFollowUp.split("T")[0] < new Date().toISOString().split("T")[0] &&
            lead.status === "Follow Up")
            ? "bg-red-500/10 text-red-500 border border-red-500/20"
            : lead.status === "New"
              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
        }`}
      >
        {lead.status || "New"}
      </span>
    </div>
  </div>
);

export default function DailyAgenda() {
  const navigate = useNavigate();
  const { leads } = useLeads();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = React.useState("New");

  const { urgentLeads, newLeads, todayFollowups } = useMemo(() => {
    // Current date logic
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // 24 hours ago for "Not Attended" calculation
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const myLeads =
      currentUser?.role === "Sales Representative"
        ? leads.filter(
            (l) =>
              l.assignedTo?.toLowerCase() === currentUser.name?.toLowerCase(),
          )
        : leads; // For managers, show all (or they wouldn't use this view as much)

    const urgent = [];
    const fresh = [];
    const scheduled = [];

    myLeads.forEach((lead) => {
      const status = lead.status?.toLowerCase() || "new";

      // Ignore won/lost leads
      if (
        status === "joined" ||
        status === "price issue" ||
        status === "not interested"
      ) {
        return;
      }

      const joinedStr = lead.joinedAt || lead.createdAt || todayStr;

      // Rule 1: Urgent / Not Attended / Overdue
      if (
        status === "not attended" ||
        (status === "new" && joinedStr <= yesterdayStr) ||
        (status === "follow up" &&
          lead.nextFollowUp &&
          lead.nextFollowUp.split("T")[0] < todayStr)
      ) {
        urgent.push({ ...lead, isUrgent: true });
        return;
      }

      // Rule 2: Fresh New Leads
      if (status === "new" && joinedStr > yesterdayStr) {
        fresh.push(lead);
        return;
      }

      // Rule 3: Today's Followups
      if (status === "follow up" && lead.nextFollowUp?.split("T")[0] === todayStr) {
        scheduled.push(lead);
        return;
      }
    });

    return { urgentLeads: urgent, newLeads: fresh, todayFollowups: scheduled };
  }, [leads, currentUser]);

  const displayedLeads =
    activeTab === "Urgent"
      ? urgentLeads
      : activeTab === "New"
        ? newLeads
        : todayFollowups;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-primary tracking-tight flex items-center gap-3">
            <CalendarDays className="text-teal-500" size={28} />
            My Daily Agenda
          </h1>
          <p className="text-sm text-brand-primary/70 mt-1">
            Your prioritized task list. Handle New leads first, then Urgent
            issues and scheduled follow-ups.
          </p>
        </div>
      </div>

      <div className="border-b border-brand-secondary flex overflow-x-auto no-scrollbar mb-6">
        {[
          {
            name: "New",
            label: "New Leads",
            count: newLeads.length,
            icon: <Zap size={16} className="mr-2" />,
          },
          {
            name: "Urgent",
            label: "Urgent Action",
            count: urgentLeads.length,
            icon: <AlertCircle size={16} className="mr-2" />,
          },
          {
            name: "Scheduled",
            label: "Scheduled Today",
            count: todayFollowups.length,
            icon: <CalendarDays size={16} className="mr-2" />,
          },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.name
                ? "border-teal-500 text-teal-500"
                : "border-transparent text-brand-primary/70 hover:text-brand-primary hover:border-brand-secondary"
            }`}
          >
            {tab.icon}
            {tab.label}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                activeTab === tab.name
                  ? "bg-teal-500/20 text-teal-500"
                  : "bg-brand-secondary/30 text-brand-primary/70"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {displayedLeads.length === 0 ? (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-12 text-center">
          <CalendarDays className="w-16 h-16 text-brand-primary/70 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-primary">
            No tasks here
          </h3>
          <p className="text-sm text-brand-primary/70 mt-1">
            You're all caught up with this bucket.
          </p>
        </div>
      ) : (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-brand-light border-b border-brand-secondary">
                <tr>
                  <th className="p-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="p-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="p-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Service & Stage
                  </th>
                  <th className="p-4 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="p-4 text-xs font-bold text-brand-primary uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-secondary">
                {displayedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/lead-details/${lead.id}`)}
                    className="hover:bg-brand-secondary/10 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-brand-primary group-hover:text-teal-500 transition-colors flex items-center gap-2">
                        {lead.name}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-brand-primary/80 flex flex-col gap-1.5">
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-brand-primary/50" />{" "}
                          {lead.phone}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} className="text-brand-primary/50" />{" "}
                          <span className="truncate max-w-[150px]">
                            {lead.email || "No email"}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-brand-primary/80">
                        <div className="font-medium">{lead.services?.join(', ') || 'Grooming'}</div>
                        <div className="text-xs text-brand-primary/60 mt-0.5">
                          {lead.stage}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-brand-primary/80 flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand-primary/50" />
                        {lead.nextFollowUp
                          ? `Follow Up: ${formatDate(lead.nextFollowUp)}`
                          : `Enquired: ${formatDate(lead.joinedAt || lead.createdAt)}`}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          lead.status?.toLowerCase() === "not attended" ||
                          (lead.nextFollowUp &&
                            lead.nextFollowUp.split("T")[0] <
                              new Date().toISOString().split("T")[0] &&
                            lead.status === "Follow Up")
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : lead.status === "New"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {lead.status || "New"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
