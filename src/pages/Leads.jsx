import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Eye,
  X,
  PawPrint,
  User,
  Phone,
  Calendar,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useLeads } from "../context/LeadsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatDate,
  getStageColor,
  getServiceColor,
  getStatusColor,
  getSourceColor,
  filterLeads,
} from "../utils/helpers.js";

// Helper components for UI
const Badge = ({ children, colorClass, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colorClass} ${className}`}
  >
    {children}
  </span>
);

export default function Leads() {
  const navigate = useNavigate();
  const { leads, addLead, updateLead, deleteLead, stages, activeServices } =
    useLeads();
  const { allUsers, currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [service, setService] = useState("All");
  const [stage, setStage] = useState("All");
  const [salesperson, setSalesperson] = useState("All");
  const [status, setStatus] = useState("All");
  const [leadTypeTab, setLeadTypeTab] = useState("New");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const defaultFormFields = {
    name: "",
    phone: "",
    email: "",
    source: "Manual Entry",
    service: "Grooming",
    stage: "New Lead",
    assignedTo: currentUser?.name || "Alex Mercer",
    nextFollowUp: "2026-05-26",
    status: "New",
    leadType: "Client",
    notes: "",
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [deleteId, setDeleteId] = useState(null);

  const salespeople = (allUsers || []).map((u) => u.name);
  const sources = [
    "Email",
    "WhatsApp",
    "Meta Ads",
    "Website Form",
    "Call",
    "Manual Entry",
  ];

  const viewableLeads =
    currentUser && currentUser.role === "Sales Representative"
      ? leads.filter(
          (l) =>
            l.assignedTo?.toLowerCase() === currentUser.name?.toLowerCase(),
        )
      : leads;

  const rawProcessedLeads = filterLeads(viewableLeads, {
    search,
    service,
    stage,
    salesperson,
    status,
  });

  const newCount = rawProcessedLeads.filter(
    (l) => l.status?.toLowerCase() === "new",
  ).length;
  const followupCount = rawProcessedLeads.filter(
    (l) => l.status?.toLowerCase() === "follow up",
  ).length;
  const convertedCount = rawProcessedLeads.filter(
    (l) => l.status?.toLowerCase() === "joined",
  ).length;
  const notAttendedCount = rawProcessedLeads.filter((l) => {
    return l.status?.toLowerCase() === "not attended";
  }).length;
  
  const lostCount = rawProcessedLeads.filter((l) => {
    const s = l.status?.toLowerCase();
    return s === "price issue" || s === "not responding" || s === "not answered";
  }).length;

  const processedLeads = rawProcessedLeads.filter((lead) => {
    const s = lead.status?.toLowerCase() || "";
    if (leadTypeTab === "New") return s === "new";
    if (leadTypeTab === "Followup") return s === "follow up";
    if (leadTypeTab === "Converted") return s === "joined";
    if (leadTypeTab === "Lost")
      return s === "price issue" || s === "not responding" || s === "not answered";
    if (leadTypeTab === "NotAttended")
      return s === "not attended";
    return true;
  });

  const totalPages = Math.ceil(processedLeads.length / rowsPerPage);

  const handleOpenAdd = () => {
    setFormFields(defaultFormFields);
    setAddOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formFields.name || !formFields.phone || !formFields.service) {
      alert(
        "Please fill in main credentials (Customer Name, Phone, and chosen Service)",
      );
      return;
    }
    const toSave = { ...formFields, status: formFields.status || "New" };
    addLead(toSave, currentUser?.name || "System");
    setAddOpen(false);
  };

  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setFormFields({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      source: lead.source,
      service: lead.service,
      stage: lead.stage,
      assignedTo: lead.assignedTo,
      nextFollowUp: lead.nextFollowUp || "",
      status: lead.status || "New",
      leadType: lead.leadType || "Client",
      notes: lead.notes || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateLead(selectedLead.id, formFields, currentUser?.name || "System");
    setEditOpen(false);
    if (selectedLead ) {
      setSelectedLead({ ...selectedLead, ...formFields });
    }
  };

 

  // Convert MUI color keywords to Tailwind classes
  const getTwStatusColor = (statusName) => {
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

  const getTwStageColor = (stageName) => {
    const s = stageName?.toLowerCase() || "";
    if (s.includes("new"))
      return "bg-teal-500/10 text-teal-500 border border-teal-500/20";
    if (s.includes("contacted") || s.includes("discuss"))
      return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    if (s.includes("trial") || s.includes("meeting"))
      return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
    if (s.includes("won") || s.includes("joined") || s.includes("hired"))
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    if (s.includes("lost"))
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    return "bg-brand-secondary/40 text-brand-primary/70 border border-brand-secondary/50";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-primary tracking-tight">
            Leads Management Directory
          </h1>
          <p className="text-sm text-brand-primary/70 mt-1">
            Query, manage, schedule, and configure customer entry profiles.
          </p>
        </div>
        {currentUser?.role !== "Sales Representative" && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Lead
          </button>
        )}
      </div>

      <div className="border-b border-brand-secondary flex overflow-x-auto no-scrollbar">
        {[
          { name: "New", label: "New Leads", count: newCount },
          { name: "Followup", label: "Followup Leads", count: followupCount },
          { name: "Converted", label: "Converted Leads", count: convertedCount },
          { name: "Lost", label: "Lost Leads", count: lostCount },
          { name: "NotAttended", label: "Not Attended", count: notAttendedCount },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setLeadTypeTab(tab.name);
              setPage(0);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              leadTypeTab === tab.name
                ? "border-teal-500 text-teal-500"
                : "border-transparent text-brand-primary/70 hover:text-brand-primary hover:border-brand-secondary"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                leadTypeTab === tab.name
                  ? "bg-teal-500/20 text-teal-500"
                  : "bg-brand-secondary/30 text-brand-primary/70"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-brand-light border border-brand-secondary rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/70" />
            <input
              type="text"
              placeholder="Search name, phone, pet, breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-brand-light border border-brand-secondary rounded-lg text-sm text-brand-primary focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Service Filter */}
          <div className="md:col-span-2">
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setStage("All");
              }}
              className="w-full px-3 py-2 bg-brand-light border border-brand-secondary rounded-lg text-sm text-brand-primary focus:outline-none focus:border-teal-500 transition-colors appearance-none"
            >
              <option value="All">All Services</option>
              {activeServices.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="md:col-span-2">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 bg-brand-light border border-brand-secondary rounded-lg text-sm text-brand-primary focus:outline-none focus:border-teal-500 transition-colors appearance-none"
            >
              <option value="All">All Stages</option>
              {service !== "All" &&
                stages[service]?.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
            </select>
          </div> */}

          <div className="md:col-span-2">
            <select
              value={salesperson}
              onChange={(e) => setSalesperson(e.target.value)}
              className="w-full px-3 py-2 bg-brand-light border border-brand-secondary rounded-lg text-sm text-brand-primary focus:outline-none focus:border-teal-500 transition-colors appearance-none"
            >
              <option value="All">All Reps</option>
              {salespeople.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-brand-light border border-brand-secondary rounded-lg text-sm text-brand-primary focus:outline-none focus:border-teal-500 transition-colors appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Not Responding">Not Responding</option>
              <option value="Price Issue">Price Issue</option>
              <option value="Joined">Joined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Result Area */}
      {processedLeads.length === 0 ? (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl p-12 text-center">
          <PawPrint className="w-16 h-16 text-brand-primary/70 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-primary">
            No Leads Matching Query
          </h3>
          <p className="text-sm text-brand-primary/70 mt-1">
            Try adjusting your search criteria or add filters to see results.
          </p>
        </div>
      ) : (
        <div className="bg-brand-light border border-brand-secondary rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-brand-light border-b border-brand-secondary">
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Service
                  </th>

                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Assigned to
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Joined At
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider text-right">
                    Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-secondary">
                {processedLeads
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-brand-secondary/30/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/lead-details/${lead.id}`)
                              }
                              className="text-sm font-bold text-teal-400 hover:text-teal-300 hover:underline text-left"
                            >
                              {lead.name}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-primary">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          colorClass="bg-brand-secondary/30 text-brand-primary border border-brand-secondary"
                          className="font-medium"
                        >
                          {lead.source}
                        </Badge>
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
                      <td className="px-4 py-3 text-sm text-brand-primary">
                        {lead.assignedTo || "Unassigned"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {lead.joinedAt ? (
                          <div
                            className={`flex items-center gap-1.5 ${
                              lead.joinedAt < "2026-05-26"
                                ? "text-red-400"
                                : "text-brand-primary/70"
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(lead.joinedAt)}
                          </div>
                        ) : (
                          <span className="text-brand-primary/70">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          colorClass={getTwStatusColor(lead.status || "New")}
                        >
                          {lead.status || "New"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                         
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="p-1.5 text-brand-primary/70 hover:text-brand-primary hover:bg-brand-secondary/30 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/lead-details/${lead.id}`)}
                            className="p-1.5 text-teal-500 hover:text-teal-400 hover:bg-teal-500/10 rounded transition-colors"
                            title="Open Detail"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          {currentUser?.role !== "Sales Representative" && (
                            <button
                              onClick={() => setDeleteId(lead.id)}
                              className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-brand-secondary flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-brand-primary/70">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-brand-light border border-brand-secondary rounded px-2 py-1 focus:outline-none focus:border-teal-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4 text-sm text-brand-primary/70">
              <span>
                {page * rowsPerPage + 1}-
                {Math.min((page + 1) * rowsPerPage, processedLeads.length)} of{" "}
                {processedLeads.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-2 py-1 hover:bg-brand-secondary/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-2 py-1 hover:bg-brand-secondary/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {/* {drawerOpen && selectedLead && (
        <>
          <div
            className="fixed inset-0 bg-brand-light/50 z-40"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-brand-light border-l border-brand-secondary z-50 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-brand-secondary flex justify-between items-center bg-brand-light/50">
              <div>
                <h3 className="font-bold text-brand-primary">Client Quick Review</h3>
                <p className="text-xs text-brand-primary/70">
                  Lead ID: {selectedLead.id}
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-brand-primary/70 hover:text-brand-primary rounded-full hover:bg-brand-secondary/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-brand-light font-bold text-xl">
                  {selectedLead.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-brand-primary">
                    {selectedLead.name}
                  </h4>
                  <Badge colorClass={getTwStatusColor(selectedLead.status)}>
                    {selectedLead.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-brand-primary/70 mb-1">
                    Contact Phone
                  </span>
                  <span className="font-semibold text-brand-primary">
                    {selectedLead.phone}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-brand-primary/70 mb-1">
                    Contact Email
                  </span>
                  <span className="font-semibold text-brand-primary truncate block">
                    {selectedLead.email || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-brand-primary/70 mb-1">
                    Lead Source
                  </span>
                  <span className="font-semibold text-brand-primary">
                    {selectedLead.source}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-brand-primary/70 mb-1">
                    Service Interest
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getServiceColor(selectedLead.service),
                      }}
                    ></div>
                    <span className="font-bold text-brand-primary">
                      {selectedLead.service}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-brand-primary/70 mb-1">
                    Assigned Manager
                  </span>
                  <span className="font-semibold text-brand-primary">
                    {selectedLead.assignedTo}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-brand-primary/70 mb-1">
                    Joined At
                  </span>
                  <span className="font-semibold text-brand-primary">
                    {selectedLead.joinedAt
                      ? formatDate(selectedLead.joinedAt)
                      : "-"}
                  </span>
                </div>
              </div>

              <hr className="border-brand-secondary" />

              <div>
                <h5 className="flex items-center gap-2 font-bold text-brand-primary mb-3">
                  <PawPrint className="w-4 h-4" /> Registered Pet Metadata
                </h5>
                <div className="bg-brand-light border border-brand-secondary rounded-xl p-4 grid grid-cols-3 gap-4">
                  <div>
                    <span className="block text-xs text-brand-primary/70 mb-1">
                      Pet Name
                    </span>
                    <span className="font-bold text-brand-primary">
                      {selectedLead.petName || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-brand-primary/70 mb-1">
                      Pet Breed
                    </span>
                    <span className="font-bold text-brand-primary">
                      {selectedLead.petBreed || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-brand-primary/70 mb-1">
                      Pet Age
                    </span>
                    <span className="font-bold text-brand-primary">
                      {selectedLead.petAge || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-brand-secondary" />

              <div>
                <h5 className="font-bold text-brand-primary mb-2">
                  Lead Context & Notes
                </h5>
                <p className="bg-orange-500/10 text-orange border border-orange-500/20 rounded-xl p-4 text-sm italic">
                  {selectedLead.notes ||
                    "No context notes appended to this file."}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-brand-secondary bg-brand-light/50 flex flex-col gap-2">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate(`/lead-details/${selectedLead.id}`);
                }}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-brand-light font-bold rounded-lg transition-colors"
              >
                Go to Workspace
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedLead)}
                  className="flex-1 py-2 bg-transparent border border-brand-secondary hover:border-brand-primary/50 text-brand-primary font-bold rounded-lg transition-colors"
                >
                  Edit File
                </button>
                <button
                  onClick={() => {
                    setDeleteId(selectedLead.id);
                    setDrawerOpen(false);
                  }}
                  className="flex-1 py-2 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )} */}

      {/* Add / Edit Dialog */}
      {(addOpen || editOpen) && (
        <>
          <div
            className="fixed inset-0 bg-brand-light/60 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setAddOpen(false);
              setEditOpen(false);
            }}
          >
            <div
              className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6 border-b border-brand-secondary flex justify-between items-center bg-brand-light">
                <h2 className="text-lg font-bold text-brand-primary">
                  {addOpen
                    ? "Register New Customer Entry"
                    : "Modify Customer Lead File"}
                </h2>
                <button
                  onClick={() => {
                    setAddOpen(false);
                    setEditOpen(false);
                  }}
                  className="text-brand-primary/70 hover:text-brand-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto">
                <form
                  onSubmit={addOpen ? handleSaveAdd : handleSaveEdit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.name}
                      onChange={(e) =>
                        setFormFields({ ...formFields, name: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.phone}
                      onChange={(e) =>
                        setFormFields({ ...formFields, phone: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formFields.email}
                      onChange={(e) =>
                        setFormFields({ ...formFields, email: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Lead Traffic Source
                    </label>
                    <select
                      value={formFields.source}
                      onChange={(e) =>
                        setFormFields({ ...formFields, source: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    >
                      {sources.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Service Interest
                    </label>
                    <select
                      value={formFields.service}
                      onChange={(e) => {
                        const selService = e.target.value;
                        const initialStage =
                          stages[selService]?.[0] || "New Lead";
                        setFormFields({
                          ...formFields,
                          service: selService,
                          stage: initialStage,
                        });
                      }}
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    >
                      {activeServices.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Assign Sales Rep
                    </label>
                    <select
                      value={formFields.assignedTo}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          assignedTo: e.target.value,
                        })
                      }
                      disabled={currentUser?.role === "Sales Representative"}
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {salespeople.map((rep) => (
                        <option key={rep} value={rep}>
                          {rep}
                        </option>
                      ))}
                    </select>
                  </div>




                  <div>
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Lead Overall Status
                    </label>
                    <select
                      value={formFields.status || "New"}
                      onChange={(e) =>
                        setFormFields({ ...formFields, status: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    >
                      <option value="New">New</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Not Attended">Not Attended</option>
                      <option value="Not Responding">Not Responding</option>
                      <option value="Not Answered">Not Answered</option>
                      <option value="Price Issue">Price Issue</option>
                      <option value="Joined">Joined</option>
                    </select>
                  </div>


                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Client Requirements & Internal Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formFields.notes}
                      onChange={(e) =>
                        setFormFields({ ...formFields, notes: e.target.value })
                      }
                      className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
                <button
                  onClick={() => {
                    setAddOpen(false);
                    setEditOpen(false);
                  }}
                  className="px-4 py-2 font-bold text-sm text-brand-primary/70 hover:text-brand-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addOpen ? handleSaveAdd : handleSaveEdit}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-brand-light text-sm font-bold rounded-lg transition-colors"
                >
                  {addOpen ? "Register Lead" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-brand-light/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-light border border-brand-secondary rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-brand-primary mb-2">
                Delete Customer Lead Record
              </h3>
              <p className="text-sm text-brand-primary/70">
                Are you sure you want to delete this customer lead? This action
                is irreversible and will also purge all related activities and
                follow up notifications.
              </p>
            </div>
            <div className="p-4 border-t border-brand-secondary bg-brand-light flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 font-bold text-sm text-brand-primary/70 hover:text-brand-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteLead(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-brand-primary text-sm font-bold rounded-lg transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
