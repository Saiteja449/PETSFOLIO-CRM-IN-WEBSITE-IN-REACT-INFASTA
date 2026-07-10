import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants.js";

const TargetsContext = createContext(null);

export function TargetsProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [repAssignments, setRepAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Templates ────────────────────────────────────────────────────────────

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_ENDPOINTS.TARGETS.TEMPLATES);
      setTemplates(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch target templates:", err);
      setError("Could not load target templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new template or update an existing one.
   * Pass `data` with an `_id` to update; omit `_id` to create.
   *
   * Template shape:
   * {
   *   categoryName: string,
   *   type: string,           // e.g. "Core Service" | "Recurring"
   *   description: string,
   *   tiers: {
   *     baseline: { callsPerDay: number, conversionPct: number, note: string },
   *     target:   { callsPerDay: number, conversionPct: number, note: string },
   *     star:     { callsPerDay: number, conversionPct: number, note: string },
   *   }
   * }
   */
  const saveTemplate = async (data) => {
    try {
      if (data._id) {
        // Update existing
        const res = await axios.put(
          API_ENDPOINTS.TARGETS.TEMPLATE(data._id),
          data
        );
        const updated = res.data.data || res.data;
        setTemplates((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        return updated;
      } else {
        // Create new
        const res = await axios.post(API_ENDPOINTS.TARGETS.TEMPLATES, data);
        const created = res.data.data || res.data;
        setTemplates((prev) => [...prev, created]);
        return created;
      }
    } catch (err) {
      console.error("Failed to save template:", err);
      throw new Error(
        err.response?.data?.message || "Failed to save template."
      );
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      await axios.delete(API_ENDPOINTS.TARGETS.TEMPLATE(templateId));
      setTemplates((prev) => prev.filter((t) => t._id !== templateId));
      // Also remove any assignments that reference this template
      setRepAssignments((prev) =>
        prev.filter((a) => a.templateId !== templateId)
      );
    } catch (err) {
      console.error("Failed to delete template:", err);
      throw new Error(
        err.response?.data?.message || "Failed to delete template."
      );
    }
  };

  // ─── Rep Assignments ──────────────────────────────────────────────────────

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.TARGETS.ASSIGNMENTS);
      setRepAssignments(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch rep assignments:", err);
    }
  }, []);

  /**
   * Assign a template to a rep for a given month.
   * Manager sets calls/day + conversion% per tier, per employee.
   *
   * @param {string} repId
   * @param {string} repName
   * @param {string} templateId
   * @param {{ baseline, target, star }} tiers  - { callsPerDay, conversionPct } per tier
   * @param {string} assignedMonth - "YYYY-MM"
   * @param {string} assignedBy    - manager name
   */
  const assignTemplate = async (
    repId,
    repName,
    templateId,
    tiers,
    assignedMonth,
    assignedBy
  ) => {
    try {
      const payload = { repId, repName, templateId, tiers, assignedMonth, assignedBy };
      const res = await axios.post(API_ENDPOINTS.TARGETS.ASSIGNMENTS, payload);
      const newAssignment = res.data.data || res.data;

      setRepAssignments((prev) => {
        const filtered = prev.filter(
          (a) => !(a.repId === repId && a.assignedMonth === assignedMonth)
        );
        return [...filtered, newAssignment];
      });
      return newAssignment;
    } catch (err) {
      console.error("Failed to assign template:", err);
      throw new Error(
        err.response?.data?.message || "Failed to assign target."
      );
    }
  };


  const removeAssignment = async (assignmentId) => {
    try {
      await axios.delete(API_ENDPOINTS.TARGETS.ASSIGNMENT(assignmentId));
      setRepAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
    } catch (err) {
      console.error("Failed to remove assignment:", err);
      throw new Error(
        err.response?.data?.message || "Failed to remove assignment."
      );
    }
  };

  /**
   * Get a rep's assignment for a specific month (derived — no extra API call).
   * Returns null if no assignment exists for that rep/month.
   */
  const getRepAssignment = (repId, month) => {
    return (
      repAssignments.find(
        (a) => a.repId === repId && a.assignedMonth === month
      ) || null
    );
  };

  /**
   * Resolve the full template object for a given assignment.
   * Returns null if template has been deleted.
   */
  const getTemplateForAssignment = (assignment) => {
    if (!assignment) return null;
    return templates.find((t) => t._id === assignment.templateId) || null;
  };

  return (
    <TargetsContext.Provider
      value={{
        templates,
        repAssignments,
        loading,
        error,
        fetchTemplates,
        fetchAssignments,
        saveTemplate,
        deleteTemplate,
        assignTemplate,
        removeAssignment,
        getRepAssignment,
        getTemplateForAssignment,
      }}
    >
      {children}
    </TargetsContext.Provider>
  );
}

export function useTargets() {
  const context = useContext(TargetsContext);
  if (!context) {
    throw new Error("useTargets must be used within a TargetsProvider");
  }
  return context;
}
