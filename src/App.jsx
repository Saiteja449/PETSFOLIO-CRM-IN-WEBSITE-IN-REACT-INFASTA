import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// System Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { LeadsProvider } from "./context/LeadsContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { DashboardProvider } from "./context/DashboardContext.jsx";

// Modular Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leads from "./pages/Leads.jsx";
import LeadDetails from "./pages/LeadDetails.jsx";
import TeamPerformance from "./pages/TeamPerformance.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import Settings from "./pages/Settings.jsx";

// Reusable Layout Components
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

// Protected Pipeline Wrapper holds Layout Sidebar/Header and content boxes
function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Responsive Left Drawers */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Right Column Container */}
      <div className="flex-grow flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        <Header handleDrawerToggle={handleDrawerToggle} />
        <main className="flex-grow pb-6 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Global Routing Configurations with Context Nesting
export default function App() {
  return (
    <AuthProvider>
      <LeadsProvider>
        <NotificationProvider>
          <DashboardProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Entrance */}
                <Route path="/login" element={<Login />} />

                {/* Private Layout Shell */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/lead-details/:id" element={<LeadDetails />} />
                  <Route
                    path="/pipeline"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/services"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/followups"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/performance" element={<TeamPerformance />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                  <Route path="/settings" element={<Settings />} />

                  {/* Root Redirects */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Route>

                {/* Fallback Redirection */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </BrowserRouter>
          </DashboardProvider>
        </NotificationProvider>
      </LeadsProvider>
    </AuthProvider>
  );
}
