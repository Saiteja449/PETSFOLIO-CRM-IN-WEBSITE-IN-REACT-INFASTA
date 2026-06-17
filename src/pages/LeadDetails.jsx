import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Cat,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Plus,
  X,
  Circle,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useLeads } from "../context/LeadsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/helpers.js";

export default function LeadDetails() {
  const { allUsers, currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    leads,
    updateLead,
    updateLeadStage,
    stages,
    activities,
    followups,
    addFollowup,
    toggleFollowupDone,
    addActivity,
  } = useLeads();

  const currentLead = leads.find((l) => l.id === id);

  // Notes state
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(currentLead?.notes || "");

  // Update Lead Details Form form data
  const [formData, setFormData] = useState({
    status: currentLead?.status || "New",
    nextFollowUp: currentLead?.nextFollowUp || "",
    appointmentDate: currentLead?.appointmentDate || "",
    appointmentTime: currentLead?.appointmentTime || "",
    assignedTo: currentLead?.assignedTo || "",
    importantLead: currentLead?.importantLead || false,
    comments: "",
  });

  // Keep state sync if lead switches or refreshes
  useEffect(() => {
    if (currentLead) {
      setFormData({
        status: currentLead.status || "New",
        nextFollowUp: currentLead.nextFollowUp || "",
        appointmentDate: currentLead.appointmentDate || "",
        appointmentTime: currentLead.appointmentTime || "",
        assignedTo: currentLead.assignedTo || "",
        importantLead: currentLead.importantLead || false,
        comments: "",
      });
      setNotesText(currentLead.notes || "");
    }
  }, [currentLead]);

  // Add Followup Modal State
  const [followupOpen, setFollowupOpen] = useState(false);
  const [newFw, setNewFw] = useState({
    type: "Call",
    date: "2026-05-26",
    time: "11:00 AM",
    priority: "Medium",
    notes: "",
  });

  // Add Activity Modal State
  const [activityOpen, setActivityOpen] = useState(false);
  const [newAct, setNewAct] = useState({
    type: "Call Completed",
    content: "",
    author: currentUser?.name || "Alex Mercer",
  });

  if (!currentLead) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          Lead not found in the sales directory database.
        </div>
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-brand-primary rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <ArrowLeft size={18} />
          Back to Directory
        </button>
      </div>
    );
  }

  // Filter activities and followups related to this single lead
  const leadActivities = activities.filter((a) => a.leadId === currentLead.id);
  const leadFollowups = followups.filter((f) => f.leadId === currentLead.id);

  const [followupType, setFollowupType] = useState("Call");

  // Move stage directly
  const handleStageChange = (e) => {
    const nextStg = e.target.value;
    updateLeadStage(currentLead.id, nextStg, currentUser?.name || "System");
  };

  // Move Status directly
  const handleStatusChange = (e) => {
    const nextStatus = e.target.value;
    updateLead(
      currentLead.id,
      { status: nextStatus },
      currentUser?.name || "System",
    );
  };

  // Change assignee directly
  const handleAssigneeChange = (e) => {
    const nextAssignee = e.target.value;
    updateLead(
      currentLead.id,
      { assignedTo: nextAssignee },
      currentUser?.name || "System",
    );
  };

  // Handle lead form submit
  const handleUpdateLeadFormSubmit = (e) => {
    e.preventDefault();

    if (formData.status === "Follow Up" && !formData.nextFollowUp) {
      alert("Please supply a valid Follow Up Date.");
      return;
    }

    const updatedFields = {
      status: formData.status,
      nextFollowUp: formData.nextFollowUp,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      assignedTo: formData.assignedTo,
      importantLead: formData.importantLead,
    };

    // Append comments to internal requirements logs
    if (formData.comments) {
      updatedFields.notes = currentLead.notes
        ? currentLead.notes + "\n" + formData.comments
        : formData.comments;
      setNotesText(updatedFields.notes);
    }

    const authorName = currentUser?.name || "System";
    updateLead(currentLead.id, updatedFields, authorName);

    // If "Follow Up" is selected, automatically schedule a follow-up task
    if (formData.status === "Follow Up") {
      addFollowup({
        leadId: currentLead.id,
        leadName: currentLead.name,

        type: followupType,
        date: formData.nextFollowUp,
        time: formData.appointmentTime || "11:00 AM",
        priority: formData.importantLead ? "High" : "Medium",
        notes:
          formData.comments || `Routine followup scheduled via ${followupType}`,
        author: authorName,
      });
    }

    // Also record it under historical timeline activities
    if (formData.comments) {
      addActivity(
        currentLead.id,
        "Comment Added",
        formData.comments,
        authorName,
      );
    }

    // Reset local comments box after submitting
    setFormData((prev) => ({ ...prev, comments: "" }));
    alert("Customer lead records were updated successfully.");
  };

  // Save general profile notes
  const handleSaveNotes = () => {
    updateLead(
      currentLead.id,
      { notes: notesText },
      currentUser?.name || "Alex Mercer",
    );
    setEditingNotes(false);
  };

  // Save rescheduled follow up
  const handleSaveFollowup = (e) => {
    e.preventDefault();
    addFollowup({
      leadId: currentLead.id,
      leadName: currentLead.name,

      type: newFw.type,
      date: newFw.date,
      time: newFw.time,
      priority: newFw.priority,
      notes: newFw.notes,
      author: currentUser?.name || "Alex Mercer",
    });
    // Record as lead's next follow up date
    updateLead(currentLead.id, { nextFollowUp: newFw.date });
    setFollowupOpen(false);
    setNewFw({
      type: "Call",
      date: "2026-05-26",
      time: "11:00 AM",
      priority: "Medium",
      notes: "",
    });
  };

  // Log active sales interaction
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!newAct.content) {
      alert("Please provide the activity details content.");
      return;
    }
    addActivity(currentLead.id, newAct.type, newAct.content, newAct.author);
    setActivityOpen(false);
    setNewAct({
      type: "Call Completed",
      content: "",
      author: currentUser?.name || "Alex Mercer",
    });
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Follow Up":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Not Interested":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Joined":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-brand-secondary/30 text-brand-primary border-brand-secondary";
    }
  };

  const getSourceBg = (source) => {
    return "bg-brand-secondary/30/50 text-brand-primary/70 border-brand-secondary";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={() => navigate("/leads")}
        className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors font-medium mb-2"
      >
        <ArrowLeft size={18} />
        Back to Customer List
      </button>

      <div className="flex flex-col gap-6">
        {/* 1. Lead Primary Profile Card */}
        <div className="bg-brand-light border border-brand-secondary rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-brand-primary flex items-center justify-center font-bold text-xl shrink-0">
              {currentLead.name
                ? currentLead.name.substring(0, 1).toUpperCase()
                : "C"}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-brand-primary truncate">
                {currentLead.name}
              </h2>
              <p className="text-sm text-brand-primary/70 truncate">
                Registered on {formatDate(currentLead.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBg(currentLead.status)}`}
            >
              {currentLead.status}
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getSourceBg(currentLead.source)}`}
            >
              {currentLead.source}
            </span>
          </div>

          <hr className="border-brand-secondary mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Phone className="text-brand-primary/70 mt-0.5" size={18} />
              <div className="min-w-0">
                <span className="text-xs text-brand-primary/70 block mb-0.5">
                  Client Phone
                </span>
                <span className="text-sm font-semibold text-brand-primary truncate block">
                  {currentLead.phone}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-brand-primary/70 mt-0.5" size={18} />
              <div className="min-w-0">
                <span className="text-xs text-brand-primary/70 block mb-0.5">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-brand-primary truncate block">
                  {currentLead.email || "No email profile"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="text-brand-primary/70 mt-0.5" size={18} />
              <div className="min-w-0">
                <span className="text-xs text-brand-primary/70 block mb-0.5">
                  Sales Representative
                </span>
                {currentUser?.role === "Sales Manager" ? (
                  <select
                    value={currentLead.assignedTo || ""}
                    onChange={handleAssigneeChange}
                    className="bg-brand-light border border-brand-secondary text-sm font-semibold text-brand-primary rounded px-2 py-1 focus:outline-none focus:border-teal-500 cursor-pointer w-full max-w-[200px]"
                  >
                    <option value="">Unassigned</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm font-semibold text-brand-primary truncate block">
                    {currentLead.assignedTo}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-brand-primary/70 mt-0.5" size={18} />
              <div className="min-w-0">
                <span className="text-xs text-brand-primary/70 block mb-0.5">
                  City
                </span>
                <span className="text-sm font-semibold text-brand-primary truncate block">
                  {currentLead.city || "Not specified"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="text-brand-primary/70 mt-0.5" size={18} />
              <div className="min-w-0">
                <span className="text-xs text-brand-primary/70 block mb-0.5">
                  Preferred Contact
                </span>
                <span className="text-sm font-semibold text-brand-primary truncate block">
                  {currentLead.preferredContactMethod || "Not specified"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-brand-primary/70 mt-0.5" size={18} />
              <div className="min-w-0">
                <span className="block text-xs text-brand-primary/70 mb-1">
                  Enquired On
                </span>
                <span className="text-sm font-semibold text-brand-primary truncate block">
                  {currentLead.joinedAt
                    ? formatDate(currentLead.joinedAt)
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Special Requirements & Logged Notes */}
        <div className="bg-brand-light border border-brand-secondary rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-brand-primary">
              Special Requirements & Logged Notes
            </h3>
            {editingNotes ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingNotes(false);
                    setNotesText(currentLead.notes || "");
                  }}
                  className="px-3 py-1 text-sm text-brand-primary/70 hover:text-brand-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-brand-primary rounded-md transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingNotes(true)}
                className="px-3 py-1 text-sm border border-brand-secondary text-brand-primary hover:bg-brand-secondary/30 rounded-md transition-colors"
              >
                Edit Notes
              </button>
            )}
          </div>

          {editingNotes ? (
            <textarea
              className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 min-h-[100px] outline-none"
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
            />
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-orange italic whitespace-pre-wrap leading-relaxed">
                {currentLead.notes ||
                  "No operational context or requirements notes logged. Click 'Edit' to update."}
              </p>
            </div>
          )}
        </div>

        {/* 3. Update Lead Details Form */}
        <div className="bg-brand-light border border-brand-secondary rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-brand-secondary bg-brand-light/50">
            <h3 className="font-bold text-brand-primary">Update Lead Details</h3>
          </div>
          <div className="p-5">
            <form onSubmit={handleUpdateLeadFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  className={
                    formData.status === "Follow Up"
                      ? "sm:col-span-1"
                      : "sm:col-span-1"
                  }
                >
                  <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                    Lead Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Not Responding">Not Responding</option>
                    <option value="Price Issue">Price Issue</option>
                    <option value="Joined">Joined</option>
                    <option value="Job Posted">Job Posted</option>
                  </select>
                </div>

                {/* Follow Up Type */}
                {formData.status === "Follow Up" && (
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                      Follow Up Type
                    </label>
                    <select
                      value={followupType}
                      onChange={(e) => setFollowupType(e.target.value)}
                      className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                    >
                      <option value="Call">Phone Call</option>
                      <option value="WhatsApp">WhatsApp Message</option>
                      <option value="Email">Email Communication</option>
                      <option value="Meeting">Direct Meeting</option>
                      <option value="Consultation">
                        Consultation Assessment
                      </option>
                    </select>
                  </div>
                )}

                {formData.status === "Follow Up" && (
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                      Follow Up Date
                    </label>
                    <input
                      type="date"
                      value={formData.nextFollowUp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nextFollowUp: e.target.value,
                        })
                      }
                      className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                )}

                <div className="sm:col-span-1 flex items-center lg:col-span-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.importantLead)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            importantLead: e.target.checked,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-brand-secondary rounded bg-brand-light peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors flex items-center justify-center">
                        <CheckCircle
                          className="w-3.5 h-3.5 text-brand-light opacity-0 peer-checked:opacity-100"
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-brand-primary group-hover:text-brand-primary transition-colors">
                      🔥 Important Hot Lead
                    </span>
                  </label>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                    Comments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Type customer call summary, special requests, or latest requirement updates here..."
                    value={formData.comments}
                    onChange={(e) =>
                      setFormData({ ...formData, comments: e.target.value })
                    }
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 resize-y outline-none"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Submit Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* 4. Upcoming Followups schedule */}
        {currentLead.status === "Follow Up" && (
          <div className="bg-brand-light border border-teal-500/30 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-teal-500">
                  Follow-Up History & Communications Logs
                </h3>
              </div>

              <div className="space-y-3">
                {leadFollowups.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-brand-secondary rounded-lg">
                    <p className="text-sm text-brand-primary/70">
                      No follow-up reminders scheduled yet.
                    </p>
                  </div>
                )}
                {leadFollowups.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 bg-brand-light border border-brand-secondary rounded-xl flex justify-between items-start"
                  >
                    <div className="flex gap-4 items-start w-full">
                      <div className="min-w-0 flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="text-sm font-bold text-brand-primary">
                            {f.type} Engagement Channel
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              f.priority === "High"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : f.priority === "Medium"
                                  ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                  : "bg-brand-secondary/30 text-brand-primary/70 border border-brand-secondary"
                            }`}
                          >
                            {f.priority}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-brand-primary/70 mb-2">
                          <Calendar size={14} />
                          <span>
                            Scheduled: {formatDate(f.date)} • {f.time}
                          </span>
                        </div>

                        <p className="text-sm italic text-brand-primary mb-3">
                          "{f.notes}"
                        </p>

                        <hr className="border-brand-secondary mb-3" />

                        <div className="text-xs font-bold text-teal-500 flex items-center gap-1.5">
                          <User size={12} />
                          Followed up by:{" "}
                          {f.author || currentLead.assignedTo || "System"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals/Dialogs */}
      {followupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-light/50 backdrop-blur-sm">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-brand-secondary">
              <h3 className="font-bold text-brand-primary text-lg">
                Schedule Agenda Follow-up
              </h3>
              <button
                onClick={() => setFollowupOpen(false)}
                className="text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <form
                id="schedule-form"
                onSubmit={handleSaveFollowup}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                    Task Type
                  </label>
                  <select
                    value={newFw.type}
                    onChange={(e) =>
                      setNewFw({ ...newFw, type: e.target.value })
                    }
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  >
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Email">Email Communication</option>
                    <option value="Meeting">Direct Meeting</option>
                    <option value="Consultation">
                      Consultation Assessment
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newFw.date}
                      onChange={(e) =>
                        setNewFw({ ...newFw, date: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                      Due Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11:30 AM"
                      value={newFw.time}
                      onChange={(e) =>
                        setNewFw({ ...newFw, time: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                    Priority level
                  </label>
                  <select
                    value={newFw.priority}
                    onChange={(e) =>
                      setNewFw({ ...newFw, priority: e.target.value })
                    }
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                    Action Agenda Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newFw.notes}
                    onChange={(e) =>
                      setNewFw({ ...newFw, notes: e.target.value })
                    }
                    className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 resize-y outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFollowupOpen(false)}
                className="px-4 py-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="schedule-form"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-brand-light text-sm font-bold rounded-lg transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
