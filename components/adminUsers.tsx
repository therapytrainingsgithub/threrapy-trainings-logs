import React, { useEffect, useState } from "react";
import Table from "./table";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import AdminRequest from "./adminRequest";

interface User {
  id: string;
  role: string;
  name: string;
}

const AdminUsers: React.FC = () => {
  const { allUsers, refreshUsers } = useUserProfileContext();
  const [users, setUsers] = useState<User[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<Record<
    string,
    React.ReactNode
  > | null>(null);

  useEffect(() => {
    if (allUsers) {
      const filteredUsers = allUsers.filter(
        (user: User) => user.role === "user"
      );
      setUsers(filteredUsers);
    }
  }, [allUsers]);

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

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] text-[#709D50] mb-4 md:mb-0">Users</h1>
      </div>

      <div className="bg-[#FCFEF2] p-4 md:p-10 rounded-xl border overflow-x-auto">
        <Table headers={headers} data={data} onRowClick={openPopup} />
      </div>

      {isPopupOpen && selectedUserData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%]"
            style={{
              background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <AdminRequest
              user={selectedUserData}
              closePopup={closePopup}
              refresh={refreshUsers}
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
