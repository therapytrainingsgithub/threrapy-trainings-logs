import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useUserContext } from "./userContext";

interface Profile {
  role: string;
  name: string; // Add the name property here
}

interface User {
  id: string;
  role: string;
  name: string;
}

interface UserContextType {
  userRole: string | null;
  userName: string | null; // Add userName to the context type
  allUsers: User[] | null;
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => void;
}

const UserProfileContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Add state for userName
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
      // Fetch user profile
      const profileResponse = await fetch(`/api/userProfile/fetch/${userID}`);
      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileResult.error || "Failed to fetch user profile");
      }
      setUserRole(profileResult.role);
      setUserName(profileResult.name);

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
    <UserProfileContext.Provider
      value={{ userRole, userName, allUsers, isLoading, error, refreshUsers }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error(
      "useUserProfileContext must be used within a UserProfileProvider"
    );
  }
  return context;
};
