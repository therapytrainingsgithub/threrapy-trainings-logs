import React, { useEffect, useState } from "react";
import Table from "./table";
import AdminRequest from "./adminRequest";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  role: string;
  name: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<Record<
    string,
    React.ReactNode
  > | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch users directly from Supabase
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      // Filter users based on role
      const filteredUsers = data.filter((user: User) => user.role === "user");
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const headers = ["Name"];

  const data = users.map((user) => ({
    Name: user.name,
    id: user.id,
  }));

  const openPopup = (rowData: Record<string, React.ReactNode>) => {
    setSelectedUserData(rowData);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUserData(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0">Users</h1>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-md shadow-lg border overflow-x-auto">
        <Table
          headers={headers}
          data={data}
          onRowClick={openPopup}
          editable={true}
        />
      </div>

      {isPopupOpen && selectedUserData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="p-5 rounded-md shadow-lg w-[90%] bg-white">
            <AdminRequest
              user={selectedUserData}
              closePopup={closePopup}
              refresh={fetchUsers} 
              role = {"user"}
            />
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUsers;
