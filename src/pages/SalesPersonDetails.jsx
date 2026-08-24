import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Edit2,
  Calendar,
  PawPrint,
  Download,
  ChevronLeft,
  ChevronRight,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  Clock,
  TrendingUp,
  Target,
  BarChart2,
} from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants.js";
import { useLeads } from "../context/LeadsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTargets } from "../context/TargetsContext.jsx";
import { getServiceColor, formatDate, exportToCSV } from "../utils/helpers.js";

const Badge = ({ children, colorClass, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colorClass} ${className}`}
  >
    {children}
  </span>
);

export default function SalesPersonDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { leads } = useLeads();
  const { allUsers } = useAuth();
  const { repAssignments, templates, getRepAssignment, getTemplateForAssignment } = useTargets();
  const decodedName = decodeURIComponent(name);
  const [activeTab, setActiveTab] = useState("New Leads");
  const [analytics, setAnalytics] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState(null);
  const scrollContainerRef = useRef(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINTS.ANALYTICS.BASE}/${decodedName}`);
        setAnalytics(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    const fetchMonthly = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINTS.ANALYTICS.BASE}/monthly-performance`);
        const repPerf = res.data.data?.find(d => d.repName === decodedName);
        setMonthlyPerformance(repPerf || null);
      } catch (error) {
        console.error("Failed to fetch monthly performance:", error);
      }
    };
    fetchAnalytics();
    fetchMonthly();
  }, [decodedName]);

  const formatTalkTime = (seconds) => {
    if (!seconds) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayStrDate = new Date().toISOString().split("T")[0];
  const todayAnalytics = analytics.find(a => a.date === todayStrDate) || {
    totalCalls: 0, talkTime: 0, incoming: 0, outgoing: 0, missed: 0, connected: 0, rejected: 0, notConnected: 0
  };
  
  const weeklyAnalytics = analytics.reduce((acc, curr) => ({
    totalCalls: acc.totalCalls + curr.totalCalls,
    talkTime: acc.talkTime + curr.talkTime,
    incoming: acc.incoming + curr.incoming,
    outgoing: acc.outgoing + curr.outgoing,
    missed: acc.missed + curr.missed,
    connected: acc.connected + curr.connected,
    rejected: acc.rejected + curr.rejected,
    notConnected: acc.notConnected + curr.notConnected,
  }), { totalCalls: 0, talkTime: 0, incoming: 0, outgoing: 0, missed: 0, connected: 0, rejected: 0, notConnected: 0 });

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const repLeads = leads.filter((l) => l.assignedTo === decodedName);

  const newLeads = repLeads.filter((l) => l.status?.toLowerCase() === "new");
  const todayStr = new Date().toISOString().split("T")[0];

  const todayFollowups = repLeads.filter((l) => {
    if (l.status?.toLowerCase() !== "follow up") return false;
    const fDate = l.nextFollowUp?.split("T")[0];
    return !fDate || fDate <= todayStr;
  });

  const upcomingFollowups = repLeads.filter((l) => {
    if (l.status?.toLowerCase() !== "follow up") return false;
    const fDate = l.nextFollowUp?.split("T")[0];
    return fDate && fDate > todayStr;
  });
  const convertedLeads = repLeads.filter(
    (l) => l.status?.toLowerCase() === "job assigned",
  );
  const jobPostedLeads = repLeads.filter(
    (l) => l.status?.toLowerCase() === "job posted",
  );
  const joinedLeads = repLeads.filter(
    (l) => l.status?.toLowerCase() === "joined",
  );
  const notAttendedLeads = repLeads.filter(
    (l) => l.status?.toLowerCase() === "not attended",
  );
  const lostLeads = repLeads.filter((l) => {
    const s = l.status?.toLowerCase();
    return (
      s === "price issue" || s === "not interested"
    );
  });

  const displayedLeads =
    activeTab === "New Leads"
      ? newLeads
      : activeTab === "Today Followups"
        ? todayFollowups
        : activeTab === "Upcoming Followups"
          ? upcomingFollowups
          : activeTab === "Converted Leads"
          ? convertedLeads
          : activeTab === "Lost Leads"
            ? lostLeads
            : activeTab === "Job Posted"
              ? jobPostedLeads
              : activeTab === "Joined Leads"
                ? joinedLeads
                : activeTab === "Not Attended"
                  ? notAttendedLeads
                  : repLeads;

  const handleExport = () => {
    exportToCSV(
      displayedLeads,
      `${decodedName.replace(/\s+/g, "_")}_leads.csv`,
    );
  };

  const getTwStatusColorLocal = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "new":
        return "bg-teal-500/10 text-teal-500 border border-teal-500/20";
      case "follow up":
        return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      case "joined":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "job posted":
        return "bg-teal-500/10 text-teal-600 border border-teal-500/20 font-extrabold";
      case "job assigned":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-extrabold";
      case "not attended":
      case "price issue":
      case "not interested":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-brand-secondary/40 text-brand-primary/70 border border-brand-secondary/50";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors font-medium mb-2"
      >
        <ArrowLeft size={18} />
        Back to Team Performance
      </button>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-brand-primary flex items-center justify-center font-bold text-2xl shrink-0">
            {decodedName.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-primary tracking-tight flex items-center gap-3">
              {decodedName}'s Leads
              <span className="text-xs font-semibold bg-teal-500/10 text-teal-600 px-2 py-1 rounded border border-teal-500/20">
                {allUsers.find((u) => u.name === decodedName)?.specialization || "General Services"}
              </span>
            </h1>
            <p className="text-sm text-brand-primary/70 mt-1">
              Total assigned leads: {repLeads.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-brand-secondary rounded-lg p-1 bg-brand-light">
            <button
              onClick={() => handleScroll("left")}
              className="p-1.5 rounded hover:bg-brand-secondary/50 text-brand-primary transition-colors"
              title="Scroll Tabs Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-1.5 rounded hover:bg-brand-secondary/50 text-brand-primary transition-colors"
              title="Scroll Tabs Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => navigate(`/salesperson/${name}/reports`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
          >
            <BarChart2 className="w-4 h-4" /> View Reports
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>
      {/* ── Current Target Banner ──────────────────────────────────────────── */}
      {(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const repUser = allUsers?.find(
          (u) => u.name?.toLowerCase() === decodedName?.toLowerCase()
        );
        const assignment = repUser ? getRepAssignment(repUser.id, currentMonth) : null;
        const tpl = getTemplateForAssignment(assignment);

        if (!assignment || !tpl) return null;

        return (
          <div className="bg-brand-light border border-brand-secondary rounded-2xl p-4 mb-2 flex items-center gap-6 flex-wrap shadow-sm">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-indigo-500 animate-pulse" />
              <span className="text-sm font-bold text-brand-primary">Active Target Plan</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-primary/60">Template:</span>
              <span className="text-xs font-bold text-brand-primary">{tpl.categoryName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-brand-secondary text-brand-primary/60 bg-brand-secondary/10">
                {tpl.type}
              </span>
            </div>

            {/* Displaying Tiers details */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Baseline */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-orange-500/10 text-orange-600 border border-orange-400/30 text-xs">
                <span className="font-bold">Baseline:</span>
                <span>{assignment.tiers?.baseline?.callsPerDay || "0"} calls/day • {assignment.tiers?.baseline?.conversionPct || "0"}%</span>
              </div>
              {/* Target */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 text-xs">
                <span className="font-bold">Target:</span>
                <span>{assignment.tiers?.target?.callsPerDay || "0"} calls/day • {assignment.tiers?.target?.conversionPct || "0"}%</span>
              </div>
              {/* Star */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-400/30 text-xs">
                <span className="font-bold">Star:</span>
                <span>{assignment.tiers?.star?.callsPerDay || "0"} calls/day • {assignment.tiers?.star?.conversionPct || "0"}%</span>
              </div>
            </div>

            <span className="text-[10px] text-brand-primary/40 ml-auto">
              Month: {assignment.assignedMonth}
            </span>
          </div>
        );
      })()}

      {/* ── Monthly Performance Widget ──────────────────────────────────────── */}
      {monthlyPerformance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-brand-light p-4 rounded-xl border border-brand-secondary shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs text-brand-primary/60 font-bold mb-1">Expected Closures</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-brand-primary">{monthlyPerformance.expectedClosures}</span>
                <span className="text-xs text-brand-primary/50 mb-1">this month</span>
              </div>
            </div>
            <p className="text-[10px] text-brand-primary/50 mt-3 border-t border-brand-secondary/40 pt-2">
              Based on {monthlyPerformance.assignedLeadsCount} assigned leads & {monthlyPerformance.expectedConversionPct}% expected conv.
            </p>
          </div>
          <div className="bg-brand-light p-4 rounded-xl border border-brand-secondary shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs text-brand-primary/60 font-bold mb-1">Actual Conversion Rate</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-teal-500">{monthlyPerformance.actualConversionPct}%</span>
                <span className="text-xs text-brand-primary/50 mb-1">vs {monthlyPerformance.expectedConversionPct}%</span>
              </div>
            </div>
            <p className="text-[10px] text-brand-primary/50 mt-3 border-t border-brand-secondary/40 pt-2">
              {monthlyPerformance.actualClosures} closed out of {monthlyPerformance.assignedLeadsCount} leads.
            </p>
          </div>
          <div className="bg-brand-light p-4 rounded-xl border border-brand-secondary shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs text-brand-primary/60 font-bold mb-1">Closing Performance</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-brand-primary">{monthlyPerformance.closingPerformance}%</span>
                <span className="text-xs text-brand-primary/50 mb-1">of target</span>
              </div>
            </div>
            <div className="w-full bg-brand-secondary rounded-full h-1.5 mt-3">
              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, monthlyPerformance.closingPerformance)}%` }}></div>
            </div>
          </div>
          <div className="bg-brand-light p-4 rounded-xl border border-brand-secondary shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs text-brand-primary/60 font-bold mb-1">Overall Rating</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-amber-500">{monthlyPerformance.starRating.toFixed(1)}</span>
                <span className="text-xs text-amber-500 font-bold mb-1">Stars</span>
              </div>
            </div>
            <p className="text-[10px] text-brand-primary/50 mt-3 border-t border-brand-secondary/40 pt-2">
              Score: {monthlyPerformance.overallScore} (Closures & Calls)
            </p>
          </div>
        </div>
      )}


      <div className="border-b border-brand-secondary w-full overflow-hidden mb-6">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {[
          { name: "New Leads", count: newLeads.length },
          { name: "Not Attended", count: notAttendedLeads.length },
          { name: "Today Followups", count: todayFollowups.length },
          { name: "Upcoming Followups", count: upcomingFollowups.length },
          { name: "Converted Leads", count: convertedLeads.length },
          { name: "Job Posted", count: jobPostedLeads.length },
          { name: "Joined Leads", count: joinedLeads.length },
          { name: "Lost Leads", count: lostLeads.length },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.name
                ? "border-teal-500 text-teal-500"
                : "border-transparent text-brand-primary/70 hover:text-brand-primary hover:border-brand-secondary"
            }`}
          >
            {tab.name}
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
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
      </div>

      {displayedLeads.length === 0 ? (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-12 text-center">
          <PawPrint className="w-16 h-16 text-brand-primary/70 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-primary">
            No Assigned Leads
          </h3>
          <p className="text-sm text-brand-primary/70 mt-1">
            This representative currently has no leads assigned to them.
          </p>
        </div>
      ) : (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-brand-light border-b border-brand-secondary">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-secondary">
                {displayedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-brand-secondary/30/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/lead-details/${lead.id}`)}
                        className="text-sm font-bold text-teal-400 hover:text-teal-300 hover:underline text-left"
                      >
                        {lead.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-primary">
                      {lead.phone}
                    </td>
                    <td className="px-4 py-3">
                      <div 
                        className="flex flex-wrap gap-1.5"
                        title={(lead.services && lead.services.length > 0 ? lead.services : ["Grooming"]).join(", ")}
                      >
                        {(() => {
                          const services = lead.services && lead.services.length > 0 ? lead.services : ["Grooming"];
                          return (
                            <>
                              <div className="flex items-center gap-1.5 bg-brand-secondary/20 px-2 py-0.5 rounded cursor-help">
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getServiceColor(services[0]) }}
                                />
                                <span className="text-xs font-semibold text-brand-primary">
                                  {services[0]}
                                </span>
                              </div>
                              {services.length > 1 && (
                                <div className="flex items-center gap-1.5 bg-brand-secondary/20 px-2 py-0.5 rounded cursor-help">
                                  <span className="text-xs font-semibold text-brand-primary">
                                    +{services.length - 1}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        colorClass={getTwStatusColorLocal(lead.status || "New")}
                      >
                        {lead.status || "New"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/lead-details/${lead.id}`)}
                        className="p-1.5 text-teal-500 hover:text-teal-400 hover:bg-teal-500/10 rounded transition-colors"
                        title="Open Detail"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
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
