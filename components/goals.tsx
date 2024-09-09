import React, { useState } from "react";
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

  function getWeekDates(year: number, week: number) {
    const startDate = new Date(year, 0, 1 + (week - 1) * 7); // Start of the year + (week - 1) * 7 days
    const dayOfWeek = startDate.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
    const start = new Date(
      startDate.setDate(startDate.getDate() - dayOfWeek + 1)
    ); // Adjust to Monday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of the week (Sunday)

    return {
      start: start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      end: end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  }

  const headersClinicalHours = [
    "Week",
    "Clinical Goal",
    "Direct Hours Logged",
    "Indirect Hours Logged",
    "Remaining",
  ];
  const headersSupervisionHours = [
    "Week",
    "Supervision Goal",
    "Supervision Hours Logged",
    "Indirect Hours logged",
    "Remaining",
  ];

  const uniqueWeeks = Array.from(new Set(goals.map((goal) => goal.week)));

  const dataClinicalHours = uniqueWeeks.map((week) => {
    // Calculate total direct hours for the given week
    const totalDirectHours = clinicalLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + parseFloat(log.direct_Hours || "0"), 0);

    // Calculate total indirect hours for the given week
    const totalIndirectHours = clinicalLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + parseFloat(log.indirect_Hours || "0"), 0);

    // Find the goal for the given week
    const goal = goals.find((goal) => goal.week === week);
    const clinicalHours = goal ? goal.clinical_Hours : 0;

    // Extract year and week from the week string
    const [year, weekNumber] = week.split("-W");
    const { start, end } = getWeekDates(
      parseInt(year, 10),
      parseInt(weekNumber, 10)
    );

    return {
      "Week": `${week}-${start} to ${end}`,
      "Clinical Goal": clinicalHours, // Display the clinical goal
      "Direct Hours Logged": totalDirectHours,
      "Indirect Hours Logged": totalIndirectHours,
      Remaining: clinicalHours - (totalDirectHours + totalIndirectHours),
    };
  });

  const dataSupervisionHours = uniqueWeeks.map((week) => {
    // Calculate total supervision hours for the given week
    const totalSupervisionHours = supervisionLogs
      .filter((log) => log.week === week)
      .reduce((total, log) => total + log.supervision_Hours, 0);

    // Find the goal for the given week
    const goal = goals.find((goal) => goal.week === week);
    const supervisionHours = goal ? goal.supervision_Hours : 0;

    // Extract year and week from the week string
    const [year, weekNumber] = week.split("-W");
    const { start, end } = getWeekDates(
      parseInt(year, 10),
      parseInt(weekNumber, 10)
    );

    return {
      "Week": `${week}-${start} to ${end}`,
      "Supervision Goal": supervisionHours, // Display the supervision goal
      "Supervision Hours Logged": totalSupervisionHours,
      Remaining: supervisionHours - totalSupervisionHours,
    };
  });

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-3xl mb-4 md:mb-0 font-bold">Goals</h1>
        <button
          className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
          onClick={openPopup}
        >
          Set Goals
        </button>
      </div>

      <div className="bg-white shadow-lg p-4 md:p-10 rounded-md border space-y-10">
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Clinical Hours</h3>
          <Table headers={headersClinicalHours} data={dataClinicalHours} />
        </div>
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Supervision Hours</h3>
          <Table
            headers={headersSupervisionHours}
            data={dataSupervisionHours}
          />
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%] bg-white"
          >
            <h2 className="text-2xl mb-4">Set New Goals</h2>
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
