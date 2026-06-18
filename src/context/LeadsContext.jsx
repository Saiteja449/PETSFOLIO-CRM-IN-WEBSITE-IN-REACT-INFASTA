import React from "react";
import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants.js";
import { services, initialFollowups, initialActivities } from "../data.js";

const LeadsContext = createContext(null);

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.LEADS.BASE);
        const mappedLeads = response.data.map((lead) => ({
          ...lead,
          id: lead._id,
        }));
        setLeads(mappedLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, []);

  const [activeServices, setActiveServices] = useState(services);
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
  const addLead = async (leadData, author = "System") => {
    try {
      const response = await axios.post(API_ENDPOINTS.LEADS.BASE, leadData);
      const newLead = { ...response.data, id: response.data._id };
      setLeads((prev) => [newLead, ...prev]);

      addActivity(
        newLead.id,
        "Lead Created",
        `Lead was registered by ${author} for service "${leadData.service}"`,
        author,
      );

      // If there's a next follow-up date, automatically create a follow-up item
      if (leadData.nextFollowUp) {
        const newFw = {
          id: "fw_" + Date.now(),
          leadId: newLead.id,
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
      return newLead.id;
    } catch (error) {
      console.error("Error adding lead:", error);
      throw error;
    }
  };

  // Edit existing lead
  const updateLead = async (leadId, updatedFields, author = "System") => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.LEADS.BASE}/${leadId}`,
        updatedFields,
      );
      const updatedLead = { ...response.data, id: response.data._id };

      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === leadId) {
            // Detect changed fields to log activity
            const changes = [];
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
            return updatedLead;
          }
          return lead;
        }),
      );
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
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
  const deleteLead = async (leadId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.LEADS.BASE}/${leadId}`);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setFollowups((prev) => prev.filter((f) => f.leadId !== leadId));
      setActivities((prev) => prev.filter((a) => a.leadId !== leadId));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        setLeads,
        activeServices,
        followups,
        activities,
        addLead,
        updateLead,
        toggleServiceActive,
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
