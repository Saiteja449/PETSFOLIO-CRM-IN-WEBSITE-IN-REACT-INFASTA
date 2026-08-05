import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, RefreshCw, Bot } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function TestAI() {
  if (import.meta.env.VITE_PROD === "true") {
    return <Navigate to="/dashboard" replace />;
  }

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [aiQualification, setAiQualification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = "http://localhost:5000/api/whatsapp/test-ai";

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setMessages(res.data.messages || []);
      setAiQualification(res.data.aiQualification || null);
      setLeadId(res.data.leadId);
    } catch (error) {
      console.error("Error fetching AI test history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, role: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const res = await axios.post(API_URL, {
        message: userMessage.text,
        leadId,
      });

      const aiResponse = { text: res.data.outgoing.text, role: "ai" };
      setMessages((prev) => [...prev, aiResponse]);
      setAiQualification(res.data.aiQualification);
    } catch (error) {
      console.error("Error sending message to AI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL, { reset: true, leadId });
      setMessages([]);
      setAiQualification(null);
      await fetchHistory();
    } catch (error) {
      console.error("Error resetting AI test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden gap-4 p-4">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-brand-light rounded-xl border border-brand-secondary overflow-hidden">
        <div className="p-4 border-b border-brand-secondary flex justify-between items-center bg-bg-main/50">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-bold text-brand-primary">
              AI Testing Interface
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-bg-main hover:bg-brand-secondary border border-brand-secondary rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center text-brand-primary/50 mt-10">
              No messages yet. Send a message to start testing the AI.
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-teal-500 text-brand-light rounded-tr-sm"
                    : "bg-bg-main border border-brand-secondary text-brand-primary rounded-tl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-bg-main border border-brand-secondary text-brand-primary rounded-2xl rounded-tl-sm px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-bg-main/50 border-t border-brand-secondary">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message to test AI..."
              className="flex-1 bg-brand-light border border-brand-secondary rounded-lg px-4 py-2 text-brand-primary focus:outline-none focus:border-teal-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-teal-500 text-brand-light px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Qualification Area */}
      <div className="w-80 flex flex-col bg-brand-light rounded-xl border border-brand-secondary overflow-hidden">
        <div className="p-4 border-b border-brand-secondary bg-bg-main/50">
          <h2 className="text-lg font-bold text-brand-primary">
            AI Qualification
          </h2>
          <p className="text-xs text-brand-primary/70">Extracted details</p>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {aiQualification ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <div className="text-brand-primary/70">Pet Type</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.petType || "-"}
                </div>

                <div className="text-brand-primary/70">Breed</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.breed || "-"}
                </div>

                <div className="text-brand-primary/70">Pet Age</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.petAge || "-"}
                </div>

                <div className="text-brand-primary/70">City</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.city || "-"}
                </div>

                <div className="text-brand-primary/70">Intent</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.intent || "-"}
                </div>

                <div className="text-brand-primary/70">Budget</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.budget || "-"}
                </div>

                <div className="text-brand-primary/70">Urgency</div>
                <div className="font-medium text-brand-primary">
                  {aiQualification.urgency || "-"}
                </div>
              </div>

              {aiQualification.specialRequirements && (
                <div>
                  <div className="text-brand-primary/70 text-sm mb-1">
                    Special Requirements
                  </div>
                  <div className="p-2 bg-bg-main rounded border border-brand-secondary text-sm text-brand-primary">
                    {aiQualification.specialRequirements}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-brand-secondary">
                <div className="text-brand-primary/70 text-sm mb-1">
                  Interest Score
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-brand-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (aiQualification.interestScore || 0) > 7
                          ? "bg-green-500"
                          : (aiQualification.interestScore || 0) > 4
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(aiQualification.interestScore || 0) * 10}%`,
                      }}
                    />
                  </div>
                  <span className="font-bold text-brand-primary">
                    {aiQualification.interestScore || 0}/10
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-brand-primary/50 mt-10">
              No qualification data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
