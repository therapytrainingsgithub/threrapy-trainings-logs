import React, { useEffect, useState } from "react";
import Table from "./table";
import { supabase } from "@/lib/supabase"; // Ensure that your supabase client is properly imported

interface User {
  id: string;
  role: string;
  name: string;
}

const AdminSupervisor: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Fetch supervisors directly from Supabase
  const fetchSupervisors = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*");

      if (error) {
        console.error("Error fetching supervisors:", error);
        return;
      }

      // Filter supervisors based on role
      const filteredUsers = data.filter(
        (user: User) => user.role === "supervisor"
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };

  // Fetch the supervisors on component mount
  useEffect(() => {
    fetchSupervisors();
  }, []);

  const headers = ["Name"];

  const data = users.map((user) => ({
    Name: user.name,
  }));

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0">Supervisors</h1>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-md shadow-lg border overflow-x-auto">
        <Table headers={headers} data={data} />
      </div>
    </main>
  );
};

export default AdminSupervisor;
