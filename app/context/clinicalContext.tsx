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
  allClinicalLogs: ClinicalLog[];
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
  const [allClinicalLogs, setAllLogs] = useState<ClinicalLog[]>([]);
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch logs specific to the current user
  const fetchClinicalLogs = async () => {
    if (!userID) return; // Ensure userID exists before making the request
    try {
      const response = await fetch(`/api/clinicalHours/fetch/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
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

  // Fetch all clinical logs (for admin or higher-level users)
  const fetchAllClinicalLogs = async () => {
    try {
      const response = await fetch(`/api/clinicalHours/fetchAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate", // Ensure no caching
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all clinical logs");
      }

      const data: ClinicalLog[] = await response.json();
      setAllLogs(data); // Store the fetched logs in state
    } catch (error) {
      console.error("Error fetching all clinical logs:", error);
    }
  };

  // Function to refresh both user-specific and all logs
  const refreshLogs = () => {
    setLoading(true); // Set loading before fetching
    Promise.all([fetchClinicalLogs(), fetchAllClinicalLogs()]).finally(() =>
      setLoading(false)
    );
  };

  // Fetch logs when userID changes or component mounts
  useEffect(() => {
    if (userID && !loading) {
      fetchClinicalLogs(); // Fetch user-specific logs on mount or userID change
      fetchAllClinicalLogs(); // Fetch all logs on mount
    }
  }, [userID, loading]); // Make sure not to refetch when loading

  return (
    <ClinicalLogsContext.Provider
      value={{ clinicalLogs, allClinicalLogs, setLogs, refreshLogs }}
    >
      {children}
    </ClinicalLogsContext.Provider>
  );
};

// Hook to use the clinical logs context
export const useClinicalLogsContext = () => {
  const context = useContext(ClinicalLogsContext);
  if (context === undefined) {
    throw new Error(
      "useClinicalLogsContext must be used within a ClinicalLogsProvider"
    );
  }
  return context;
};
