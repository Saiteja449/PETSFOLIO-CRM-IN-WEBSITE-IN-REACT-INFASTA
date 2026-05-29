import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Bell,
  Settings,
  LogOut,
  PawPrint,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";

const sidebarDrawerWidth = 260;

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const { unreadCount } = useNotifications();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
    },
    { text: "Leads", icon: <Users className="w-5 h-5" />, path: "/leads" },
    ...(currentUser?.role === "Sales Manager"
      ? [
          {
            text: "Recent Follow-ups",
            icon: <ClipboardList className="w-5 h-5" />,
            path: "/followups",
          },
        ]
      : []),
    ...(currentUser?.role === "Sales Manager"
      ? [
          {
            text: "Team Performance",
            icon: <BarChart2 className="w-5 h-5" />,
            path: "/performance",
          },
        ]
      : []),
    {
      text: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/notifications",
      badge: unreadCount,
    },
    {
      text: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  const handleNav = (path) => {
    navigate(path);
    if (handleDrawerToggle && mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-y-auto">
      {/* Brand Section */}
      <div className="p-5 flex items-center gap-3">
        <PawPrint className="w-8 h-8 text-teal-500" />
        <div>
          <h2 className="text-xl font-extrabold tracking-tight leading-tight text-white">
            Petsfolio
          </h2>
          <span className="text-xs font-medium text-zinc-400">
            Sales Operating System
          </span>
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* User Section */}
      {currentUser && (
        <div className="p-4 flex items-center gap-3 bg-zinc-950">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-zinc-950 shrink-0">
            {currentUser.avatar}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold truncate text-white">
              {currentUser.name}
            </div>
            <div className="text-xs font-medium text-teal-500 truncate">
              {currentUser.role}
            </div>
          </div>
        </div>
      )}

      <hr className="border-zinc-800 mb-2" />

      {/* Navigation Links */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/leads" &&
                location.pathname.startsWith("/lead-details"));
            return (
              <li key={item.text}>
                <button
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors border ${
                    isActive
                      ? "bg-zinc-900 text-teal-500 border-zinc-800"
                      : "bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span
                    className={`text-sm flex-1 text-left ${isActive ? "font-bold" : "font-medium"}`}
                  >
                    {item.text}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <hr className="border-zinc-800 mt-2" />

      {/* Logout button */}
      <div className="p-3">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold text-left">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={handleDrawerToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {drawerContent}
      </aside>
    </>
  );
}
export { sidebarDrawerWidth };
