import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  ExternalLink,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import { useLeads } from "../context/LeadsContext.jsx";
import { formatDate } from "../utils/helpers.js";

export default function FollowUpReport() {
  const navigate = useNavigate();
  const { leads, activities, followups } = useLeads();

  const reportData = useMemo(() => {
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    // Get all leads that have an activity or followup in the last 5 days
    const activeLeadIds = new Set();

    activities.forEach((act) => {
      const actDate = new Date(act.date);
      if (actDate >= fiveDaysAgo && actDate <= today) {
        activeLeadIds.add(act.leadId);
      }
    });

    followups.forEach((fw) => {
      const fwDate = new Date(fw.date);
      if (fwDate >= fiveDaysAgo && fwDate <= today) {
        activeLeadIds.add(fw.leadId);
      }
    });

    // Group active leads by salesperson
    const grouped = {};
    activeLeadIds.forEach((leadId) => {
      const lead = leads.find((l) => l.id === leadId);
      if (lead) {
        const rep = lead.assignedTo || "Unassigned";
        if (!grouped[rep]) {
          grouped[rep] = [];
        }
        grouped[rep].push(lead);
      }
    });

    return Object.entries(grouped).sort(([repA], [repB]) =>
      repA.localeCompare(repB),
    );
  }, [leads, activities, followups]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-primary tracking-tight flex items-center gap-3">
            <ClipboardList className="text-teal-500" size={28} />
            Recent Follow-up Report (Last 5 Days)
          </h1>
          <p className="text-sm text-brand-primary/70 mt-1">
            Overview of leads actively followed up by sales representatives in
            the last 5 days.
          </p>
        </div>
      </div>

      {reportData.length === 0 ? (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-12 text-center">
          <ClipboardList className="w-16 h-16 text-brand-primary/70 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-primary">
            No Recent Follow-ups
          </h3>
          <p className="text-sm text-brand-primary/70 mt-1">
            No leads have been followed up in the past 5 days.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reportData.map(([salesperson, activeLeads]) => (
            <div
              key={salesperson}
              className="bg-brand-light border border-brand-secondary rounded-xl overflow-hidden shadow-sm"
            >
              <div className="bg-brand-light px-5 py-4 border-b border-brand-secondary flex justify-between items-center">
                <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-brand-primary flex items-center justify-center text-sm">
                    {salesperson.substring(0, 1).toUpperCase()}
                  </span>
                  {salesperson}
                </h3>
                <span className="px-3 py-1 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-full text-xs font-bold">
                  {activeLeads.length} Active Leads
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/lead-details/${lead.id}`)}
                      className="bg-brand-light border border-brand-secondary hover:border-teal-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(20,184,166,0.1)] group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-brand-primary group-hover:text-teal-400 transition-colors">
                            {lead.name}
                          </h4>
                          <span className="text-xs text-brand-primary/70">
                            {lead.service} • {lead.stage}
                          </span>
                        </div>
                        <ExternalLink className="text-brand-primary/80 group-hover:text-teal-500 w-4 h-4 transition-colors" />
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm text-brand-primary/70">
                          <Phone size={14} className="text-brand-primary/70" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-primary/70">
                          <Mail size={14} className="text-brand-primary/70" />
                          <span className="truncate">
                            {lead.email || "No email"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-primary/70">
                          <Calendar size={14} className="text-brand-primary/70" />
                          <span>
                            Joined:{" "}
                            {formatDate(lead.joinedAt || lead.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-brand-secondary flex justify-between items-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === "Joined"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : lead.status === "New"
                                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}
                        >
                          {lead.status || "New"}
                        </span>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
