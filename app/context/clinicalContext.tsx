import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";

interface ClinicalLog {
  id: number;
  created_at: string;
  user_Id: string;
  direct_Hours: any;
  indirect_Hours: any;
  supervision_Hours: any;
  site: string;
  date_logged: any
}

interface ClinicalLogsContextType {
  clinicalLogs: ClinicalLog[];
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
  const [loading, setLoading] = useState(false);

  const fetchClinicalLogs = async () => {
    if (!userID) return;
    try {
      const response = await fetch(`/api/clinicalHours/fetch/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate", 
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch clinical logs");
      }
      const data: ClinicalLog[] = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching clinical logs:", error);
    }
  };

  const refreshLogs = async () => {
    setLoading(true); 
    await fetchClinicalLogs();
    setLoading(false); 
  };

  useEffect(() => {
    if (userID && !loading) {
      fetchClinicalLogs();
    }
  }, [userID, loading]);

  return (
    <ClinicalLogsContext.Provider
      value={{
        clinicalLogs,
        setLogs,
        refreshLogs,
      }}
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
