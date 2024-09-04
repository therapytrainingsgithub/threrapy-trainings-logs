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

  const submitLog = async (
    formData: { week: string; supervision_Hours: string },
    userID: string
  ) => {
    try {
      const response = await fetch("/api/supervisionHours/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, user_Id: userID }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Data inserted successfully:", result);
        closePopup();
        refreshLogs();
      } else {
        console.error("Failed to insert data:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const headers = ["Date", "Week Logged", "Supervision Hours", "Action"];
  const data = supervisionLogs.map((log) => ({
    Date: new Date(log.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    "Week Logged": log.week,
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
  }));

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] text-[#709D50] mb-4 md:mb-0">
          Supervision Hours Logged
        </h1>
        <button
          style={{
            background: "#8cbf68",
            border: "1px solid #dcdcdc",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          className="px-4 py-2 rounded-md text-white"
          onClick={openPopup}
        >
          Log Hours
        </button>
      </div>

      <div className="bg-[#FCFEF2] p-4 md:p-10 rounded-xl border overflow-x-auto">
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
            <h2 className="text-2xl mb-4 text-[#709D50]">
              Log New Supervision Hours
            </h2>
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
