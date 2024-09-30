import React, { useEffect, useState } from "react";
import Table from "./table";

interface User {
  id: string;
  role: string;
  name: string;
}

const AdminSupervisor: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Fetch supervisors from the API
  const fetchSupervisors = async () => {
    try {
      const response = await fetch("/api/userProfile/fetchAll"); // Call the API route
      const data = await response.json();

      if (response.ok) {
        // Filter supervisors based on role
        const filteredUsers = data.filter(
          (user: User) => user.role === "supervisor"
        );
        setUsers(filteredUsers);
      } else {
        console.error("Error fetching supervisors:", data.error);
      }
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
