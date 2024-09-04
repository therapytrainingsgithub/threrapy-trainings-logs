import React, { useState } from "react";
import Table from "./table";
import NewClinicalLog from "./newClinicalLog";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import Dropdown from "./dropdown";

const ClinicalLogs: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { clinicalLogs, refreshLogs } = useClinicalLogsContext();

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const deleteLog = async (id: string | number | undefined): Promise<void> => {
    try {
      const response = await fetch(`/api/clinicalHours/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle non-JSON responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete log:", errorText);
        return;
      }

      const result = await response.json();
      refreshLogs();
      console.log("Log deleted successfully:", result);
      refreshLogs(); // Ensure the logs are refreshed after deletion
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const headers = [
    "Date",
    "Week Logged",
    "Direct Hours",
    "Indirect Hours",
    "Site",
    "Supervisor",
    "Status",
    "Action",
  ];

  const data = clinicalLogs.map((log) => ({
    Date: new Date(log.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    "Week Logged": log.week,
    "Direct Hours": log.direct_Hours,
    "Indirect Hours": log.indirect_Hours,
    Site: log.site ?? "N/A",
    Supervisor: log.supervisor ?? "N/A",
    Status: capitalizeFirstLetter(log.status),
    Action: <Dropdown status={log.status} id={log.id} deleteLog={deleteLog} />,
  }));

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] text-[#709D50] mb-4 md:mb-0">
          Clinical Hours Logged
        </h1>
        <button
          onClick={openPopup}
          style={{
            background: "#8cbf68",
            border: "1px solid #dcdcdc",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          className="px-4 py-2 rounded-md text-white"
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
            <h2 className="text-2xl mb-4 text-[#709D50]">Log New Hours</h2>
            <NewClinicalLog closePopup={closePopup} refreshLogs={refreshLogs} />
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
