import React, { useEffect, useState } from "react";
import Table from "./table";
import { useUserProfileContext } from "@/app/context/userProfileContext";

interface User {
  id: string;
  role: string;
  name: string;
}

const AdminSupervisor: React.FC = () => {
  const { allUsers } = useUserProfileContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (allUsers) {
      const filteredUsers = allUsers.filter(
        (user: User) => user.role === "supervisor"
      );
      setUsers(filteredUsers);
    }
  }, [allUsers]);

  const headers = ["Name"];

  const data = users.map((user) => ({
    Name: user.name,
  }));

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] text-[#709D50] mb-4 md:mb-0">Supervisors</h1>
      </div>

      <div className="bg-[#FCFEF2] p-4 md:p-10 rounded-xl border overflow-x-auto">
        <Table headers={headers} data={data} />
      </div>
    </main>
  );
};

export default AdminSupervisor;
