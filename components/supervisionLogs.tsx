import React, { useState } from "react";
import Table from "./table";
import NewSupervisionLog from "./newSupervisionLog";

interface Log {
  id: number;
  created_at: string;
  week: string;
  user_id: string;
  supervision_Hours: string;
  // other properties as needed
}

interface OverviewProps {
  logs: Log[];
}

const SupervisionLogs: React.FC<OverviewProps> = ({ logs }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const headers = ["Week Logged", "Supervision Hours", "Action"];

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
        <Table headers={headers} />
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
            <h2 className="text-2xl mb-4 text-[#709D50]">Log New Supervision Hours</h2>
            <NewSupervisionLog />
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
