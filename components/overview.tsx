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

const Overview = () => {
  const [week, setWeek] = useState("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { goals = [] } = useGoalsContext() || {}; // Handle undefined goals context
  const { clinicalLogs = [] } = useClinicalLogsContext() || {}; // Handle undefined clinicalLogs context
  const { supervisionLogs = [] } = useSupervisionLogsContext() || {}; // Handle undefined supervisionLogs context
  const { userID } = useUserContext() || {}; // Handle undefined userID

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

  const userClinicalLogs = clinicalLogs.filter((log) => log.user_Id === userID);

  const uniqueWeeks = Array.from(
    new Set(userClinicalLogs.map((log) => log.week))
  ).sort((a, b) => a?.localeCompare(b)); // Safe sorting

  const filteredClinicalLogs =
    week === "all"
      ? userClinicalLogs
      : userClinicalLogs.filter((log) => log.week === week);

  const totalDirectHours = filteredClinicalLogs.reduce(
    (total, log) =>
      total + parseFloat(log.direct_Hours ? log.direct_Hours : "0"),
    0
  );
  const totalIndirectHours = filteredClinicalLogs.reduce(
    (total, log) =>
      total + parseFloat(log.indirect_Hours ? log.indirect_Hours : "0"),
    0
  );

  const clinicalGoal =
    week === "all"
      ? goals.reduce((total, goal) => total + (goal.clinical_Hours || 0), 0)
      : goals.find((goal) => goal.week === week)?.clinical_Hours || 0;

  const clinicalRemaining = Math.max(
    clinicalGoal - (totalDirectHours + totalIndirectHours),
    0
  ); // Prevent negative values

  const filteredSupervisionLogs =
    week === "all"
      ? supervisionLogs.filter((log) => log.user_Id === userID)
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

  // Prepare data for PieCharts
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

  const exportToSpreadsheet = (
    data: { Name: string; Email: string; Age: number }[]
  ) => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
      XLSX.writeFile(workbook, "logs.xlsx");
    } catch (error) {
      console.error("Error exporting to spreadsheet:", error);
    }
  };

  const data = [
    { Name: "John Doe", Email: "john@example.com", Age: 30 },
    { Name: "Jane Smith", Email: "jane@example.com", Age: 25 },
  ];

  const handleExportClick = () => {
    exportToSpreadsheet(data);
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
