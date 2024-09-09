"use client";

import React, { useState } from "react";
import PieChart from "./piechart";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import { useGoalsContext } from "@/app/context/goalsContext";
import { useUserContext } from "@/app/context/userContext";
import { IoIosArrowDown } from "react-icons/io";

const Overview = () => {
  const [week, setWeek] = useState("all");

  const { goals } = useGoalsContext();
  const { clinicalLogs } = useClinicalLogsContext();
  const { supervisionLogs } = useSupervisionLogsContext();
  const { userID } = useUserContext(); // Get userID from the context

  // Filter clinical logs by userID
  const userClinicalLogs = clinicalLogs.filter((log) => log.user_Id === userID);

  // Get unique weeks from the filtered clinical logs, sorted in ascending order
  const uniqueWeeks = Array.from(
    new Set(userClinicalLogs.map((log) => log.week))
  ).sort((a, b) => a.localeCompare(b)); // Sorting the weeks

  // Prepare data for Clinical Hours chart
  const filteredClinicalLogs =
    week === "all"
      ? userClinicalLogs // Use all logs if "All" is selected
      : userClinicalLogs.filter((log) => log.week === week); // Filter logs by selected week

  const totalDirectHours = filteredClinicalLogs.reduce(
    (total, log) => total + parseFloat(log.direct_Hours),
    0
  );
  const totalIndirectHours = filteredClinicalLogs.reduce(
    (total, log) => total + parseFloat(log.indirect_Hours),
    0
  );

  const clinicalGoal =
    week === "all"
      ? goals.reduce((total, goal) => total + (goal.clinical_Hours || 0), 0)
      : goals.find((goal) => goal.week === week)?.clinical_Hours || 0;

  const clinicalRemaining =
    clinicalGoal - (totalDirectHours + totalIndirectHours);

  // Prepare data for Supervision Hours chart
  const filteredSupervisionLogs =
    week === "all"
      ? supervisionLogs.filter((log) => log.user_Id === userID)
      : supervisionLogs.filter(
          (log) => log.user_Id === userID && log.week === week
        );

  const totalSupervisionHours = filteredSupervisionLogs.reduce(
    (total, log) => total + log.supervision_Hours,
    0
  );

  const supervisionGoal =
    week === "all"
      ? goals.reduce((total, goal) => total + (goal.supervision_Hours || 0), 0)
      : goals.find((goal) => goal.week === week)?.supervision_Hours || 0;

  const supervisionRemaining = supervisionGoal - totalSupervisionHours;

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

  return (
    <main className="space-y-5 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold">Overview</h1>
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
    </main>
  );
};

export default Overview;
