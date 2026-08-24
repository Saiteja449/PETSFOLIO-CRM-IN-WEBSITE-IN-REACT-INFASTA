import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants.js";
import { useLeads } from "../context/LeadsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatDate,
  getStageColor,
  getServiceColor,
  getStatusColor,
  getSourceColor,
  filterLeads,
  normalizeServices,
} from "../utils/helpers.js";

// Helper components for UI
const Badge = ({ children, colorClass, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colorClass} ${className}`}
  >
    {children}
  </span>
);

// Removed ServiceMultiSelect as we now use a standard select

export default function Leads() {
  const navigate = useNavigate();
  const { statusParam } = useParams();
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { addLead, updateLead, deleteLead, activeServices } = useLeads();
  const { allUsers, currentUser } = useAuth();

  const paramToTab = {
    new: "New",
    todayfollowups: "TodayFollowup",
    upcomingfollowups: "UpcomingFollowup",
    notattended: "NotAttended",
    joined: "Joined",
    jobposted: "JobPosted",
    converted: "Converted",
    lost: "Lost",
    oldleads: "OldLeads",
  };
  const tabToParam = {
    New: "new",
    TodayFollowup: "todayfollowups",
    UpcomingFollowup: "upcomingfollowups",
    NotAttended: "notattended",
    Joined: "joined",
    JobPosted: "jobposted",
    Converted: "converted",
    Lost: "lost",
    OldLeads: "oldleads",
  };

  const [search, setSearch] = useState("");
  const [service, setService] = useState("All");

  const [salesperson, setSalesperson] = useState("All");
  const [status, setStatus] = useState("All");

  const leadTypeTab = paramToTab[statusParam?.toLowerCase()] || "New";

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [tabCounts, setTabCounts] = useState({});
  const [triggerFetch, setTriggerFetch] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const defaultFormFields = {
    name: "",
    phone: "",
    email: "",
    source: "Manual Entry",
    services: ["Grooming"],

    assignedTo: currentUser?.role === "Sales Representative" ? currentUser.name : "Unassigned",
    nextFollowUp: "2026-05-26",
    followupTime: "11:00 AM",
    followupType: "Call",
    status: "New",
    leadType: "Client",
    notes: "",
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [deleteId, setDeleteId] = useState(null);

  const salespeople = (allUsers || []).map((u) => u.name);
  const tabsData = [
    { name: "OldLeads", label: "Old Leads", count: tabCounts.OldLeads || 0 },
    { name: "New", label: "New Leads", count: tabCounts.New || 0 },
    {
      name: "TodayFollowup",
      label: "Today Followups",
      count: tabCounts.TodayFollowup || 0,
    },
    {
      name: "UpcomingFollowup",
      label: "Upcoming Followups",
      count: tabCounts.UpcomingFollowup || 0,
    },
    {
      name: "NotAttended",
      label: "Not Attended",
      count: tabCounts.NotAttended || 0,
    },
    { name: "Joined", label: "Joined", count: tabCounts.Joined || 0 },
    { name: "JobPosted", label: "Job Posted", count: tabCounts.JobPosted || 0 },
    {
      name: "Converted",
      label: "Job Assigned",
      count: tabCounts.Converted || 0,
    },
    { name: "Lost", label: "Lost/Dropped", count: tabCounts.Lost || 0 },
  ];
  const sources = [
    "Email",
    "WhatsApp",
    "Meta Ads",
    "Website Form",
    "Call",
    "Manual Entry",
  ];

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: rowsPerPage === "All" ? 0 : page,
          limit: rowsPerPage === "All" ? "all" : rowsPerPage,
          search,
          service,
          salesperson,
          status,
          leadTypeTab,
          currentUserRole: currentUser?.role || "",
          currentUserName: currentUser?.name || "",
        });
        const res = await axios.get(
          `${API_ENDPOINTS.LEADS.BASE}/paginated?${queryParams}`,
        );
        setPaginatedLeads(res.data.leads || []);
        setTotalLeadsCount(res.data.totalCount || 0);
        setTabCounts(res.data.tabCounts || {});
      } catch (error) {
        console.error("Error fetching paginated leads:", error);
      }
    };
    if (currentUser) {
      fetchLeads();
    }
  }, [
    page,
    rowsPerPage,
    search,
    service,
    salesperson,
    status,
    leadTypeTab,
    currentUser,
    triggerFetch,
  ]);

  React.useEffect(() => {
    sessionStorage.setItem(
      "lastLeadsPath",
      `/leads/${tabToParam[leadTypeTab] || "new"}`,
    );
  }, [leadTypeTab]);

  const totalPages =
    rowsPerPage === "All" || Number(rowsPerPage) <= 0
      ? 1
      : Math.ceil(totalLeadsCount / Number(rowsPerPage));

  const handleOpenAdd = () => {
    setFormFields(defaultFormFields);
    setAddOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formFields.name || !formFields.phone || !formFields.services || formFields.services.length === 0) {
      alert(
        "Please fill in main credentials (Customer Name, Phone, and at least one Service)",
      );
      return;
    }
    if (
      formFields.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formFields.email)
    ) {
      alert("Please enter a valid email address.");
      return;
    }
    const toSave = { ...formFields, status: formFields.status || "New" };
    try {
      await addLead(toSave, currentUser?.name || "System");
      setAddOpen(false);
      setTriggerFetch((prev) => prev + 1);
    } catch (error) {
      alert("Failed to add lead. Please try again.");
    }
  };

  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setFormFields({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      source: lead.source,
      services: lead.services && lead.services.length > 0 ? lead.services : ["Grooming"],

      assignedTo: lead.assignedTo,
      nextFollowUp: lead.nextFollowUp || "",
      followupTime: lead.followupTime || "11:00 AM",
      followupType: lead.followupType || "Call",
      status: lead.status || "New",
      leadType: lead.leadType || "Client",
      notes: lead.notes || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (
      formFields.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formFields.email)
    ) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      await updateLead(
        selectedLead.id,
        formFields,
        currentUser?.name || "System",
      );
      setEditOpen(false);
      setTriggerFetch((prev) => prev + 1);
    } catch (error) {
      alert("Failed to update lead. Please try again.");
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
      case "job posted":
        return "bg-teal-500/10 text-teal-600 border border-teal-500/20 font-extrabold";
      case "job assigned":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-extrabold";
      case "not attended":
      case "price issue":
      case "not interested":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-brand-secondary/40 text-brand-primary/70 border border-brand-secondary/50";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-brand-secondary rounded-lg p-1 bg-brand-light">
            <button
              onClick={() => handleScroll("left")}
              className="p-1.5 rounded hover:bg-brand-secondary/50 text-brand-primary transition-colors"
              title="Scroll Tabs Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-1.5 rounded hover:bg-brand-secondary/50 text-brand-primary transition-colors"
              title="Scroll Tabs Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-brand-primary text-sm font-bold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Lead
          </button>
        </div>
      </div>

      <div className="border-b border-brand-secondary w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {tabsData.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setPage(0);
                navigate(`/leads/${tabToParam[tab.name]}`);
              }}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                leadTypeTab === tab.name
                  ? "border-teal-500 text-teal-500"
                  : "border-transparent text-brand-primary/70 hover:text-brand-primary hover:border-brand-secondary"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
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
              <option value="Not Attended">Not Attended</option>
              <option value="Price Issue">Price Issue</option>
              <option value="Joined">Joined</option>
              <option value="Job Posted">Job Posted</option>
              <option value="Job Assigned">Job Assigned</option>
              <option value="Policy Active">
                Policy Active (Pet Insurance)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Result Area */}
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

                {currentUser?.role !== "Sales Representative" && (
                  <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Assigned to
                  </th>
                )}
                <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Enquired On
                </th>
                <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold text-brand-primary uppercase tracking-wider text-right">
                  Tools
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-8 text-center text-sm text-brand-primary/70"
                  >
                    No customer files found for the current configuration.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-brand-secondary/30/50 transition-colors border-b-1 border-b-brand-secondary"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/lead-details/${lead.id}`)}
                            className="text-sm font-bold text-teal-400 hover:text-teal-300 hover:underline text-left"
                          >
                            {lead.name?.substring(0, 25)}
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
                      <div 
                        className="flex flex-wrap gap-1.5"
                        title={(lead.services && lead.services.length > 0 ? lead.services : ["Grooming"]).join(", ")}
                      >
                        {(() => {
                          const services = lead.services && lead.services.length > 0 ? lead.services : ["Grooming"];
                          return (
                            <>
                              <div className="flex items-center gap-1.5 bg-brand-secondary/20 px-2 py-0.5 rounded cursor-help">
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getServiceColor(services[0]) }}
                                />
                                <span className="text-xs font-semibold text-brand-primary">
                                  {services[0]}
                                </span>
                              </div>
                              {services.length > 1 && (
                                <div className="flex items-center gap-1.5 bg-brand-secondary/20 px-2 py-0.5 rounded cursor-help">
                                  <span className="text-xs font-semibold text-brand-primary">
                                    +{services.length - 1}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    {currentUser?.role !== "Sales Representative" && (
                      <td className="px-4 py-3 text-sm text-brand-primary">
                        {lead.assignedTo || "Unassigned"}
                      </td>
                    )}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Filter Options */}
        <div className="px-4 py-3 border-t border-brand-secondary flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-brand-primary/70">
            <span className="font-medium text-xs text-brand-primary/80">Show leads:</span>
            <div className="inline-flex items-center rounded-lg bg-brand-secondary/20 p-0.5 border border-brand-secondary">
              {[10, 25, 50, "All"].map((option) => {
                const isSelected = rowsPerPage === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setRowsPerPage(option);
                      setPage(0);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      isSelected
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-brand-primary/70 hover:text-brand-primary hover:bg-brand-secondary/40"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-brand-primary/70">
            <span className="text-xs">
              {totalLeadsCount === 0
                ? "0 leads"
                : rowsPerPage === "All"
                ? `Showing all ${totalLeadsCount} leads`
                : `${page * Number(rowsPerPage) + 1}-${Math.min(
                    (page + 1) * Number(rowsPerPage),
                    totalLeadsCount
                  )} of ${totalLeadsCount}`}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0 || rowsPerPage === "All"}
                className="px-2.5 py-1 text-xs font-semibold bg-brand-light border border-brand-secondary hover:bg-brand-secondary/30 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-brand-primary"
              >
                Prev
              </button>
              <span className="text-xs font-medium text-brand-primary/80 px-1">
                Page {rowsPerPage === "All" ? 1 : page + 1} of {Math.max(1, totalPages)}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1 || rowsPerPage === "All"}
                className="px-2.5 py-1 text-xs font-semibold bg-brand-light border border-brand-secondary text-brand-primary hover:bg-brand-secondary/30 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  <div className="flex flex-col gap-1.5">
                    {(selectedLead.services && selectedLead.services.length > 0 ? selectedLead.services : ["Grooming"]).map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: getServiceColor(s),
                          }}
                        ></div>
                        <span className="font-bold text-brand-primary">
                          {s}
                        </span>
                      </div>
                    ))}
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
                    Enquired On
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
                        setFormFields({
                          ...formFields,
                          phone: e.target.value.replace(/[^0-9+]/g, ""),
                        })
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

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                      Service Interest *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeServices.map((s) => (
                        <label key={s.code} className="flex items-center gap-1.5 cursor-pointer bg-brand-light border border-brand-secondary px-3 py-1.5 rounded-lg hover:border-teal-500 transition-colors">
                          <input
                            type="checkbox"
                            checked={formFields.services?.includes(s.code)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormFields((prev) => ({
                                ...prev,
                                services: checked
                                  ? [...(prev.services || []), s.code]
                                  : (prev.services || []).filter((sv) => sv !== s.code),
                              }));
                            }}
                            className="accent-teal-500"
                          />
                          <span className="text-sm text-brand-primary">{s.name}</span>
                        </label>
                      ))}
                    </div>
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
                      <option value="Unassigned">Unassigned (Auto Assign)</option>
                      {currentUser?.role !== "Sales Representative" && 
                       formFields.assignedTo !== "Unassigned" && 
                       !salespeople.includes(formFields.assignedTo) && (
                        <option value={formFields.assignedTo}>{formFields.assignedTo}</option>
                      )}
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
                      <option value="Price Issue">Price Issue</option>
                      <option value="Joined">Joined</option>
                      <option value="Job Posted">Job Posted</option>
                      <option value="Job Assigned">Job Assigned</option>
                      {formFields.services?.includes("Pet Insurance") && (
                        <option value="Policy Active">Policy Active</option>
                      )}
                    </select>
                  </div>

                  {formFields.status === "Follow Up" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                          Follow Up Type
                        </label>
                        <select
                          value={formFields.followupType}
                          onChange={(e) =>
                            setFormFields({ ...formFields, followupType: e.target.value })
                          }
                          className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                        >
                          <option value="Call">Call</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Email">Email</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Consultation">Consultation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                          Next Follow Up Date
                        </label>
                        <input
                          type="date"
                          value={formFields.nextFollowUp}
                          onChange={(e) =>
                            setFormFields({ ...formFields, nextFollowUp: e.target.value })
                          }
                          className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-primary/70 mb-1">
                          Follow Up Time
                        </label>
                        <input
                          type="time"
                          value={formFields.followupTime}
                          onChange={(e) =>
                            setFormFields({ ...formFields, followupTime: e.target.value })
                          }
                          className="w-full bg-brand-light border border-brand-secondary rounded-lg px-3 py-2 text-sm text-brand-primary focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </>
                  )}

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
                onClick={async () => {
                  try {
                    await deleteLead(deleteId);
                    setDeleteId(null);
                    setTriggerFetch((prev) => prev + 1);
                  } catch (error) {
                    alert("Failed to delete lead.");
                  }
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
