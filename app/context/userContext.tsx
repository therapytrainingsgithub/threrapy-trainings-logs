import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Ensure this is the correct path

interface UserContextType {
  userID: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Failed to fetch user");
        return;
      }
      setUserID(user.id);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userID }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
