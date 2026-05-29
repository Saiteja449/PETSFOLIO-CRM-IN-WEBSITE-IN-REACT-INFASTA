import React from "react";
import { useState, createContext, useContext } from "react";
import {
  initialLeads,
  services,
  stages as initialStages,
  initialFollowups,
  initialActivities,
} from "../data.js";

const LeadsContext = createContext(null);

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeServices, setActiveServices] = useState(services);
  const [stages, setStages] = useState(initialStages);
  const [followups, setFollowups] = useState(initialFollowups);
  const [activities, setActivities] = useState(initialActivities);

  // Helper to add activity log entries
  const addActivity = (leadId, type, content, author = "System") => {
    const lead = leads.find((l) => l.id === leadId);
    const newActivity = {
      id: "act_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      leadId,
      leadName: lead ? lead.name : "Unknown",
      type,
      content,
      date: new Date().toISOString(),
      author,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Add a new lead
  const addLead = (leadData, author = "System") => {
    const newLeadId = "lead_" + Date.now();
    const newLead = {
      id: newLeadId,
      ...leadData,
      status: leadData.status || "New",
      createdAt: new Date().toISOString().split("T")[0],
      value: Number(leadData.value) || 100,
    };
    setLeads((prev) => [newLead, ...prev]);
    addActivity(
      newLeadId,
      "Lead Created",
      `Lead was registered by ${author} for service "${leadData.service}"`,
      author,
    );

    // If there's a next follow-up date, automatically create a follow-up item
    if (leadData.nextFollowUp) {
      const newFw = {
        id: "fw_" + Date.now(),
        leadId: newLeadId,
        leadName: leadData.name,
        petName: leadData.petName || "Pet",
        type: "Call", // Default helper
        date: leadData.nextFollowUp,
        time: "10:00 AM",
        priority: "Medium",
        done: false,
        notes: `Initial follow-up scheduled for ${leadData.name}`,
      };
      setFollowups((prev) => [newFw, ...prev]);
    }
    return newLeadId;
  };

  // Edit existing lead
  const updateLead = (leadId, updatedFields, author = "System") => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          // Detect changed fields to log activity
          const changes = [];
          if (updatedFields.stage && updatedFields.stage !== lead.stage) {
            changes.push(
              `stage from "${lead.stage}" to "${updatedFields.stage}"`,
            );
          }
          if (
            updatedFields.assignedTo &&
            updatedFields.assignedTo !== lead.assignedTo
          ) {
            changes.push(
              `assignee from "${lead.assignedTo}" to "${updatedFields.assignedTo}"`,
            );
          }
          if (updatedFields.status && updatedFields.status !== lead.status) {
            changes.push(`status to "${updatedFields.status}"`);
          }

          if (changes.length > 0) {
            addActivity(
              leadId,
              "Lead Edited",
              `Updated properties: ${changes.join(", ")} by ${author}`,
              author,
            );
          }
          return { ...lead, ...updatedFields };
        }
        return lead;
      }),
    );
  };

  // Move lead stage (designed specifically for drag & drop Kanban board)
  const updateLeadStage = (leadId, newStage, author = "System") => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          if (lead.stage !== newStage) {
            addActivity(
              leadId,
              "Stage Changed",
              `Status stage advanced from "${lead.stage}" to "${newStage}" by ${author}`,
              author,
            );
            return { ...lead, stage: newStage };
          }
        }
        return lead;
      }),
    );
  };

  // Toggle service enabled/disabled in Service Management
  const toggleServiceActive = (serviceCode) => {
    setActiveServices((prev) =>
      prev.map((s) => {
        if (s.code === serviceCode) {
          return { ...s, active: !s.active };
        }
        return s;
      }),
    );
  };

  // Add new stage to a service
  const addStage = (serviceName, stageName) => {
    setStages((prev) => {
      const currentStages = prev[serviceName] || [];
      if (currentStages.includes(stageName)) return prev; // Avoid duplicate stages
      return {
        ...prev,
        [serviceName]: [...currentStages, stageName],
      };
    });
  };

  // Edit an existing stage name in a service
  const editStage = (serviceName, oldStageName, newStageName) => {
    setStages((prev) => {
      const currentStages = prev[serviceName] || [];
      const updatedStages = currentStages.map((s) =>
        s === oldStageName ? newStageName : s,
      );
      return {
        ...prev,
        [serviceName]: updatedStages,
      };
    });

    // Mirror in existing leads
    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.service === serviceName && l.stage === oldStageName) {
          return { ...l, stage: newStageName };
        }
        return l;
      }),
    );
  };

  // Remove a stage and optionally remap leads to first stage
  const deleteStage = (serviceName, stageName) => {
    setStages((prev) => {
      const currentStages = prev[serviceName] || [];
      const updatedStages = currentStages.filter((s) => s !== stageName);
      return {
        ...prev,
        [serviceName]: updatedStages,
      };
    });

    // Remap leads in the deleted stage to the first stage of that service
    const remainingStages = stages[serviceName].filter((s) => s !== stageName);
    const fallbackStage = remainingStages[0] || "New Lead";

    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.service === serviceName && l.stage === stageName) {
          return { ...l, stage: fallbackStage };
        }
        return l;
      }),
    );
  };

  // Follow-ups management
  const addFollowup = (fwData) => {
    const newFw = {
      id: "fw_" + Date.now(),
      done: false,
      ...fwData,
    };
    setFollowups((prev) => [newFw, ...prev]);
    addActivity(
      fwData.leadId,
      "Follow-up Scheduled",
      `Follow-up schedule created: ${fwData.type} on ${fwData.date}`,
      fwData.author || "System",
    );
  };

  const toggleFollowupDone = (fwId) => {
    setFollowups((prev) =>
      prev.map((f) => {
        if (f.id === fwId) {
          const nextStatus = !f.done;
          addActivity(
            f.leadId,
            nextStatus ? "Follow-up Completed" : "Follow-up Reopened",
            `Completed follow-up via ${f.type}`,
          );
          return { ...f, done: nextStatus };
        }
        return f;
      }),
    );
  };

  // Delete a lead and its related records
  const deleteLead = (leadId) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setFollowups((prev) => prev.filter((f) => f.leadId !== leadId));
    setActivities((prev) => prev.filter((a) => a.leadId !== leadId));
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        setLeads,
        activeServices,
        stages,
        followups,
        activities,
        addLead,
        updateLead,
        updateLeadStage,
        toggleServiceActive,
        addStage,
        editStage,
        deleteStage,
        addActivity,
        addFollowup,
        toggleFollowupDone,
        deleteLead,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
