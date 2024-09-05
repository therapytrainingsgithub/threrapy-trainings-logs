import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";

interface SupervisionLog {
  id: number;
  week: string;
  created_at: string;
  supervision_Hours: number;
  user_Id : string
}

interface SupervisionLogsContextType {
  supervisionLogs: SupervisionLog[];
  setLogs: React.Dispatch<React.SetStateAction<SupervisionLog[]>>;
  refreshLogs: () => void;
}

const SupervisionLogsContext = createContext<
  SupervisionLogsContextType | undefined
>(undefined);

export const SupervisionLogsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { userID } = useUserContext();
  const [supervisionLogs, setLogs] = useState<SupervisionLog[]>([]);

  const fetchSupervisionLogs = async () => {
    if (!userID) {
      return;
    }


    try {
      const response = await fetch(`/api/supervisionHours/fetch/${userID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch supervision logs");
      }
      const data: SupervisionLog[] = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching supervision logs:", error);
    }
  };

  const refreshLogs = () => {
    fetchSupervisionLogs();
  };

  useEffect(() => {
    fetchSupervisionLogs();
  }, [userID]);

  return (
    <SupervisionLogsContext.Provider value={{ supervisionLogs, setLogs, refreshLogs }}>
      {children}
    </SupervisionLogsContext.Provider>
  );
};

export const useSupervisionLogsContext = () => {
  const context = useContext(SupervisionLogsContext);
  if (context === undefined) {
    throw new Error(
      "useSupervisionLogsContext must be used within a SupervisionLogsProvider"
    );
  }
  return context;
};
