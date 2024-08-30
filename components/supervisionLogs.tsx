import React, { useState, useEffect } from "react";
import Table from "./table";
import NewSupervisionLog from "./newSupervisionLog";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";

const SupervisionLogs = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { supervisionLogs } = useSupervisionLogsContext();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const headers = ["Date", "Week Logged", "Supervision Hours", "Action"];
  const data = supervisionLogs.map((log) => ({
    date: new Date(log.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    week: log.week,
    supervision_Hours: log.supervision_Hours,
  }));

  return (
    <main className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] text-[#709D50]">
            Supervision Hours Logged
          </h1>
        </div>

        <div>
          <button
            style={{
              background: "#8cbf68",
              border: "1px solid #dcdcdc",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            className="px-5 py-2 rounded-md text-white"
            onClick={openPopup}
          >
            Log Hours
          </button>
        </div>
      </div>

      <div className="bg-[#FCFEF2] p-10 rounded-xl border">
        <Table headers={headers} data={data} />
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <NewSupervisionLog closePopup={closePopup} />
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
