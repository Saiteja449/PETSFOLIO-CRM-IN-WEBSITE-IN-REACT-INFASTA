import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import RootProvider from "./context/RootProvider.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leads from "./pages/Leads.jsx";
import LeadDetails from "./pages/LeadDetails.jsx";
import TeamPerformance from "./pages/TeamPerformance.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import FollowUpReport from "./pages/FollowUpReport.jsx";
import SalesPersonDetails from "./pages/SalesPersonDetails.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

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
    <div className="flex min-h-screen bg-brand-light text-brand-primary font-sans">
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <div className="flex-grow flex flex-col min-h-screen md:ml-64 transition-all duration-300 min-w-0">
        <Header handleDrawerToggle={handleDrawerToggle} />
        <main className="flex-grow pb-6 flex flex-col min-w-0 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RootProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Navigate to="/leads/new" replace />} />
            <Route path="/leads/:statusParam" element={<Leads />} />
            <Route path="/lead-details/:id" element={<LeadDetails />} />
            <Route
              path="/pipeline"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="/services"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route path="/followups" element={<FollowUpReport />} />
            <Route path="/performance" element={<TeamPerformance />} />
            <Route path="/salesperson/:name" element={<SalesPersonDetails />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </RootProvider>
  );
}
