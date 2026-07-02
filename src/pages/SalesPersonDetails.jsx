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
} from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants.js";
import { useLeads } from "../context/LeadsContext.jsx";
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
  const decodedName = decodeURIComponent(name);
  const [activeTab, setActiveTab] = useState("New Leads");
  const [analytics, setAnalytics] = useState([]);
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
    fetchAnalytics();
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
            <h1 className="text-2xl font-extrabold text-brand-primary tracking-tight">
              {decodedName}'s Leads
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
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Analytics Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-4">
          <h2 className="text-lg font-bold text-brand-primary mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-500" /> Today's Activity
          </h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-brand-secondary/20 p-3 rounded-lg border border-brand-secondary">
              <span className="text-xs text-brand-primary/70 block mb-1">Calls Today</span>
              <span className="text-xl font-bold text-brand-primary">{todayAnalytics.totalCalls}</span>
            </div>
            <div className="bg-brand-secondary/20 p-3 rounded-lg border border-brand-secondary">
              <span className="text-xs text-brand-primary/70 block mb-1">Talk Time</span>
              <span className="text-xl font-bold text-brand-primary">{formatTalkTime(todayAnalytics.talkTime)}</span>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <span className="text-xs text-red-500 block mb-1">Missed Today</span>
              <span className="text-xl font-bold text-red-500">{todayAnalytics.missed}</span>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <span className="text-xs text-emerald-500 block mb-1">Connected Today</span>
              <span className="text-xl font-bold text-emerald-600">{todayAnalytics.connected}</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-4">
          <h2 className="text-lg font-bold text-brand-primary mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-500" /> Last 7 Days Summary
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            <div className="flex flex-col items-center p-2 bg-brand-secondary/10 rounded-lg">
              <Phone className="w-4 h-4 text-brand-primary/70 mb-1" />
              <span className="text-xs text-brand-primary/70 text-center">Total</span>
              <span className="font-bold text-brand-primary">{weeklyAnalytics.totalCalls}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-indigo-500/10 rounded-lg">
              <PhoneIncoming className="w-4 h-4 text-indigo-500 mb-1" />
              <span className="text-xs text-indigo-500 text-center">Incoming</span>
              <span className="font-bold text-indigo-600">{weeklyAnalytics.incoming}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-teal-500/10 rounded-lg">
              <PhoneOutgoing className="w-4 h-4 text-teal-500 mb-1" />
              <span className="text-xs text-teal-500 text-center">Outgoing</span>
              <span className="font-bold text-teal-600">{weeklyAnalytics.outgoing}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-red-500/10 rounded-lg">
              <PhoneMissed className="w-4 h-4 text-red-500 mb-1" />
              <span className="text-xs text-red-500 text-center">Missed</span>
              <span className="font-bold text-red-600">{weeklyAnalytics.missed}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-emerald-500/10 rounded-lg">
              <Phone className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-xs text-emerald-500 text-center">Connected</span>
              <span className="font-bold text-emerald-600">{weeklyAnalytics.connected}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-orange-500/10 rounded-lg">
              <PhoneOff className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-xs text-orange-500 text-center">Rejected</span>
              <span className="font-bold text-orange-600">{weeklyAnalytics.rejected}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-brand-secondary/20 rounded-lg">
              <PhoneOff className="w-4 h-4 text-brand-primary/50 mb-1" />
              <span className="text-[10px] leading-tight text-brand-primary/50 text-center">Not Connect</span>
              <span className="font-bold text-brand-primary/70">{weeklyAnalytics.notConnected}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-sky-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-sky-500 mb-1" />
              <span className="text-xs text-sky-500 text-center">Talk Time</span>
              <span className="font-bold text-sky-600 text-xs mt-1">{formatTalkTime(weeklyAnalytics.talkTime)}</span>
            </div>
          </div>
        </div>
      </div>

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
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: getServiceColor(lead.service),
                          }}
                        ></div>
                        <span className="text-sm font-semibold text-brand-primary">
                          {lead.service}
                        </span>
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
