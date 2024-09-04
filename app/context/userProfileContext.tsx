import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useUserContext } from "./userContext";

interface Profile {
  role: string;
}

interface User {
  id: string;
  role: string;
  name: string;
}

interface UserContextType {
  userRole: string | null;
  allUsers: User[] | null;
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => void; // Add refreshUsers to the context type
}

const UserProfileContext = createContext<UserContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userID } = useUserContext();

  // Fetch user profile and all users
  const fetchUserProfileAndUsers = async () => {
    if (!userID) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch user role
      const roleResponse = await fetch(`/api/userProfile/fetch/${userID}`);
      const roleResult = await roleResponse.json();

      if (!roleResponse.ok) {
        throw new Error(roleResult.error || "Failed to fetch user profile");
      }

      setUserRole(roleResult.role);

      // Fetch all users
      const usersResponse = await fetch(`/api/userProfile/fetchAll`);
      const usersResult = await usersResponse.json();

      if (!usersResponse.ok) {
        throw new Error(usersResult.error || "Failed to fetch users");
      }

      setAllUsers(usersResult);
    } catch (error: any) {
      setError(error.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh users function
  const refreshUsers = () => {
    fetchUserProfileAndUsers();
  };

  useEffect(() => {
    fetchUserProfileAndUsers();
  }, [userID]);

  return (
    <UserProfileContext.Provider value={{ userRole, allUsers, isLoading, error, refreshUsers }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  }
  return context;
};
