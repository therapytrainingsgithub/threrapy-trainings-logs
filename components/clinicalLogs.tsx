import React, { useState } from "react";
import Table from "./table";
import NewClinicalLog from "./newClinicalLog";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import Dropdown from "./dropdown";

const ClinicalLogs: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { clinicalLogs, refreshLogs } = useClinicalLogsContext();

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  const deleteLog = async (id: string | number | undefined): Promise<void> => {
    try {
      const response = await fetch(`/api/clinicalHours/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete log:", errorText);
        return;
      }

      const result = await response.json();
      refreshLogs();
      console.log("Log deleted successfully:", result);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

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
    "Direct Hours",
    "Indirect Hours",
    "Site",
    "Supervisor",
    "Status",
    "Action",
  ];

  const data = clinicalLogs.map((log) => {
    const [year, week] = log.week.split("-W");
    const { start, end } = getWeekDates(parseInt(year, 10), parseInt(week, 10));

    return {
      "Week Logged": `${log.week}-${start} to ${end}`,
      "Date Logged": new Date(log.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      "Direct Hours": log.direct_Hours,
      "Indirect Hours": log.indirect_Hours,
      Site: log.site ?? "N/A",
      Supervisor: log.supervisor ?? "N/A",
      Status: capitalizeFirstLetter(log.status),
      "Week Date Range": `${start} to ${end}`,
      Action: (
        <Dropdown
          status={log.status}
          id={log.id}
          deleteLog={deleteLog}
          PopupContent={({ closePopup }) => (
            <NewClinicalLog
              closePopup={closePopup}
              refreshLogs={refreshLogs}
              existingLog={{
                id: log.id,
                week: log.week,
                direct_Hours: log.direct_Hours,
                indirect_Hours: log.indirect_Hours,
                site: log.site,
                supervisor: log.supervisor,
                status: log.status,
              }}
              mode="update"
            />
          )}
        />
      ),
    };
  });

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0">Clinical Hours Logged</h1>
        <button
          onClick={openPopup}
          className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
        >
          Log Hours
        </button>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-md border shadow-lg overflow-x-auto">
        <Table headers={headers} data={data} />
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%]"
            style={{
              background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-2xl mb-4 text-[#709D50]">Log New Hours</h2>
            <NewClinicalLog
              closePopup={closePopup}
              refreshLogs={refreshLogs}
              mode="create"
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

export default ClinicalLogs;
