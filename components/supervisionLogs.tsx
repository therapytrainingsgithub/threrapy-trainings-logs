import React, { useState } from "react";
import Table from "./table";
import NewSupervisionLog from "./newSupervisionLog";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import Dropdown from "./dropdown";

const SupervisionLogs: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { supervisionLogs, refreshLogs } = useSupervisionLogsContext();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const updateLog = async (
    id: number,
    updatedFields: { [key: string]: any }
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/supervisionHours/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update log:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Log updated successfully:", result);
      refreshLogs(); // Refresh the logs after updating
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const deleteLog = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/supervisionHours/delete/${id}`, {
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
    "Supervision Hours",
    "Indirect Hours",
    "Site",
    "Supervisor",
    "Status",
    "Action",
  ];
  const data = supervisionLogs.map((log) => {
    const [year, week] = log.week.split("-W");
    const { start, end } = getWeekDates(parseInt(year, 10), parseInt(week, 10));

    return {
      "Week Logged": `${log.week}-${start} to ${end}`,
      "Date Logged": new Date(log.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      "Supervision Hours": log.supervision_Hours,
      Action: (
        <Dropdown
          id={log.id}
          deleteLog={deleteLog}
          PopupContent={({ closePopup }) => (
            <NewSupervisionLog
              refreshLogs={refreshLogs}
              mode="update"
              existingLog={{
                id: log.id,
                week: log.week,
                supervision_Hours: log.supervision_Hours.toString(), // Convert to string
              }}
              closePopup={closePopup} // Pass closePopup function
            />
          )}
        />
      ),
    };
  });

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-3xl mb-4 md:mb-0 font-bold">
          Supervision Hours
        </h1>
        <button
          className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
          onClick={openPopup}
        >
          Log Hours
        </button>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-md shadow-lg border overflow-x-auto">
        <Table headers={headers} data={data} />
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="p-5 rounded-md shadow-lg w-[90%] bg-white">
            <h2 className="text-2xl mb-4">Log New Supervision Hours</h2>
            <NewSupervisionLog
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

export default SupervisionLogs;
