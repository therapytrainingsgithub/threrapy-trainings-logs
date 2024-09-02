import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";

interface ClinicalLog {
  id: number;
  created_at: string;
  week: string;
  user_Id: string;
  direct_Hours: string;
  indirect_Hours: string;
  supervision_Hours: string;
  site: string;
  supervisor: string;
  status: string;
  supervisor_Id: string;
}

interface ClinicalLogsContextType {
  clinicalLogs: ClinicalLog[];
  allClinicalLogs: ClinicalLog[]; // New state for all clinical logs
  setLogs: React.Dispatch<React.SetStateAction<ClinicalLog[]>>;
  refreshLogs: () => void;
}

const ClinicalLogsContext = createContext<ClinicalLogsContextType | undefined>(
  undefined
);

export const ClinicalLogsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userID } = useUserContext();
  const [clinicalLogs, setLogs] = useState<ClinicalLog[]>([]);
  const [allClinicalLogs, setAllLogs] = useState<ClinicalLog[]>([]); // New state for all clinical logs

  // Fetch logs specific to the user
  const fetchClinicalLogs = async () => {
    if (!userID) {
      return;
    }

    try {
      const response = await fetch(`/api/clinicalHours/fetch/${userID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch clinical logs");
      }
      const data: ClinicalLog[] = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching clinical logs:", error);
    }
  };

  // Fetch all logs
  const fetchAllClinicalLogs = async () => {
    try {
      const response = await fetch(`/api/clinicalHours/fetchAll`);
      if (!response.ok) {
        throw new Error("Failed to fetch all clinical logs");
      }
      const data: ClinicalLog[] = await response.json();
      setAllLogs(data);
    } catch (error) {
      console.error("Error fetching all clinical logs:", error);
    }
  };

  const refreshLogs = () => {
    fetchClinicalLogs();
    fetchAllClinicalLogs(); // Also refresh all clinical logs
  };

  useEffect(() => {
    fetchClinicalLogs();
    fetchAllClinicalLogs(); // Fetch all clinical logs on mount
  }, [userID]);

  return (
    <ClinicalLogsContext.Provider
      value={{ clinicalLogs, allClinicalLogs, setLogs, refreshLogs }}
    >
      {children}
    </ClinicalLogsContext.Provider>
  );
};

export const useClinicalLogsContext = () => {
  const context = useContext(ClinicalLogsContext);
  if (context === undefined) {
    throw new Error(
      "useClinicalLogsContext must be used within a ClinicalLogsProvider"
    );
  }
  return context;
};
