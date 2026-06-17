import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Edit2,
  Calendar,
  PawPrint,
  Download,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("New Leads");

  const decodedName = decodeURIComponent(name);
  const repLeads = leads.filter((l) => l.assignedTo === decodedName);

  const newLeads = repLeads.filter((l) => l.status?.toLowerCase() === "new");
  const followupLeads = repLeads.filter((l) => l.status?.toLowerCase() === "follow up");
  const convertedLeads = repLeads.filter((l) => l.status?.toLowerCase() === "joined");
  const notAttendedLeads = repLeads.filter((l) => l.status?.toLowerCase() === "not attended");
  const lostLeads = repLeads.filter((l) => {
    const s = l.status?.toLowerCase();
    return s === "price issue" || s === "not responding" || s === "not answered";
  });

  const displayedLeads =
    activeTab === "New Leads"
      ? newLeads
      : activeTab === "Followup Leads"
      ? followupLeads
      : activeTab === "Converted Leads"
      ? convertedLeads
      : activeTab === "Lost Leads"
      ? lostLeads
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
      case "not attended":
      case "price issue":
      case "not responding":
      case "not answered":
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
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="border-b border-brand-secondary flex overflow-x-auto no-scrollbar mb-6">
        {[
          { name: "New Leads", count: newLeads.length },
          { name: "Not Attended", count: notAttendedLeads.length },
          { name: "Followup Leads", count: followupLeads.length },
          { name: "Converted Leads", count: convertedLeads.length },
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

      {displayedLeads.length === 0 ? (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-12 text-center">
          <PawPrint className="w-16 h-16 text-brand-primary/70 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-primary">No Assigned Leads</h3>
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
