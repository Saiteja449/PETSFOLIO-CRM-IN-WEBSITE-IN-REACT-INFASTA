import React from "react";
import { createContext, useContext, useMemo } from "react";
import { useLeads } from "./LeadsContext.jsx";
import { useAuth } from "./AuthContext.jsx";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { currentUser, allUsers } = useAuth();
  const { leads: rawLeads, followups: rawFollowups, activities: rawActivities } = useLeads();

  // Filter based on user role: if Sales Representative, only show their assigned leads for simple dashboard KPIs
  const leads = useMemo(() => {
    if (currentUser && currentUser.role === "Sales Representative") {
      return rawLeads.filter(l => l.assignedTo?.toLowerCase() === currentUser.name?.toLowerCase());
    }
    return rawLeads;
  }, [rawLeads, currentUser]);

  const followups = useMemo(() => {
    if (currentUser && currentUser.role === "Sales Representative") {
      return rawFollowups.filter(f => {
        const lead = rawLeads.find(l => l.id === f.leadId);
        return lead && lead.assignedTo?.toLowerCase() === currentUser.name?.toLowerCase();
      });
    }
    return rawFollowups;
  }, [rawFollowups, rawLeads, currentUser]);

  const activities = useMemo(() => {
    if (currentUser && currentUser.role === "Sales Representative") {
      return rawActivities.filter(act => {
        const lead = rawLeads.find(l => l.id === act.leadId);
        return lead && lead.assignedTo?.toLowerCase() === currentUser.name?.toLowerCase();
      });
    }
    return rawActivities;
  }, [rawActivities, rawLeads, currentUser]);

  const stats = useMemo(() => {
    const totalLeads = leads.length;

    // Define what constitutes a "Closed Won" or Converted lead
    const isLeadWon = (lead) => {
      return (
        lead.status === "Closed Won" ||
        [
          "Grooming Completed",
          "Repeat Booking",
          "Training Active",
          "Active Customer",
          "Service Completed",
          "Policy Issued"
        ].includes(lead.stage)
      );
    };

    const wonLeads = leads.filter(isLeadWon);
    const totalWonCount = wonLeads.length;
    const jobsAssignedCount = leads.filter(l => l.assignedTo && l.assignedTo.trim() !== "").length;

    // Conversion %
    const conversionRate = totalLeads > 0 ? Math.round((totalWonCount / totalLeads) * 100) : 0;

    // Service Breakdown & Potential pipeline value vs Won Revenue
    const serviceBreakdown = {};
    const serviceRevenue = {};
    const serviceTotalPipeline = {};

    leads.forEach(lead => {
      const s = lead.service;
      serviceBreakdown[s] = (serviceBreakdown[s] || 0) + 1;
      serviceTotalPipeline[s] = (serviceTotalPipeline[s] || 0) + lead.value;
      if (isLeadWon(lead)) {
        serviceRevenue[s] = (serviceRevenue[s] || 0) + lead.value;
      }
    });

    // Formatted for Charts
    const leadsByServiceData = Object.keys(serviceBreakdown).map(s => ({
      name: s,
      value: serviceBreakdown[s]
    }));

    const revenueByServiceData = Object.keys(serviceTotalPipeline).map(s => ({
      name: s,
      pipeline: serviceTotalPipeline[s] || 0,
      revenue: serviceRevenue[s] || 0
    }));

    // Today's Date
    const TODAY = "2026-05-26";
    const todaysFws = followups.filter(fw => fw.date === TODAY && !fw.done);
    const overdueFws = followups.filter(fw => fw.date < TODAY && !fw.done);

    // Lead Source Analytics
    const sourceMap = {};
    leads.forEach(lead => {
      sourceMap[lead.source] = (sourceMap[lead.source] || 0) + 1;
    });
    const leadSourceData = Object.keys(sourceMap).map(src => ({
      name: src,
      value: sourceMap[src]
    }));

    // Top Performers Leaderboard (Calculated globally so representatives see peer benchmarking)
    const performerMap = {};
    
    // Seed performerMap with all active salespeople so they exist even with zero assigned leads
    (allUsers || []).forEach(user => {
      performerMap[user.name] = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        assigned: 0,
        won: 0,
        revenue: 0,
        totalValue: 0
      };
    });

    // Fill metrics using raw global leads list
    rawLeads.forEach(lead => {
      const rep = lead.assignedTo || "Unassigned";
      if (!performerMap[rep]) {
        performerMap[rep] = {
          id: "u_extra_" + rep.replace(/\s+/g, ""),
          name: rep,
          email: `${rep.toLowerCase().replace(/\s+/g, "")}@petsfolio.com`,
          role: "Sales Representative",
          assigned: 0,
          won: 0,
          revenue: 0,
          totalValue: 0
        };
      }
      performerMap[rep].assigned += 1;
      performerMap[rep].totalValue += lead.value;
      if (isLeadWon(lead)) {
        performerMap[rep].won += 1;
        performerMap[rep].revenue += lead.value;
      }
    });

    const performersList = Object.values(performerMap).map(p => {
      const convPct = p.assigned > 0 ? Math.round((p.won / p.assigned) * 100) : 0;
      // Get completion rate of follow-ups assigned to them
      const repFws = rawFollowups.filter(f => {
        const leadObj = rawLeads.find(l => l.id === f.leadId);
        return leadObj && leadObj.assignedTo === p.name;
      });
      const completedRepFws = repFws.filter(f => f.done).length;
      const fwCompletionPct = repFws.length > 0 ? Math.round((completedRepFws / repFws.length) * 100) : 80; // default average
      
      return {
        ...p,
        conversionRate: convPct,
        fwCompletionRate: fwCompletionPct,
        responseTime: p.assigned > 0 ? "2.4 hrs" : "--", // Mock response KPI
        activityScore: p.assigned > 0 ? Math.round(convPct * 0.6 + fwCompletionPct * 0.4) : 0
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const totalPipelineValue = leads.reduce((sum, l) => sum + l.value, 0);
    const totalWonRevenue = wonLeads.reduce((sum, l) => sum + l.value, 0);

    return {
      totalLeads,
      totalWonCount,
      conversionRate,
      leadsByServiceData,
      revenueByServiceData,
      totalPipelineValue,
      totalWonRevenue,
      jobsAssignedCount,
      todaysFollowupsCount: todaysFws.length,
      overdueFollowupsCount: overdueFws.length,
      leadSourceData,
      performersList,
      recentActivities: activities.slice(0, 10)
    };
  }, [leads, followups, activities, rawLeads, rawFollowups, allUsers]);

  return (
    <DashboardContext.Provider value={stats}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
