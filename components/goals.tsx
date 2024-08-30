import React, { useState, useEffect } from "react";
import Table from "./table";
import NewGoal from "./newGoal";
import { useGoalsContext } from "@/app/context/goalsContext";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";

const Goals: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Use the context hook to access goals
  const { goals } = useGoalsContext();
  const { clinicalLogs } = useClinicalLogsContext();
  const { supervisionLogs } = useSupervisionLogsContext();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const headersClinicalHours = [
    "Week Logged",
    "Direct Hours",
    "Indirect Hours",
    "Remaining",
  ];
  const headersSupervisionHours = [
    "Week Logged",
    "Supervision Hours",
    "Remaining",
    "Status",
  ];

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
      weekLogged: week,
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
      weekLogged: week,
      supervisionHours: totalSupervisionHours,
      remaining: totalSupervisionHours - supervisionHours,
    };
  });

  return (
    <main className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] text-[#709D50]">Goals</h1>
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
            Set Goals
          </button>
        </div>
      </div>

      <div className="bg-[#FCFEF2] p-10 rounded-xl border space-y-10">
        <div>
          <h3>Clinical Hours</h3>
          <Table headers={headersClinicalHours} data={dataClinicalHours} />
        </div>
        <div>
          <h3>Supervision Hours</h3>
          <Table
            headers={headersSupervisionHours}
            data={dataSupervisionHours}
          />
        </div>
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
            <h2 className="text-2xl mb-4 text-[#709D50]">Set New Goals</h2>
            <NewGoal closePopup={closePopup} />
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

export default Goals;
