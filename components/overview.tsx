"use client";

import React, { useState, useEffect } from "react";
import PieChart from "./piechart";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import { useGoalsContext } from "@/app/context/goalsContext";
import { useUserContext } from "@/app/context/userContext";
import { IoIosArrowDown } from "react-icons/io";
import Goals from "./goals";
import * as XLSX from "xlsx";

// Define types for logs and goals (adjust according to your data structure)
interface Log {
  week: any;
  user_Id: any;
  direct_Hours?: any; // Should match the incoming data
  indirect_Hours?: any; // Should match the incoming data
  site?: any;
  supervisor?: any;
  status?: any;
  supervision_Hours?: any; // Should match the incoming data
}

interface Goal {
  week: string;
  clinical_Hours?: number;
  supervision_Hours?: number;
}

const Overview: React.FC = () => {
  const [week, setWeek] = useState<string>("all");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const { goals = [] } = useGoalsContext() || {}; // Goals can be undefined initially
  const { clinicalLogs = [] } = useClinicalLogsContext() || {}; // Clinical logs can be undefined initially
  const { supervisionLogs = [] } = useSupervisionLogsContext() || {}; // Supervision logs can be undefined initially
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

  const userClinicalLogs = clinicalLogs.filter((log) => {
    return log.user_Id === userID;
  });

  const uniqueWeeks = Array.from(
    new Set(userClinicalLogs.map((log) => log.week))
  ).sort((a, b) => a?.localeCompare(b));

  const filteredClinicalLogs =
    week === "all"
      ? userClinicalLogs
      : userClinicalLogs.filter((log) => log.week === week);

  const totalDirectHours = filteredClinicalLogs.reduce(
    (total, log) => total + parseFloat(log.direct_Hours || "0"),
    0
  );

  const totalIndirectHours = filteredClinicalLogs.reduce(
    (total, log) => total + parseFloat(log.indirect_Hours || "0"),
    0
  );

  const clinicalGoal =
    week === "all"
      ? goals.reduce(
          (total, goal: Goal) => total + (goal.clinical_Hours || 0),
          0
        )
      : goals.find((goal) => goal.week === week)?.clinical_Hours || 0;

  const clinicalRemaining = Math.max(
    clinicalGoal - (totalDirectHours + totalIndirectHours),
    0
  );

  const filteredSupervisionLogs =
    week === "all"
      ? supervisionLogs.filter((log: Log) => log.user_Id === userID)
      : supervisionLogs.filter(
          (log) => log.user_Id === userID && log.week === week
        );

  const totalSupervisionHours = filteredSupervisionLogs.reduce(
    (total, log) => total + (log.supervision_Hours || 0),
    0
  );

  const supervisionGoal =
    week === "all"
      ? goals.reduce((total, goal) => total + (goal.supervision_Hours || 0), 0)
      : goals.find((goal) => goal.week === week)?.supervision_Hours || 0;

  const supervisionRemaining = Math.max(
    supervisionGoal - totalSupervisionHours,
    0
  );

  const clinicalHoursChart = {
    labels: ["Direct Hours", "Indirect Hours", "Remaining Hours"],
    datasets: [
      {
        data: [totalDirectHours, totalIndirectHours, clinicalRemaining],
        backgroundColor: [
          "rgba(112, 157, 80)",
          "rgba(211, 211, 211)",
          "rgba(180, 0, 0)",
        ],
      },
    ],
  };

  const supervisionHoursChart = {
    labels: ["Supervision Hours", "Remaining Hours"],
    datasets: [
      {
        data: [totalSupervisionHours, supervisionRemaining],
        backgroundColor: ["rgba(112, 157, 80)", "rgba(180, 0, 0)"],
      },
    ],
  };

  const exportToSpreadsheet = (clinicalLogs: Log[], supervisionLogs: Log[]) => {
    try {
      const workbook = XLSX.utils.book_new();

      const clinicalTitle = [["Logs"]];
      const clinicalLogHeaders = [
        "Week",
        "Direct Hours",
        "Indirect Hours",
        "Site",
        "Supervisor",
        "Status",
      ];
      const clinicalLogData = clinicalLogs.map((log) => ({
        week: log.week,
        direct_Hours: log.direct_Hours,
        indirect_Hours: log.indirect_Hours,
        site: log.site,
        supervisor: log.supervisor,
        status: log.status,
      }));

      const clinicalLogSheetData = [
        ...clinicalTitle,
        clinicalLogHeaders,
        ...clinicalLogData.map(Object.values),
      ];

      const clinicalLogWorksheet =
        XLSX.utils.aoa_to_sheet(clinicalLogSheetData);
      XLSX.utils.book_append_sheet(
        workbook,
        clinicalLogWorksheet,
        "Clinical Logs"
      );

      const supervisionTitle = [["Logs"]];
      const supervisionLogHeaders = ["Week", "Supervision Hours"];
      const supervisionLogData = supervisionLogs.map((log) => ({
        week: log.week,
        supervision_Hours: log.supervision_Hours,
      }));

      const supervisionLogSheetData = [
        ...supervisionTitle,
        supervisionLogHeaders,
        ...supervisionLogData.map(Object.values),
      ];

      const supervisionLogWorksheet = XLSX.utils.aoa_to_sheet(
        supervisionLogSheetData
      );
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
    const preparedClinicalLogs = filteredClinicalLogs.map((log) => ({
      ...log,
      direct_Hours: parseFloat(log.direct_Hours || "0"),
      indirect_Hours: parseFloat(log.indirect_Hours || "0"),
    }));

    const preparedSupervisionLogs = filteredSupervisionLogs.map((log) => ({
      ...log,
      supervision_Hours: Number(log.supervision_Hours || 0),
    }));

    exportToSpreadsheet(preparedClinicalLogs, preparedSupervisionLogs);
  };

  return (
    <main className="space-y-5 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold">Progress</h1>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5">
          <div className="relative">
            <select
              className="bg-white p-2 rounded-md border border-gray-200 appearance-none pr-10"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            >
              <option value="all">All Weeks</option>
              {uniqueWeeks.map((week) => (
                <option key={week} value={week}>
                  {week}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center pointer-events-none">
              <IoIosArrowDown />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={openPopup}
              className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
            >
              Supervision Goals
            </button>
          </div>
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
