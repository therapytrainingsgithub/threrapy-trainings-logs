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

  const headers = [
    "Date Logged",
    "Direct Hours",
    "Indirect Hours",
    "Site",
    "Supervisor",
    "Status",
    "Action",
  ];

  const data = clinicalLogs.map((log) => {
    const userStatus =
      log.status === "accept"
        ? "Accepted"
        : log.status === "decline"
        ? "Declined"
        : log.status === "pending"
        ? "Pending"
        : "";
    return {
      "Date Logged": new Date(log.date_logged).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      "Direct Hours": log.direct_Hours,
      "Indirect Hours": log.indirect_Hours,
      Site: log.site ?? "N/A",
      Supervisor: log.supervisor ?? "N/A",
      Status: userStatus,
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
                date_logged: log.date_logged,
                id: log.id,
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
        <h1 className="text-3xl mb-4 md:mb-0 font-bold">Clinical Hours</h1>
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
          <div className="p-5 rounded-md shadow-lg w-[90%] bg-white border">
            <h2 className="text-2xl mb-4">Log New Hours</h2>
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
