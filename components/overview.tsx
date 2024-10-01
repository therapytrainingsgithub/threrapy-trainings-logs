import React, { useState, useEffect } from "react";
import PieChart from "./piechart";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import { useGoalsContext } from "@/app/context/goalsContext";
import { useUserContext } from "@/app/context/userContext";
import Goals from "./goals";
import * as XLSX from "xlsx";

interface Log {
  user_Id: string;
  direct_Hours?: number;
  indirect_Hours?: number;
  site?: string;
  supervisor?: string;
  status?: string;
  supervision_Hours?: number;
}

interface Goal {
  clinical_Hours: number;
  supervision_Hours: number;
}

const Overview: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const { goals = [] } = useGoalsContext() || {};
  const { clinicalLogs = [] } = useClinicalLogsContext() || {};
  const { supervisionLogs = [] } = useSupervisionLogsContext() || {};
  const { userID } = useUserContext() || {}; // userID can be undefined initially

  useEffect(() => {
    if (!userID) {
      console.error("User ID not found");
    }
  }, [userID]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const userClinicalLogs = clinicalLogs.filter(
    (log) => log.user_Id === userID && log.status === "accept"
  );

  const totalDirectHours = userClinicalLogs.reduce(
    (total, log) => total + (log.direct_Hours || 0),
    0
  );

  const totalIndirectHours = userClinicalLogs.reduce(
    (total, log) => total + (log.indirect_Hours || 0),
    0
  );

  // Assuming only one global goal per user
  const clinicalGoal = goals[0]?.clinical_Hours || 4000;
  const clinicalRemaining = Math.max(
    clinicalGoal - (totalDirectHours + totalIndirectHours),
    0
  );

  const userSupervisionLogs = supervisionLogs.filter(
    (log) => log.user_Id === userID
  );

  const totalSupervisionHours = userSupervisionLogs.reduce(
    (total, log) => total + (log.supervision_Hours || 0),
    0
  );

  const supervisionGoal = goals[0]?.supervision_Hours || 100;
  const supervisionRemaining = Math.max(
    supervisionGoal - totalSupervisionHours,
    0
  );

  // Data for Clinical Hours PieChart
  const clinicalHoursChart = {
    labels: ["Direct Hours", "Indirect Hours", "Remaining Hours"],
    datasets: [
      {
        data: [totalDirectHours, totalIndirectHours, clinicalRemaining],
        backgroundColor: [
          "rgba(112, 157, 80)", // Green for direct hours
          "rgba(211, 211, 211)", // Light grey for indirect hours
          "rgba(180, 0, 0)", // Red for remaining hours
        ],
      },
    ],
  };

  // Data for Supervision Hours PieChart
  const supervisionHoursChart = {
    labels: ["Supervision Hours", "Remaining Hours"],
    datasets: [
      {
        data: [totalSupervisionHours, supervisionRemaining],
        backgroundColor: [
          "rgba(112, 157, 80)", // Green for supervision hours
          "rgba(180, 0, 0)", // Red for remaining hours
        ],
      },
    ],
  };

  // Export clinical and supervision logs to Excel
  const exportToSpreadsheet = (clinicalLogs: Log[], supervisionLogs: Log[]) => {
    try {
      const workbook = XLSX.utils.book_new();

      // Clinical Logs Sheet
      const clinicalTitle = [["Clinical Logs"]];
      const clinicalLogHeaders = [
        "Direct Hours",
        "Indirect Hours",
        "Site",
        "Supervisor",
        "Status",
      ];
      const clinicalLogData = clinicalLogs.map((log) => [
        log.direct_Hours || 0,
        log.indirect_Hours || 0,
        log.site || "N/A",
        log.supervisor || "N/A",
        log.status || "N/A",
      ]);
      const clinicalLogWorksheet = XLSX.utils.aoa_to_sheet([
        clinicalTitle,
        clinicalLogHeaders,
        ...clinicalLogData,
      ]);
      XLSX.utils.book_append_sheet(
        workbook,
        clinicalLogWorksheet,
        "Clinical Logs"
      );

      // Supervision Logs Sheet
      const supervisionTitle = [["Supervision Logs"]];
      const supervisionLogHeaders = ["Supervision Hours"];
      const supervisionLogData = supervisionLogs.map((log) => [
        log.supervision_Hours || 0,
      ]);
      const supervisionLogWorksheet = XLSX.utils.aoa_to_sheet([
        supervisionTitle,
        supervisionLogHeaders,
        ...supervisionLogData,
      ]);
      XLSX.utils.book_append_sheet(
        workbook,
        supervisionLogWorksheet,
        "Supervision Logs"
      );

      XLSX.writeFile(workbook, "logs.xlsx");
    } catch (error) {
      console.error("Error exporting to spreadsheet:", error);
    }
  };

  const handleExportClick = () => {
    exportToSpreadsheet(userClinicalLogs, userSupervisionLogs);
  };

  return (
    <main className="space-y-5 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold">Progress</h1>
        </div>
        <div className="flex space-x-5">
          <button
            onClick={openPopup}
            className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
          >
            Supervision Goals
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-md border shadow-lg flex flex-col md:flex-row justify-center space-y-4 md:space-y-0">
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-2">Clinical Hours</h3>
          <PieChart data={clinicalHoursChart} />
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-2">Supervision Hours</h3>
          <PieChart data={supervisionHoursChart} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleExportClick}
          className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
        >
          Export Logs
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="p-5 rounded-md shadow-lg w-[90%] bg-white border h-[80%] overflow-auto flex flex-col items-center justify-center">
            <Goals />
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

export default Overview;
