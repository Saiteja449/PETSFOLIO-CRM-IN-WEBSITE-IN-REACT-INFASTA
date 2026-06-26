import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Paperclip,
  RefreshCw,
  Play,
  FileText,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Settings,
  Brain,
  Clock,
  Sparkles,
  TrendingUp,
  UserCheck,
  Check,
  CheckCheck,
  Shield,
  Smile,
  AlertCircle,
  FolderMinus,
  Calendar,
  X,
  UserPlus
} from "lucide-react";
import { socket } from "../utils/socket.js";
import { API_ENDPOINTS } from "../utils/constants.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function WhatsAppChat() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Connection & Session States
  const [session, setSession] = useState({
    status: "disconnected",
    qrCode: "",
    connectedPhone: "",
    connectedName: ""
  });
  const [sessionLoading, setSessionLoading] = useState(false);

  // Conversations List
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Active Chat Message history
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // AI Suggestions and Logging
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // Upload/Attachment State
  const [attachedFile, setAttachedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // AI Lead Qualification Form
  const [qualForm, setQualForm] = useState({
    petType: "",
    breed: "",
    city: "",
    intent: "",
    budget: "",
    urgency: "Medium",
    interestScore: 0
  });
  const [savingQual, setSavingQual] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // Knowledge Base Drawer
  const [kbOpen, setKbOpen] = useState(false);
  const [kbItems, setKbItems] = useState([]);
  const [newKB, setNewKB] = useState({
    title: "",
    content: "",
    type: "faq"
  });
  const [savingKB, setSavingKB] = useState(false);

  // Follow Up Form Modal
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    type: "WhatsApp",
    date: new Date().toISOString().split("T")[0],
    time: "11:00 AM",
    priority: "Medium",
    notes: ""
  });

  // Load Status and FAQ Knowledge Base on mount
  useEffect(() => {
    fetchSessionStatus();
    fetchConversations();
    fetchKB();

    // Socket.IO updates
    socket.on("whatsapp_status", (data) => {
      setSession(data);
    });

    socket.on("conversation_updated", (data) => {
      // Reload conversations list
      fetchConversations();
    });

    return () => {
      socket.off("whatsapp_status");
      socket.off("conversation_updated");
    };
  }, []);

  // Set up socket subscription for selected chat
  useEffect(() => {
    if (!selectedConv) return;

    // Join room
    socket.emit("join_lead_chat", selectedConv.leadId?.id);

    // Listen to new message logs
    socket.on("new_message", (msg) => {
      if (msg.leadId === selectedConv.leadId?.id) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.messageId === msg.messageId)) return prev;
          return [...prev, msg];
        });
        scrollToBottom();
      }
    });

    // Listen to typing status
    socket.on("typing_status", (data) => {
      if (data.leadId === selectedConv.leadId?.id) {
        setIsTyping(data.isTyping);
      }
    });

    // Reset unread count locally when active chat changes
    setConversations((prev) =>
      prev.map((c) =>
        c.leadId?.id === selectedConv.leadId?.id ? { ...c, unreadCount: 0 } : c
      )
    );

    return () => {
      socket.emit("leave_lead_chat", selectedConv.leadId?.id);
      socket.off("new_message");
      socket.off("typing_status");
    };
  }, [selectedConv]);

  // Scroll chat timeline to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const fetchSessionStatus = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.WHATSAPP.STATUS);
      setSession(res.data);
    } catch (err) {
      console.error("Failed to fetch WhatsApp connection status", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.WHATSAPP.CONVERSATIONS, {
        params: {
          role: currentUser?.role,
          name: currentUser?.name
        }
      });
      const data = res.data;
      setConversations(data);
      setConversationsLoading(false);

      const targetLeadId = location.state?.selectLeadId;
      if (targetLeadId) {
        const found = data.find((c) => c.leadId?.id === targetLeadId);
        if (found) {
          handleSelectConversation(found);
        } else {
          // If no conversation thread exists yet, retrieve lead details and create a mock conversation
          try {
            const leadRes = await axios.get(`${API_ENDPOINTS.LEADS.BASE}/${targetLeadId}`);
            const newMockConv = {
              id: `mock_${targetLeadId}`,
              leadId: leadRes.data,
              unreadCount: 0,
              lastMessage: "No messages yet",
              lastMessageTime: new Date()
            };
            setConversations((prev) => {
              if (prev.some((c) => c.leadId?.id === targetLeadId)) return prev;
              return [newMockConv, ...prev];
            });
            handleSelectConversation(newMockConv);
          } catch (err) {
            console.error("Failed to load lead details for mock conversation", err);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
      setConversationsLoading(false);
    }
  };

  const fetchKB = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.WHATSAPP.KB);
      setKbItems(res.data);
    } catch (err) {
      console.error("Failed to fetch Knowledge Base FAQ items", err);
    }
  };

  const handleConnect = async () => {
    setSessionLoading(true);
    try {
      await axios.post(API_ENDPOINTS.WHATSAPP.CONNECT);
      // Wait a moment then query status
      setTimeout(fetchSessionStatus, 2000);
    } catch (err) {
      alert("Failed to send connect command.");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to disconnect WhatsApp session?")) return;
    setSessionLoading(true);
    try {
      await axios.post(API_ENDPOINTS.WHATSAPP.LOGOUT);
      fetchSessionStatus();
    } catch (err) {
      alert("Failed to send logout command.");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConv(conv);
    setMessagesLoading(true);
    setMessages([]);
    setSuggestions([]);
    
    // Set up lead qualification state fields
    const lead = conv.leadId;
    if (lead) {
      setQualForm({
        petType: lead.aiQualification?.petType || "",
        breed: lead.aiQualification?.breed || "",
        city: lead.aiQualification?.city || "",
        intent: lead.aiQualification?.intent || "",
        budget: lead.aiQualification?.budget || "",
        urgency: lead.aiQualification?.urgency || "Medium",
        interestScore: lead.aiQualification?.interestScore || 0
      });
    }

    try {
      const res = await axios.get(API_ENDPOINTS.WHATSAPP.CONVERSATION(conv.leadId?.id));
      setMessages(res.data);
      setMessagesLoading(false);
      scrollToBottom();
      
      // Load AI suggested replies
      fetchAISuggestions(conv.leadId?.id);
    } catch (err) {
      console.error("Failed to load message logs", err);
      setMessagesLoading(false);
    }
  };

  const fetchAISuggestions = async (leadId) => {
    setSuggestionsLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.WHATSAPP.AI_REPLY, { leadId });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("Failed to fetch AI suggestions");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Toggle AI on/off for lead
  const handleToggleAI = async () => {
    if (!selectedConv) return;
    const nextState = !selectedConv.leadId?.aiEnabled;
    try {
      const res = await axios.post(API_ENDPOINTS.WHATSAPP.AI_TOGGLE, {
        leadId: selectedConv.leadId?.id,
        aiEnabled: nextState
      });
      
      // Update local state
      const updatedLead = res.data.lead;
      setSelectedConv(prev => ({
        ...prev,
        leadId: {
          ...prev.leadId,
          aiEnabled: updatedLead.aiEnabled
        }
      }));
      setConversations(prev =>
        prev.map(c =>
          c.leadId?.id === selectedConv.leadId?.id
            ? { ...c, leadId: { ...c.leadId, aiEnabled: updatedLead.aiEnabled } }
            : c
        )
      );
    } catch (err) {
      alert("Failed to toggle AI state.");
    }
  };

  // File picker handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      try {
        const res = await axios.post(API_ENDPOINTS.WHATSAPP.UPLOAD, {
          fileName: file.name,
          base64Data
        });
        setAttachedFile({
          name: file.name,
          url: res.data.url,
          type: file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : "document"
        });
      } catch (err) {
        alert("Failed to upload attachment file.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedConv) return;
    if (!inputValue.trim() && !attachedFile) return;

    const messageText = inputValue.trim();
    setInputValue("");
    const file = attachedFile;
    setAttachedFile(null);

    try {
      // Send manual message
      // Wait, if it has a file, let's submit it. For simplicity in the Baileys handler,
      // we send a text explaining the file link or send the attachment link.
      const fullText = file ? `${messageText} (Attached: ${file.name} - http://localhost:5000${file.url})` : messageText;
      
      await axios.post(API_ENDPOINTS.WHATSAPP.SEND_MESSAGE, {
        leadId: selectedConv.leadId?.id,
        text: fullText,
        senderName: currentUser?.name || "System"
      });
      
      // Auto reload suggestions after a short wait
      setTimeout(() => fetchAISuggestions(selectedConv.leadId?.id), 2000);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  // Handle suggested reply click
  const handleUseSuggestion = (text) => {
    setInputValue(text);
  };

  // Update lead qualification parameters in DB
  const handleUpdateQualification = async (e) => {
    e.preventDefault();
    if (!selectedConv) return;
    setSavingQual(true);

    try {
      // Update CRM lead
      await axios.put(`${API_ENDPOINTS.LEADS.BASE}/${selectedConv.leadId?.id}`, {
        aiQualification: qualForm
      });
      alert("AI Qualification fields updated successfully!");
    } catch (err) {
      alert("Failed to save updates.");
    } finally {
      setSavingQual(false);
    }
  };

  // Add Tags
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!selectedConv || !newTagInput.trim()) return;
    
    const nextTags = [...(selectedConv.leadId?.aiTags || []), newTagInput.trim()];
    try {
      const res = await axios.put(`${API_ENDPOINTS.LEADS.BASE}/${selectedConv.leadId?.id}`, {
        aiTags: nextTags
      });

      setSelectedConv(prev => ({
        ...prev,
        leadId: { ...prev.leadId, aiTags: res.data.aiTags }
      }));
      setNewTagInput("");
    } catch (err) {
      alert("Failed to add tag.");
    }
  };

  // Delete Tag
  const handleDeleteTag = async (tagToDelete) => {
    if (!selectedConv) return;
    const nextTags = (selectedConv.leadId?.aiTags || []).filter(t => t !== tagToDelete);
    try {
      const res = await axios.put(`${API_ENDPOINTS.LEADS.BASE}/${selectedConv.leadId?.id}`, {
        aiTags: nextTags
      });

      setSelectedConv(prev => ({
        ...prev,
        leadId: { ...prev.leadId, aiTags: res.data.aiTags }
      }));
    } catch (err) {
      alert("Failed to remove tag.");
    }
  };

  // Create FAQ Knowledge Base item
  const handleCreateKB = async (e) => {
    e.preventDefault();
    if (!newKB.title || !newKB.content) return;
    setSavingKB(true);

    try {
      await axios.post(API_ENDPOINTS.WHATSAPP.KB, newKB);
      setNewKB({ title: "", content: "", type: "faq" });
      fetchKB();
    } catch (err) {
      alert("Failed to add Knowledge Base entry.");
    } finally {
      setSavingKB(false);
    }
  };

  // Delete FAQ Knowledge Base item
  const handleDeleteKB = async (id) => {
    if (!window.confirm("Delete this Knowledge Base entry?")) return;
    try {
      await axios.delete(`${API_ENDPOINTS.WHATSAPP.KB}/${id}`);
      fetchKB();
    } catch (err) {
      alert("Failed to delete entry.");
    }
  };

  // Create follow up
  const handleCreateFollowUp = async (e) => {
    e.preventDefault();
    if (!selectedConv) return;

    try {
      await axios.post(API_ENDPOINTS.FOLLOWUPS.BASE, {
        leadId: selectedConv.leadId?.id,
        leadName: selectedConv.leadId?.name,
        type: followUpData.type,
        date: followUpData.date,
        time: followUpData.time,
        priority: followUpData.priority,
        notes: followUpData.notes,
        author: currentUser?.name || "Agent"
      });

      alert("Follow up task scheduled successfully!");
      setFollowUpOpen(false);
      setFollowUpData({
        type: "WhatsApp",
        date: new Date().toISOString().split("T")[0],
        time: "11:00 AM",
        priority: "Medium",
        notes: ""
      });
    } catch (err) {
      alert("Failed to schedule follow up.");
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const name = c.leadId?.name || "Unknown";
    const phone = c.leadId?.phone || "";
    const cleanQuery = searchQuery.toLowerCase();
    return name.toLowerCase().includes(cleanQuery) || phone.includes(cleanQuery);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] relative overflow-hidden bg-[#0a1128] text-white">
      {/* Top Header Connection Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#1c2d5a] bg-[#0c1635]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1c2d5a] rounded-xl">
            <MessageSquare className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">WhatsApp AI Lead Hub</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                session.status === "connected" ? "bg-emerald-500 animate-pulse" :
                session.status === "qr" ? "bg-amber-400" :
                session.status === "connecting" ? "bg-blue-400 animate-spin border-t-transparent" : "bg-red-500"
              }`} />
              <span className="text-xs font-semibold capitalize text-brand-secondary/80">
                Connection Status: {session.status === "qr" ? "Scan QR Code" : session.status}
              </span>
              {session.status === "connected" && session.connectedPhone && (
                <span className="text-xs text-emerald-400 font-bold ml-1">
                  ({session.connectedPhone})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Setup actions */}
        <div className="flex items-center gap-2">
          {session.status === "disconnected" && (
            <button
              onClick={handleConnect}
              disabled={sessionLoading}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${sessionLoading ? "animate-spin" : ""}`} />
              Link WhatsApp
            </button>
          )}

          {session.status === "qr" && session.qrCode && (
            <div className="relative group">
              <button
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 min-w-[200px] rounded-xl"
              >
                Scan QR Code
              </button>
              {/* QR Popup */}
              <div className="absolute right-0 top-12 z-50 p-4 bg-white text-black border border-gray-200 rounded-2xl shadow-2xl flex flex-col items-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(session.qrCode)}`}
                  alt="WhatsApp QR Code"
                  className="w-48 h-48"
                />
                <p className="text-xs font-bold text-center mt-2 text-gray-600">Scan via WhatsApp Link Device</p>
                <button
                  onClick={fetchSessionStatus}
                  className="mt-3 text-xs flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold"
                >
                  <RefreshCw className="w-3 h-3" /> Check Connection Status
                </button>
              </div>
            </div>
          )}

          {session.status === "connected" && (
            <button
              onClick={handleLogout}
              disabled={sessionLoading}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 px-4 rounded-xl transition-all border border-red-500/30"
            >
              Disconnect Phone
            </button>
          )}

          <button
            onClick={() => setKbOpen(true)}
            className="p-2 bg-[#1c2d5a] hover:bg-[#253b75] rounded-xl text-teal-400 transition-colors"
            title="Configure AI FAQs"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Layout Pane */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        
        {/* Left Side: Conversation List */}
        <div className="w-80 flex flex-col border-r border-[#1c2d5a] bg-[#0c1635] shrink-0">
          <div className="p-3 border-b border-[#1c2d5a]">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101b3f] border border-[#20346c] rounded-xl px-4 py-2.5 outline-none focus:border-teal-400 text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="p-6 text-center text-brand-secondary/50">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-400" />
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-brand-secondary/50">
                No active conversations found
              </div>
            ) : (
              <ul className="divide-y divide-[#182855]/40">
                {filteredConversations.map((conv) => {
                  const lead = conv.leadId;
                  const isSelected = selectedConv?.id === conv.id;
                  const leadName = lead?.name || "Unknown Customer";
                  const status = lead?.status || "New";

                  return (
                    <li key={conv.id}>
                      <button
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full flex items-start gap-3 p-3.5 text-left transition-colors ${
                          isSelected ? "bg-[#162758]" : "hover:bg-[#11204d]"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-500/30">
                          {leadName.substring(0, 2).toUpperCase()}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm truncate text-white">
                              {leadName}
                            </h3>
                            <span className="text-[10px] text-brand-secondary/50 font-medium">
                              {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                          </div>
                          <p className="text-xs text-brand-secondary/70 truncate mt-0.5">
                            {conv.lastMessage || "No messages yet"}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="px-1.5 py-0.5 bg-teal-500/10 text-teal-400 text-[9px] rounded-md font-bold uppercase tracking-wider">
                              {status}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {/* AI State badge */}
                              {lead?.aiEnabled ? (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] rounded-md font-bold">
                                  <Brain className="w-2.5 h-2.5" /> AI Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] rounded-md font-bold">
                                  <User className="w-2.5 h-2.5" /> Human
                                </span>
                              )}

                              {/* Unread badge */}
                              {conv.unreadCount > 0 && (
                                <span className="w-5 h-5 flex items-center justify-center bg-emerald-500 text-black text-[10px] font-extrabold rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Center: Message Logs timeline */}
        <div className="flex-1 flex flex-col bg-[#080d22] min-w-0">
          {selectedConv ? (
            <>
              {/* Chat room Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-[#1c2d5a] bg-[#0c1635]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {(selectedConv.leadId?.name || "Unknown").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-white">
                      {selectedConv.leadId?.name || "Unknown Customer"}
                    </h2>
                    <p className="text-xs text-brand-secondary/60">
                      WhatsApp: {selectedConv.leadId?.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* AI toggle slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-secondary/80 font-bold">Auto-AI:</span>
                    <button
                      onClick={handleToggleAI}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        selectedConv.leadId?.aiEnabled ? "bg-teal-500" : "bg-[#1c2d5a]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          selectedConv.leadId?.aiEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={() => navigate(`/lead-details/${selectedConv.leadId?.id}`)}
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 border border-teal-500/30 bg-teal-500/5 px-3 py-1.5 rounded-lg"
                  >
                    View Lead Record
                  </button>
                </div>
              </div>

              {/* Chat Timeline body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-brand-secondary/50">
                    <RefreshCw className="w-8 h-8 animate-spin text-teal-400 mb-2" />
                    Fetching chat transcripts...
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isIncoming = msg.direction === "incoming";
                      
                      return (
                        <div
                          key={msg.id || msg.messageId}
                          className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl p-3 shadow-md relative group ${
                              isIncoming
                                ? "bg-[#162145] text-white rounded-tl-none border border-[#213264]"
                                : "bg-teal-600 text-white rounded-tr-none"
                            }`}
                          >
                            {/* AI Generated tag badge */}
                            {!isIncoming && msg.aiGenerated && (
                              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-[#0a1128]/40 text-teal-200 text-[8px] rounded font-semibold mb-1">
                                <Bot className="w-2.5 h-2.5" /> AI Reply
                              </span>
                            )}
                            
                            {/* Human Agent badge */}
                            {!isIncoming && !msg.aiGenerated && msg.senderName && (
                              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-[#0a1128]/20 text-white text-[9px] rounded font-semibold mb-1">
                                <User className="w-2.5 h-2.5" /> {msg.senderName}
                              </span>
                            )}

                            {/* Image Attachment Rendering */}
                            {msg.mediaUrl && msg.messageType === "image" && (
                              <div className="mb-2 max-w-sm rounded-lg overflow-hidden border border-black/20">
                                <img
                                  src={`http://localhost:5000${msg.mediaUrl}`}
                                  alt="Attachment"
                                  className="w-full object-cover max-h-60"
                                />
                              </div>
                            )}

                            {/* Audio message handler */}
                            {msg.mediaUrl && msg.messageType === "audio" && (
                              <div className="mb-2 flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                                <Play className="w-4 h-4 text-teal-200 cursor-pointer" />
                                <audio controls src={`http://localhost:5000${msg.mediaUrl}`} className="h-6 w-48 text-xs" />
                              </div>
                            )}

                            {/* Doc Attachment */}
                            {msg.mediaUrl && msg.messageType === "document" && (
                              <a
                                href={`http://localhost:5000${msg.mediaUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mb-2 flex items-center gap-2 p-2.5 bg-black/10 rounded-lg text-teal-100 hover:text-white border border-white/10"
                              >
                                <FileText className="w-5 h-5" />
                                <span className="text-xs font-semibold truncate max-w-[180px]">
                                  {msg.text || "Document Attachment"}
                                </span>
                              </a>
                            )}

                            {/* Location rendering */}
                            {msg.messageType === "location" && (
                              <div className="mb-2 flex items-center gap-2 p-2 bg-[#0a1128]/35 rounded-lg text-xs font-medium">
                                <MapPin className="w-4 h-4 text-red-400" />
                                <span>{msg.text}</span>
                              </div>
                            )}

                            {/* Text message content */}
                            {msg.messageType !== "document" && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            )}

                            {/* Date time and checkmarks status */}
                            <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[9px] text-brand-secondary/65">
                              <span>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              
                              {!isIncoming && (
                                <span>
                                  {msg.status === "read" ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : msg.status === "delivered" ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-brand-secondary/60" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-brand-secondary/60" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Live typing status */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#162145] text-teal-400 rounded-2xl rounded-tl-none p-3 border border-[#213264] flex items-center gap-2">
                          <Bot className="w-4 h-4 animate-bounce" />
                          <span className="text-xs font-semibold">Gemini AI is crafting reply...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Suggestions Panel */}
              {suggestions.length > 0 && (
                <div className="p-3 border-t border-[#1c2d5a] bg-[#091026] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    AI Copilot Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUseSuggestion(text)}
                        className="text-xs bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 px-3 py-1.5 rounded-xl text-left transition-all"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input footer */}
              <form onSubmit={handleSend} className="p-3 border-t border-[#1c2d5a] bg-[#0c1635] flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 bg-[#1c2d5a] hover:bg-[#253b75] text-brand-secondary/80 rounded-xl transition-all relative"
                  disabled={uploading}
                >
                  <Paperclip className={`w-5 h-5 ${uploading ? "animate-pulse text-amber-400" : ""}`} />
                </button>

                <div className="flex-1 relative flex items-center bg-[#101b3f] border border-[#20346c] rounded-xl px-4 py-2.5">
                  <input
                    type="text"
                    placeholder={
                      attachedFile
                        ? `Attached file: ${attachedFile.name}`
                        : "Type message..."
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent outline-none text-white text-sm"
                    disabled={attachedFile !== null}
                  />
                  
                  {attachedFile && (
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="absolute right-3 p-1 hover:bg-[#20346c] rounded-full text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="p-2.5 bg-teal-500 hover:bg-teal-600 rounded-xl text-white transition-all shrink-0 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-brand-secondary/45">
              <MessageSquare className="w-16 h-16 mb-4 text-[#1d2d5a]" />
              <h2 className="text-xl font-bold text-white mb-1">Select a Conversation</h2>
              <p className="text-sm max-w-xs text-brand-secondary/70">
                Pick a chat thread from the left panel to begin managing customer inquiries or review AI actions.
              </p>
            </div>
          )}
        </div>

        {/* Right side: AI Qualification insights sidebar */}
        {selectedConv && (
          <div className="w-80 border-l border-[#1c2d5a] bg-[#0c1635] flex flex-col overflow-y-auto shrink-0 p-4 space-y-6">
            
            {/* Qualification Form */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-[#1c2d5a] pb-2 text-white">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-sm uppercase tracking-wide">Lead Qualifications</h2>
              </div>

              <form onSubmit={handleUpdateQualification} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                    Pet Type
                  </label>
                  <input
                    type="text"
                    value={qualForm.petType}
                    onChange={(e) => setQualForm({ ...qualForm, petType: e.target.value })}
                    className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    placeholder="Dog, Cat, etc."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                    Pet Breed
                  </label>
                  <input
                    type="text"
                    value={qualForm.breed}
                    onChange={(e) => setQualForm({ ...qualForm, breed: e.target.value })}
                    className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    placeholder="Labrador, German Shepherd"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                    City Location
                  </label>
                  <input
                    type="text"
                    value={qualForm.city}
                    onChange={(e) => setQualForm({ ...qualForm, city: e.target.value })}
                    className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    placeholder="Hyderabad, Delhi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                      Intent
                    </label>
                    <input
                      type="text"
                      value={qualForm.intent}
                      onChange={(e) => setQualForm({ ...qualForm, intent: e.target.value })}
                      className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                      placeholder="Buy / Adoption"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                      Urgency
                    </label>
                    <select
                      value={qualForm.urgency}
                      onChange={(e) => setQualForm({ ...qualForm, urgency: e.target.value })}
                      className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                      Budget
                    </label>
                    <input
                      type="text"
                      value={qualForm.budget}
                      onChange={(e) => setQualForm({ ...qualForm, budget: e.target.value })}
                      className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                      placeholder="E.g. $500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-secondary/60 mb-1">
                      Interest Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={qualForm.interestScore}
                      onChange={(e) => setQualForm({ ...qualForm, interestScore: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingQual}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-xs transition-colors"
                >
                  {savingQual ? "Saving..." : "Update Qualification Data"}
                </button>
              </form>
            </div>

            {/* AI Tags Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-[#1c2d5a] pb-2 text-white">
                <Tag className="w-5 h-5 text-teal-400" />
                <h2 className="font-bold text-sm uppercase tracking-wide">Lead Tags</h2>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {(selectedConv.leadId?.aiTags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500/10 text-teal-300 rounded-full text-xs font-semibold"
                  >
                    {tag}
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      className="text-teal-400 hover:text-red-400 transition-colors ml-1 font-bold text-[10px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="flex-grow bg-[#101b3f] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                />
                <button
                  type="submit"
                  className="px-3 bg-[#20346c] hover:bg-[#2e4a9c] text-white rounded-lg text-xs"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Summary Insights */}
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-[#1c2d5a] pb-2 text-white">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-sm uppercase tracking-wide">Conversation Insights</h2>
              </div>
              
              <div className="space-y-3.5 bg-[#101b3f]/40 p-3 rounded-xl border border-[#1b2d5a]/60 text-xs">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/50 mb-1">
                    AI Summary
                  </h4>
                  <p className="text-brand-secondary/90 leading-relaxed font-medium">
                    {selectedConv.leadId?.conversationSummary || "No summary compiled yet."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/50 mb-0.5">
                      Sentiment
                    </h4>
                    <span className="font-bold text-white text-xs">
                      {selectedConv.leadId?.sentiment || "Neutral"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/50 mb-0.5">
                      Prob. Conversion
                    </h4>
                    <span className="font-bold text-teal-400 text-xs flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {selectedConv.leadId?.probabilityOfConversion ?? 50}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary/50 mb-1">
                    Next Action
                  </h4>
                  <p className="text-white font-semibold">
                    {selectedConv.leadId?.nextAction || "None"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Tools */}
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-[#1c2d5a] pb-2 text-white">
                <UserCheck className="w-5 h-5 text-teal-400" />
                <h2 className="font-bold text-sm uppercase tracking-wide">CRM Actions</h2>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setFollowUpOpen(true)}
                  className="flex items-center justify-center gap-2 w-full bg-[#1c2d5a] hover:bg-[#253b75] text-white py-2 rounded-lg text-xs font-semibold transition-all border border-[#2b427b]"
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Schedule Follow Up
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* FAQ / Knowledge Base Settings Drawer */}
      {kbOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-96 bg-[#0c1635] text-white h-full flex flex-col shadow-2xl border-l border-[#1c2d5a]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1c2d5a]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-md text-white">AI Knowledge Base FAQs</h3>
              </div>
              <button
                onClick={() => setKbOpen(false)}
                className="p-1 hover:bg-[#1c2d5a] rounded-lg text-brand-secondary/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KB Form & FAQs listing */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* FAQ insert form */}
              <form onSubmit={handleCreateKB} className="bg-[#101b3f] p-3.5 rounded-xl border border-[#20346c] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wide text-teal-400">Add New AI Document</h4>
                
                <div>
                  <label className="block text-[10px] text-brand-secondary/65 font-semibold mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={newKB.title}
                    onChange={(e) => setNewKB({ ...newKB, title: e.target.value })}
                    className="w-full bg-[#0a1128] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    placeholder="e.g. Dog Boarding Price Sheet"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-brand-secondary/65 font-semibold mb-1">Content Details / Policy text</label>
                  <textarea
                    required
                    rows={4}
                    value={newKB.content}
                    onChange={(e) => setNewKB({ ...newKB, content: e.target.value })}
                    className="w-full bg-[#0a1128] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    placeholder="e.g. Basic Grooming is $50, Full Training is $350..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-brand-secondary/65 font-semibold mb-1">Category</label>
                    <select
                      value={newKB.type}
                      onChange={(e) => setNewKB({ ...newKB, type: e.target.value })}
                      className="w-full bg-[#0a1128] border border-[#20346c] text-white text-xs rounded-lg p-2 outline-none"
                    >
                      <option value="faq">FAQ</option>
                      <option value="company_info">Company Info</option>
                      <option value="pricing">Pricing</option>
                      <option value="service">Service Catalog</option>
                      <option value="policy">Terms & Policy</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={savingKB}
                      className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-xs"
                    >
                      {savingKB ? "Saving..." : "Add Entry"}
                    </button>
                  </div>
                </div>
              </form>

              {/* List of active FAQs */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wide text-indigo-400">Current Knowledge Base entries ({kbItems.length})</h4>
                
                {kbItems.length === 0 ? (
                  <p className="text-xs text-brand-secondary/50 text-center py-4">No documents configured.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {kbItems.map(item => (
                      <li key={item.id} className="bg-[#101b3f]/40 p-3 rounded-lg border border-[#1b2d5a]/60 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-bold text-white">{item.title}</h5>
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-300 font-bold px-1.5 py-0.5 rounded-md uppercase mt-1 inline-block">
                              {item.type}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteKB(item.id)}
                            className="p-1 hover:bg-red-500/15 rounded text-red-400 transition-all shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-brand-secondary/80 leading-relaxed mt-2 line-clamp-3">
                          {item.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Follow Up scheduling modal */}
      {followUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-96 bg-[#0c1635] text-white rounded-2xl shadow-2xl border border-[#1c2d5a] p-5">
            <div className="flex items-center justify-between mb-4 border-b border-[#1c2d5a] pb-2">
              <h3 className="font-bold text-md flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-teal-400" />
                Schedule CRM Follow Up
              </h3>
              <button
                onClick={() => setFollowUpOpen(false)}
                className="p-1 hover:bg-[#1c2d5a] rounded-lg text-brand-secondary/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-secondary/65 font-bold uppercase tracking-wider mb-1 text-[9px]">
                  Method Mode
                </label>
                <select
                  value={followUpData.type}
                  onChange={(e) => setFollowUpData({ ...followUpData, type: e.target.value })}
                  className="w-full bg-[#101b3f] border border-[#20346c] text-white rounded-lg p-2.5 outline-none"
                >
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Call">Phone Call</option>
                  <option value="Email">Email Broadcast</option>
                  <option value="Meeting">In-Person Meeting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-secondary/65 font-bold uppercase tracking-wider mb-1 text-[9px]">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    required
                    value={followUpData.date}
                    onChange={(e) => setFollowUpData({ ...followUpData, date: e.target.value })}
                    className="w-full bg-[#101b3f] border border-[#20346c] text-white rounded-lg p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-brand-secondary/65 font-bold uppercase tracking-wider mb-1 text-[9px]">
                    Schedule Time
                  </label>
                  <input
                    type="text"
                    required
                    value={followUpData.time}
                    onChange={(e) => setFollowUpData({ ...followUpData, time: e.target.value })}
                    className="w-full bg-[#101b3f] border border-[#20346c] text-white rounded-lg p-2.5 outline-none"
                    placeholder="e.g. 11:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-secondary/65 font-bold uppercase tracking-wider mb-1 text-[9px]">
                  Priority
                </label>
                <div className="flex gap-4 mt-1">
                  {["Low", "Medium", "High"].map((p) => (
                    <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={followUpData.priority === p}
                        onChange={(e) => setFollowUpData({ ...followUpData, priority: e.target.value })}
                        className="text-teal-400 focus:ring-0 bg-transparent border-[#20346c]"
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-brand-secondary/65 font-bold uppercase tracking-wider mb-1 text-[9px]">
                  Task Notes / Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={followUpData.notes}
                  onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
                  className="w-full bg-[#101b3f] border border-[#20346c] text-white rounded-lg p-2.5 outline-none"
                  placeholder="Task instruction for sales agent..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-lg"
              >
                Schedule Task
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
