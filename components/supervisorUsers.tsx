import React, { useEffect, useState } from "react";
import Table from "./table";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { useUserContext } from "@/app/context/userContext";

interface ClinicalLog {
  created_at: string;
  week: string;
  direct_Hours: string;
  indirect_Hours: string;
  site: string;
  status: string;
  user_Id: string;
  supervisor_Id: string;
}

const SupervisorUsers: React.FC = () => {
  const { allClinicalLogs } = useClinicalLogsContext();
  const { allUsers } = useUserProfileContext();
  const { userID } = useUserContext();

  const [supervisorsLogs, setSupervisorsLogs] = useState<ClinicalLog[]>([]);

  useEffect(() => {
    const logsForSupervisor = allClinicalLogs.filter(
      (log) => log.supervisor_Id === userID
    );
    setSupervisorsLogs(logsForSupervisor);
  }, [allClinicalLogs, userID]);

  const headers = ["User"];

  const uniqueNames = new Set();

  const data = supervisorsLogs
    .map((log) => {
      const user = allUsers?.find((user) => user.id === log.user_Id);
      const userName = user ? user.name : "Unknown";

      if (!uniqueNames.has(userName)) {
        uniqueNames.add(userName);
        return {
          User: userName,
        };
      }

      return null;
    })
    .filter((entry) => entry !== null);

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0">Users Under Supervision</h1>
      </div>

      <div className="bg-white shadow-lg p-4 md:p-10 rounded-md border overflow-x-auto">
        <Table headers={headers} data={data} />
      </div>
    </main>
  );
};

export default SupervisorUsers;
