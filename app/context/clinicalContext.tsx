import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";

interface ClinicalLog {
  id: number;
  created_at: string;
  week: string;
  user_id: string;
  direct_Hours: string;
  indirect_Hours: string;
  supervision_Hours: string;
  site: string;
}

interface ClinicalLogsContextType {
  clinicalLogs: ClinicalLog[];
  setLogs: React.Dispatch<React.SetStateAction<ClinicalLog[]>>;
}

const ClinicalLogsContext = createContext<ClinicalLogsContextType | undefined>(undefined);

export const ClinicalLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userID } = useUserContext();
  const [clinicalLogs, setLogs] = useState<ClinicalLog[]>([]);

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

  useEffect(() => {
    fetchClinicalLogs();
  }, [userID]); // Refetch if user changes

  return (
    <ClinicalLogsContext.Provider value={{ clinicalLogs, setLogs }}>
      {children}
    </ClinicalLogsContext.Provider>
  );
};

export const useClinicalLogsContext = () => {
  const context = useContext(ClinicalLogsContext);
  if (context === undefined) {
    throw new Error('useClinicalLogsContext must be used within a ClinicalLogsProvider');
  }
  return context;
};
