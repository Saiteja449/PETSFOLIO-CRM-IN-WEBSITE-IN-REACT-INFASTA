import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, Plus, Search } from "lucide-react";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function Header({ handleDrawerToggle, onQuickAddLead }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  // Get dynamic title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard Overview";
    if (path.startsWith("/leads")) return "Leads Repository";
    if (path.startsWith("/lead-details")) return "Lead Workspace";
    if (path.startsWith("/pipeline")) return "Interactive Pipelines";
    if (path.startsWith("/services")) return "Service Offerings & Workflows";
    if (path.startsWith("/followups")) return "Follow-Up Agenda";
    if (path.startsWith("/performance")) return "Sales Leaderboard";
    if (path.startsWith("/notifications")) return "Alerts Panel";
    if (path.startsWith("/settings")) return "CRM Preferences";
    return "Sales Operating System";
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-light/80 backdrop-blur-md border-b border-brand-secondary text-brand-primary">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="md:hidden p-2 -ml-2 text-brand-primary/70 hover:text-brand-primary rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={handleDrawerToggle}
            aria-label="open drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-brand-primary truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Add Lead */}
          {onQuickAddLead && (
            <>
              <button
                type="button"
                onClick={onQuickAddLead}
                className="hidden sm:flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-brand-light"
              >
                <Plus className="w-4 h-4" />
                New Lead
              </button>
              <button
                type="button"
                onClick={onQuickAddLead}
                className="sm:hidden flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-brand-light rounded-full w-9 h-9 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="New Lead"
              >
                <Plus className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Alert Bell */}
          <button
            type="button"
            title="View System Notifications"
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-lg bg-brand-light border border-brand-secondary hover:bg-brand-secondary/30 transition-colors text-brand-primary/70 hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-brand-primary">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
