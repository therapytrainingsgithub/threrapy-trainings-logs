import React, { useState, useEffect } from "react";
import Table from "./table";
import NewClinicalLog from "./newClinicalLog";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";

const ClinicalLogs = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { clinicalLogs } = useClinicalLogsContext();

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
    date: new Date(log.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    weekLogged: log.week,
    directHours: log.direct_Hours,
    indirectHours: log.indirect_Hours,
    site: log.site,
    supervisor: "Unknown",
    status: "Pending",
  }));

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <main className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] text-[#709D50]">Clinical Hours Logged</h1>
        </div>

        <div>
          <button
            onClick={openPopup}
            style={{
              background: "#8cbf68",
              border: "1px solid #dcdcdc",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            className="px-5 py-2 rounded-md text-white"
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
            <h2 className="text-2xl mb-4 text-[#709D50]">Log New Hours</h2>
            <NewClinicalLog closePopup={closePopup} />
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
