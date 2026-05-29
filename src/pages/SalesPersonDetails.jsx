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
  const [activeTab, setActiveTab] = useState("Clients");

  const decodedName = decodeURIComponent(name);
  const repLeads = leads.filter((l) => l.assignedTo === decodedName);

  const clientLeads = repLeads.filter(
    (l) => l.leadType === "Client" || !l.leadType,
  );
  const providerLeads = repLeads.filter(
    (l) => l.leadType === "Service Provider",
  );
  const newLeads = repLeads.filter((l) => l.status?.toLowerCase() === "new");

  const displayedLeads =
    activeTab === "Clients"
      ? clientLeads
      : activeTab === "Service Providers"
        ? providerLeads
        : newLeads;

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
      case "not interested":
      case "price issue":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium mb-2"
      >
        <ArrowLeft size={18} />
        Back to Team Performance
      </button>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0">
            {decodedName.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {decodedName}'s Leads
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Total assigned leads: {repLeads.length}
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="border-b border-zinc-800 flex overflow-x-auto no-scrollbar mb-6">
        {[
          { name: "Clients", count: clientLeads.length },
          { name: "Service Providers", count: providerLeads.length },
          { name: "New Assigned Leads", count: newLeads.length },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.name
                ? "border-teal-500 text-teal-500"
                : "border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {tab.name}
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                activeTab === tab.name
                  ? "bg-teal-500/20 text-teal-500"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {displayedLeads.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <PawPrint className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">No Assigned Leads</h3>
          <p className="text-sm text-zinc-500 mt-1">
            This representative currently has no leads assigned to them.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-zinc-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {displayedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/lead-details/${lead.id}`)}
                        className="text-sm font-bold text-teal-400 hover:text-teal-300 hover:underline text-left"
                      >
                        {lead.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-300">
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
                        <span className="text-sm font-semibold text-zinc-200">
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
