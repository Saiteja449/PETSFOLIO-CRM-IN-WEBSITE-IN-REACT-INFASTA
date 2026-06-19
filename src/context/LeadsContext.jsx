import React from "react";
import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants.js";
import { services } from "../data.js";

const LeadsContext = createContext(null);

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([]);

  const [activeServices, setActiveServices] = useState(services);
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, followupsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.LEADS.BASE),
          axios.get(API_ENDPOINTS.FOLLOWUPS.BASE),
        ]);
        setLeads(leadsRes.data);
        setFollowups(followupsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Add a new lead
  const addLead = async (leadData, author = "System") => {
    try {
      const response = await axios.post(API_ENDPOINTS.LEADS.BASE, leadData);
      const newLead = response.data;
      setLeads((prev) => [newLead, ...prev]);

      // If there's a next follow-up date, automatically create a follow-up item
      if (leadData.nextFollowUp) {
        await addFollowup({
          leadId: newLead.id,
          leadName: leadData.name,
          type: "Call", // Default helper
          date: leadData.nextFollowUp,
          time: "10:00 AM",
          priority: "Medium",
          notes: `Initial follow-up scheduled for ${leadData.name}`,
        });
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
      const updatedLead = response.data;

      const lead = leads.find((l) => l.id === leadId);
      if (lead) {
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
          if (updatedFields.status !== "Follow Up") {
            changes.push(`status to "${updatedFields.status}"`);
          }
        }

        if (changes.length > 0) {
          const now = new Date();
          addFollowup({
            leadId,
            leadName: lead.name,
            type: "Lead Edited",
            date: now.toISOString().split("T")[0],
            time: now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            priority: "Low",
            notes: `Updated properties: ${changes.join(", ")} by ${author}`,
            author,
            done: true,
          });
        }
      }

      setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
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
  const addFollowup = async (fwData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.FOLLOWUPS.BASE, {
        ...fwData,
        done: false,
      });
      setFollowups((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Error adding followup:", error);
    }
  };

  const toggleFollowupDone = async (fwId) => {
    const f = followups.find((f) => f.id === fwId);
    if (!f) return;
    const nextStatus = !f.done;

    try {
      const response = await axios.put(
        `${API_ENDPOINTS.FOLLOWUPS.BASE}/${fwId}`,
        { done: nextStatus },
      );
      setFollowups((prev) =>
        prev.map((item) => (item.id === fwId ? response.data : item)),
      );
    } catch (error) {
      console.error("Error updating followup:", error);
    }
  };

  // Delete a lead and its related records
  const deleteLead = async (leadId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.LEADS.BASE}/${leadId}`);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setFollowups((prev) => prev.filter((f) => f.leadId !== leadId));
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
        addLead,
        updateLead,
        toggleServiceActive,
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
