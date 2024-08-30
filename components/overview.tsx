"use client";

import React, { useState, useEffect } from "react";
import PieChart from "./piechart";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import { useGoalsContext } from "@/app/context/goalsContext";

const Overview = () => {
  const [range, setRange] = useState("");
  const [selection, setSelection] = useState("");

  const { goals } = useGoalsContext();
  const { clinicalLogs } = useClinicalLogsContext();
  const { supervisionLogs } = useSupervisionLogsContext();

  const uniqueWeeks = Array.from(new Set(goals.map((goal) => goal.week)));
  const dataClinicalHours = uniqueWeeks.map((week) => {
    let totalDirectHours = clinicalLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + parseFloat(log.direct_Hours), 0);
    let totalIndirectHours = clinicalLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + parseFloat(log.indirect_Hours), 0);
    const goal = goals.find((goal) => goal.week === week);
    const clinicalHours = goal ? goal.clinical_Hours : 0;
    return {
      directHours: totalDirectHours,
      indirectHours: totalIndirectHours,
      remaining: totalDirectHours + totalIndirectHours - clinicalHours,
    };
  });

  const dataSupervisionHours = uniqueWeeks.map((week) => {
    let totalSupervisionHours = supervisionLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + log.supervision_Hours, 0);
    const goal = goals.find((goal) => goal.week === week);
    const supervisionHours = goal ? goal.supervision_Hours : 0;

    return {
      supervisionHours: totalSupervisionHours,
      remaining: totalSupervisionHours - supervisionHours,
    };
  });

  const clinicalHoursChart = {
    labels: ["Direct", "Indirect", "Remaining"],
    datasets: [
      {
        data: [5, 5, 10], // Example data
        backgroundColor: [
          "rgba(112, 157, 80)",
          "rgba(0, 0, 0)",
          "rgba(112, 157, 80, 0.7)",
        ],
      },
    ],
  };

  const supervisionHoursChart = {
    labels: ["Supervision", "Remaining"],
    datasets: [
      {
        data: [10, 10], // Example data
        backgroundColor: [
          "rgba(112, 157, 80)",
          "rgba(0, 0, 0)",
        ],
      },
    ],
  };

  return (
    <main className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-semibold">Overview</h1>
        </div>
        <div className="flex space-x-5">
          <div className="relative">
            <select
              className="bg-[#FCFEF2] p-2 rounded-md border border-gray-200 appearance-none pr-10"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="" disabled hidden>
                Range
              </option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center pointer-events-none">
              <img
                src="./images/downArrow.png"
                alt="arrow"
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="relative">
            <select
              className="bg-[#FCFEF2] p-2 rounded-md border border-gray-200 appearance-none pr-10"
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
            >
              <option value="" disabled hidden>
                Select
              </option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center pointer-events-none">
              <img
                src="./images/downArrow.png"
                alt="arrow"
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FCFEF2] p-10 rounded-xl border flex justify-center">
        <PieChart data={clinicalHoursChart} />
        <PieChart data={supervisionHoursChart} />
      </div>
    </main>
  );
};

export default Overview;
