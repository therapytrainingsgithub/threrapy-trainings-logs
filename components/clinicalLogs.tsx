import React, { useState } from "react";
import Table from "./table";
import NewClinicalLog from "./newClinicalLog";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";

const ClinicalLogs = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { clinicalLogs, refreshLogs } = useClinicalLogsContext();

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
    supervisor: log.supervisor,
    status: log.status,
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
