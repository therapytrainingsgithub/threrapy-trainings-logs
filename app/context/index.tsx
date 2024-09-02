import React from "react";
import { UserProvider } from "./userContext";
import ClinicalLogs from "@/components/clinicalLogs";
import { ClinicalLogsProvider } from "./clinicalContext";
import { SupervisionLogsProvider } from "./supervisionContext";
import { GoalsProvider } from "./goalsContext";
import { UserProfileProvider } from "./userProfileContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UserProvider>
      <UserProfileProvider>
        <ClinicalLogsProvider>
          <SupervisionLogsProvider>
            <GoalsProvider>{children}</GoalsProvider>
          </SupervisionLogsProvider>
        </ClinicalLogsProvider>
      </UserProfileProvider>
    </UserProvider>
  );
};

export default AppProviders;
