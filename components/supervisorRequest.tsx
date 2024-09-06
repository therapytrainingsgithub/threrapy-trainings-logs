import React, { useEffect, useState } from "react";
import Table from "./table";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { useUserContext } from "@/app/context/userContext";
import Request from "./request";

interface ClinicalLog {
  id: number;
  created_at: string;
  week: string;
  direct_Hours: string;
  indirect_Hours: string;
  site: string;
  status: string;
  user_Id: string;
  supervisor_Id: string;
}

interface User {
  id: string;
  role: string;
  name: string;
}

const SupervisorRequest: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLogData, setSelectedLogData] = useState<Record<
    string,
    React.ReactNode
  > | null>(null);
  const { allClinicalLogs, refreshLogs } = useClinicalLogsContext();
  const { allUsers } = useUserProfileContext();
  const { userID } = useUserContext();

  const [supervisorsLogs, setSupervisorsLogs] = useState<ClinicalLog[]>([]);

  // Capitalize first letter of status
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Filter logs by supervisor ID whenever logs are updated
  useEffect(() => {
    const logsForSupervisor = allClinicalLogs.filter(
      (log) => log.supervisor_Id === userID
    );
    setSupervisorsLogs(logsForSupervisor);
  }, [allClinicalLogs, userID]);

  function getWeekDates(year: number, week: number) {
    const startDate = new Date(year, 0, 1 + (week - 1) * 7); // Start of the year + (week - 1) * 7 days
    const dayOfWeek = startDate.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
    const start = new Date(
      startDate.setDate(startDate.getDate() - dayOfWeek + 1)
    ); // Adjust to Monday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of the week (Sunday)

    return {
      start: start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      end: end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  }

  const headers = [
    "Week Logged",
    "Date Logged",
    "User",
    "Direct Hours",
    "Indirect Hours",
    "Site",
    "Status",
  ];

  const data = supervisorsLogs.map((log) => {
    const user = allUsers?.find((user) => user.id === log.user_Id);
    const [year, week] = log.week.split("-W");
    const { start, end } = getWeekDates(parseInt(year, 10), parseInt(week, 10));

    return {
      Log_Id: log.id,
      "Week Logged": `${log.week}-${start} to ${end}`,
      "Date Logged": new Date(log.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      User: user ? user.name : "Unknown",
      "Direct Hours": log.direct_Hours,
      "Indirect Hours": log.indirect_Hours,
      Site: log.site ?? "N/A",
      Status: capitalizeFirstLetter(log.status),
    };
  });

  const openPopup = (rowData: Record<string, React.ReactNode>) => {
    setSelectedLogData(rowData); // Set the entire row data as the selected log data
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedLogData(null);
    refreshLogs(); // Refresh the logs after closing the popup
  };

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0">Request for Logged Hours</h1>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-md shadow-lg border overflow-x-auto">
        <Table
          headers={headers}
          data={data}
          onRowClick={openPopup}
          editable={true}
        />
      </div>

      {isPopupOpen && selectedLogData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%]"
            style={{
              background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-2xl mb-4 text-[#709D50]">Log Details</h2>
            <Request
              log={selectedLogData}
              closePopup={closePopup}
              refresh={refreshLogs}
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

export default SupervisorRequest;
