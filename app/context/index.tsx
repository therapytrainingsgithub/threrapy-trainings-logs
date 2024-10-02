import React from "react";
import { UserProvider } from "./userContext";
import { ClinicalLogsProvider } from "./clinicalContext";
import { SupervisionLogsProvider } from "./supervisionContext";
import { GoalsProvider } from "./goalsContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UserProvider>
        <ClinicalLogsProvider>
          <SupervisionLogsProvider>
            <GoalsProvider>{children}</GoalsProvider>
          </SupervisionLogsProvider>
        </ClinicalLogsProvider>
    </UserProvider>
  );
};

export default AppProviders;
