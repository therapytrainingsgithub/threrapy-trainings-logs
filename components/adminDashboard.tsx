import React, { useEffect, useState } from "react";
import AdminUsers from "./adminUsers";
import AdminSupervisor from "./adminSupervisor";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  role: string;
  name: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      // Filter based on roles and store separately
      const filteredUsers = data.filter((user: User) => user.role === "user");
      const filteredSupervisors = data.filter(
        (user: User) => user.role === "supervisor"
      );

      setUsers(filteredUsers);
      setSupervisors(filteredSupervisors);
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both users and supervisors on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-10 p-4 md:p-10">
      {/* Users Section */}
      <AdminUsers users={users} refreshData={fetchUsers} />

      {/* Supervisors Section */}
      <AdminSupervisor supervisors={supervisors} refreshData={fetchUsers} />
    </div>
  );
};

export default AdminDashboard;
