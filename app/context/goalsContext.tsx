// src/context/goalsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";

interface Goal {
  id: number;
  created_at: string;
  user_id: string;
  clinical_Hours: number;
  supervision_Hours: number;
}

interface GoalsContextType {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  refreshGoals: () => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userID } = useUserContext(); // Assume useUserContext provides user ID
  const [goals, setGoals] = useState<Goal[]>([]);

  // Fetch goals from the API based on userID
  const fetchGoals = async () => {
    if (!userID) {
      return;
    }

    try {
      const response = await fetch(`/api/goals/fetch/${userID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data: Goal[] = await response.json();
      console.log(data)
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Add the refreshGoals function, which simply re-fetches goals
  const refreshGoals = () => {
    fetchGoals(); // Call fetchGoals to refresh the goals state
  };

  // Fetch goals when the component mounts and whenever the user ID changes
  useEffect(() => {
    fetchGoals();
  }, [userID]); // Re-fetch goals if the userID changes

  return (
    <GoalsContext.Provider value={{ goals, setGoals, refreshGoals }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoalsContext = () => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error("useGoalsContext must be used within a GoalsProvider");
  }
  return context;
};
