import React from "react";
import { AuthProvider } from "./AuthContext.jsx";
import { LeadsProvider } from "./LeadsContext.jsx";
import { NotificationProvider } from "./NotificationContext.jsx";
import { DashboardProvider } from "./DashboardContext.jsx";
import { TargetsProvider } from "./TargetsContext.jsx";

export default function RootProvider({ children }) {
  return (
    <AuthProvider>
      <LeadsProvider>
        <NotificationProvider>
          <DashboardProvider>
            <TargetsProvider>
              {children}
            </TargetsProvider>
          </DashboardProvider>
        </NotificationProvider>
      </LeadsProvider>
    </AuthProvider>
  );
}

