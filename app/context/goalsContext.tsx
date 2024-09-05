// src/context/goalsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserContext } from "./userContext"; // Import user context

interface Goal {
  id: number;
  created_at: string;
  description: string;
  user_id: string;
  clinical_Hours: number;
  supervision_Hours: number;
  week: string;
}

interface GoalsContextType {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  refreshGoals: () => void; // Add refreshGoals function
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userID } = useUserContext();
  const [goals, setGoals] = useState<Goal[]>([]);

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
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Add the refreshGoals function
  const refreshGoals = () => {
    fetchGoals();
  };

  useEffect(() => {
    fetchGoals();
  }, [userID]); // Refetch if user changes

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
