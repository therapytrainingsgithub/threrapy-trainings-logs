"use client";
import React, { useState } from "react";
import PieChart from "./piechart";

interface Log {
  id: number;
  created_at: string;
  week: string;
  user_id: string;
  direct_Hours: string;
  indirect_Hours: string;
  supervision_Hours: string;
  source: string;
}

interface OverviewProps {
  logs: Log[];
}

const Overview: React.FC<OverviewProps> = ({ logs }) => {
  const [range, setRange] = useState("");
  const [selection, setSelection] = useState("");

  const data = {
    labels: ["Direct", "Indirect", "Remaining"],
    datasets: [
      {
        data: [3, 4, 5],
        backgroundColor: [
          "rgba(112, 157, 80)",
          "rgba(0, 0, 0)",
          "rgba(112, 157, 80, 0.7)",
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
        <PieChart data={data} />
        <PieChart data={data} />
      </div>
    </main>
  );
};

export default Overview;
