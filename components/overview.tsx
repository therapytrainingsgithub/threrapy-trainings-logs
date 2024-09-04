"use client";

import React, { useState } from "react";
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
    const totalDirectHours = clinicalLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + parseFloat(log.direct_Hours), 0);
    const totalIndirectHours = clinicalLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + parseFloat(log.indirect_Hours), 0);
    const goal = goals.find((goal) => goal.week === week);
    const clinicalHours = goal ? goal.clinical_Hours : 0;
    const clinicalRemaining =
      clinicalHours - (totalDirectHours + totalIndirectHours);

    return {
      directHours: totalDirectHours,
      indirectHours: totalIndirectHours,
      remaining: clinicalRemaining,
    };
  });

  const dataSupervisionHours = uniqueWeeks.map((week) => {
    const totalSupervisionHours = supervisionLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + log.supervision_Hours, 0);
    const goal = goals.find((goal) => goal.week === week);
    const supervisionHours = goal ? goal.supervision_Hours : 0;
    const supervisionRemaining = totalSupervisionHours - supervisionHours;

    return {
      supervisionHours: totalSupervisionHours,
      remaining: supervisionRemaining,
    };
  });

  const clinicalHoursChart = {
    labels: ["Direct", "Indirect", "Remaining"],
    datasets: [
      {
        data: [
          dataClinicalHours.reduce((sum, item) => sum + item.directHours, 0),
          dataClinicalHours.reduce((sum, item) => sum + item.indirectHours, 0),
          dataClinicalHours.reduce((sum, item) => sum + item.remaining, 0),
        ],
        backgroundColor: [
          "rgba(112, 157, 80)",
          "rgba(112, 157, 80, 0.7)",
          "rgba(0, 0, 0)",
        ],
      },
    ],
  };

  const supervisionHoursChart = {
    labels: ["Supervision", "Remaining"],
    datasets: [
      {
        data: [
          dataSupervisionHours.reduce(
            (sum, item) => sum + item.supervisionHours,
            0
          ),
          dataSupervisionHours.reduce((sum, item) => sum + item.remaining, 0),
        ],
        backgroundColor: ["rgba(112, 157, 80)", "rgba(0, 0, 0)"],
      },
    ],
  };

  return (
    <main className="space-y-5 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold">Overview</h1>
        </div>
        {/* <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5">
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
        </div> */}
      </div>

      <div className="bg-[#FCFEF2] p-6 md:p-10 rounded-xl border flex flex-col md:flex-row justify-center space-y-4 md:space-y-0">
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
