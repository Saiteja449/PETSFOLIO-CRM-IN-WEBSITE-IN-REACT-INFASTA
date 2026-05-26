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
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
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
        petName: currentLead.petName || "Pet",
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
      petName: currentLead.petName,
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
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const getSourceBg = (source) => {
    return "bg-zinc-800/50 text-zinc-400 border-zinc-700";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={() => navigate("/leads")}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium mb-2"
      >
        <ArrowLeft size={18} />
        Back to Customer List
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-6">
          {/* Lead Primary Profile Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
                {currentLead.name
                  ? currentLead.name.substring(0, 1).toUpperCase()
                  : "C"}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">
                  {currentLead.name}
                </h2>
                <p className="text-sm text-zinc-400 truncate">
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

            <hr className="border-zinc-800 mb-5" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="text-zinc-500 mt-0.5" size={18} />
                <div className="min-w-0">
                  <span className="text-xs text-zinc-500 block mb-0.5">
                    Client Phone
                  </span>
                  <span className="text-sm font-semibold text-zinc-200 truncate block">
                    {currentLead.phone}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-zinc-500 mt-0.5" size={18} />
                <div className="min-w-0">
                  <span className="text-xs text-zinc-500 block mb-0.5">
                    Email Address
                  </span>
                  <span className="text-sm font-semibold text-zinc-200 truncate block">
                    {currentLead.email || "No email profile"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-zinc-500 mt-0.5" size={18} />
                <div className="min-w-0">
                  <span className="text-xs text-zinc-500 block mb-0.5">
                    Sales Representative
                  </span>
                  <span className="text-sm font-semibold text-zinc-200 truncate block">
                    {currentLead.assignedTo}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-zinc-500 mt-0.5" size={18} />
                <div className="min-w-0">
                  <span className="text-xs text-zinc-500 block mb-0.5">
                    City
                  </span>
                  <span className="text-sm font-semibold text-zinc-200 truncate block">
                    {currentLead.city || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="text-zinc-500 mt-0.5" size={18} />
                <div className="min-w-0">
                  <span className="text-xs text-zinc-500 block mb-0.5">
                    Preferred Contact
                  </span>
                  <span className="text-sm font-semibold text-zinc-200 truncate block">
                    {currentLead.preferredContactMethod || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Lead Details Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="font-bold text-white">Update Lead Details</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleUpdateLeadFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={
                      formData.status === "Follow Up"
                        ? "sm:col-span-2"
                        : "sm:col-span-2"
                    }
                  >
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Lead Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Not Responding">Not Responding</option>
                      <option value="Price Issue">Price Issue</option>
                      <option value="Joined">Joined</option>
                      <option value="Job Posted">Job Posted</option>
                      <option value="Job Assigned">Job Assigned</option>
                    </select>
                  </div>

                  {/* Follow Up Type */}
                  {formData.status === "Follow Up" && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Follow Up Type
                      </label>
                      <select
                        value={followupType}
                        onChange={(e) => setFollowupType(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
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
                    <div
                      className={
                        formData.status === "Follow Up"
                          ? "sm:col-span-2"
                          : "sm:col-span-2"
                      }
                    >
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
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
                        className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2 flex items-center">
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
                        <div className="w-5 h-5 border-2 border-zinc-700 rounded bg-zinc-950 peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors flex items-center justify-center">
                          <CheckCircle
                            className="w-3.5 h-3.5 text-zinc-950 opacity-0 peer-checked:opacity-100"
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                        🔥 Important Hot Lead
                      </span>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Comments
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Type customer call summary, special requests, or latest requirement updates here..."
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({ ...formData, comments: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 resize-y outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Cat className="text-teal-500" size={20} /> Registered Pet Sheet
            </h3>
            <div className="flex flex-col gap-3 bg-zinc-950 p-4 rounded-lg">
              <div>
                <span className="text-xs text-zinc-500 block mb-0.5">
                  Animal Name
                </span>
                <span className="text-sm font-bold text-zinc-200">
                  {currentLead.petName || "Not described"}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-0.5">
                  Breed Spec
                </span>
                <span className="text-sm font-bold text-zinc-200">
                  {currentLead.petBreed || "Not described"}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-0.5">
                  Age Tier
                </span>
                <span className="text-sm font-bold text-zinc-200">
                  {currentLead.petAge || "Not described"}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-0.5">
                  Weight
                </span>
                <span className="text-sm font-bold text-zinc-200">
                  {currentLead.petWeight || "Not described"}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-0.5">
                  Medical Conditions
                </span>
                <span className="text-sm font-bold text-zinc-200">
                  {currentLead.petMedicalConditions || "Not described"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-zinc-200">
                Special Requirements & Logged Notes
              </h3>
              {editingNotes ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNotes(false);
                      setNotesText(currentLead.notes || "");
                    }}
                    className="px-3 py-1 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="px-3 py-1 text-sm border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
                >
                  Edit Notes
                </button>
              )}
            </div>

            {editingNotes ? (
              <textarea
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 min-h-[100px] outline-none"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-sm text-amber-200/80 italic whitespace-pre-wrap leading-relaxed">
                  {currentLead.notes ||
                    "No operational context or requirements notes logged. Click 'Edit' to update."}
                </p>
              </div>
            )}
          </div>

          {/* Upcoming Followups schedule */}
          {currentLead.status === "Follow Up" && (
            <div className="bg-zinc-950 border border-teal-500/30 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-teal-500">
                    Follow-Up History & Communications Logs
                  </h3>
                  <button
                    onClick={() => setFollowupOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-teal-500 border border-teal-500/50 hover:bg-teal-500/10 rounded-lg transition-colors"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Schedule Task
                  </button>
                </div>

                <div className="space-y-3">
                  {leadFollowups.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-500">
                        No follow-up reminders scheduled yet.
                      </p>
                    </div>
                  )}
                  {leadFollowups.map((f) => (
                    <div
                      key={f.id}
                      className={`p-4 rounded-xl border flex justify-between items-start ${f.done ? "bg-zinc-900 border-zinc-800" : "bg-zinc-900/60 border-zinc-700"}`}
                    >
                      <div className="flex gap-4 items-start w-full">
                        <button
                          onClick={() => toggleFollowupDone(f.id)}
                          className="mt-0.5 shrink-0 text-zinc-500 hover:text-blue-500 focus:outline-none"
                        >
                          {f.done ? (
                            <CheckCircle
                              className="text-emerald-500"
                              size={24}
                            />
                          ) : (
                            <Circle size={24} />
                          )}
                        </button>
                        <div className="min-w-0 flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h4
                              className={`text-sm font-bold ${f.done ? "line-through text-zinc-500" : "text-white"}`}
                            >
                              {f.type} Engagement Channel
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                f.priority === "High"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : f.priority === "Medium"
                                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                              }`}
                            >
                              {f.priority}
                            </span>
                            {f.done ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                Pending Action
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
                            <Calendar size={14} />
                            <span>
                              Scheduled: {formatDate(f.date)} • {f.time}
                            </span>
                          </div>

                          <p
                            className={`text-sm italic mb-3 ${f.done ? "text-zinc-500" : "text-zinc-300"}`}
                          >
                            "{f.notes}"
                          </p>

                          <hr className="border-zinc-800 mb-3" />

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

          {/* Activities Chronology Log list */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white">
                Historical Action & Audit Trail
              </h3>
              <button
                onClick={() => setActivityOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white border border-zinc-700 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Log Interaction
              </button>
            </div>

            <div className="space-y-3">
              {leadActivities.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-zinc-500">
                    No audit events logged. Click "Log Interaction" to begin.
                  </p>
                </div>
              )}
              {leadActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white">{act.type}</h4>
                    <span className="text-xs text-zinc-500">
                      {formatDate(act.date)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
                    {act.content}
                  </p>
                  <div className="text-xs text-teal-500 font-medium">
                    Logged by: {act.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals/Dialogs */}
      {followupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className="font-bold text-white text-lg">
                Schedule Agenda Follow-up
              </h3>
              <button
                onClick={() => setFollowupOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
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
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Task Type
                  </label>
                  <select
                    value={newFw.type}
                    onChange={(e) =>
                      setNewFw({ ...newFw, type: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
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
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newFw.date}
                      onChange={(e) =>
                        setNewFw({ ...newFw, date: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Due Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11:30 AM"
                      value={newFw.time}
                      onChange={(e) =>
                        setNewFw({ ...newFw, time: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Priority level
                  </label>
                  <select
                    value={newFw.priority}
                    onChange={(e) =>
                      setNewFw({ ...newFw, priority: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Action Agenda Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newFw.notes}
                    onChange={(e) =>
                      setNewFw({ ...newFw, notes: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 resize-y outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFollowupOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="schedule-form"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-zinc-950 text-sm font-bold rounded-lg transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {activityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className="font-bold text-white text-lg">
                Log Sales Interaction Event
              </h3>
              <button
                onClick={() => setActivityOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <form
                id="activity-form"
                onSubmit={handleSaveActivity}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Action Topic
                  </label>
                  <select
                    value={newAct.type}
                    onChange={(e) =>
                      setNewAct({ ...newAct, type: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  >
                    <option value="Call Completed">
                      Call Completed Successfully
                    </option>
                    <option value="Email Dispatched">Email Dispatched</option>
                    <option value="WhatsApp Communication">
                      WhatsApp Logged
                    </option>
                    <option value="Physical Consultation Conducted">
                      Physical Consultation
                    </option>
                    <option value="Negotiation Conducted">
                      Price Negotiation Session
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Core Discussion Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newAct.content}
                    onChange={(e) =>
                      setNewAct({ ...newAct, content: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 resize-y outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Representative
                  </label>
                  <select
                    value={newAct.author}
                    onChange={(e) =>
                      setNewAct({ ...newAct, author: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActivityOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="activity-form"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-zinc-950 text-sm font-bold rounded-lg transition-colors"
              >
                Log Interaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
