import React, { useState } from "react";
import Table from "./table";
import { useGoalsContext } from "@/app/context/goalsContext";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import UpdateGoal from "./updateGoal";

const Goals: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Use the context hooks to access goals and logs
  const { goals } = useGoalsContext();
  const { clinicalLogs } = useClinicalLogsContext();
  const { supervisionLogs } = useSupervisionLogsContext();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Access the first goal from the goals array if it exists
  const userGoal = goals && goals.length > 0 ? goals[0] : null;

  // Default to 4000 clinical hours and 100 supervision hours if no goal is set
  const clinicalGoal = userGoal ? userGoal.clinical_Hours : 4000;
  const supervisionGoal = userGoal ? userGoal.supervision_Hours : 100;

  // Aggregate all logged hours
  const totalDirectClinicalHours = clinicalLogs.reduce(
    (total, log) => total + parseFloat(log.direct_Hours || "0"),
    0
  );

  const totalIndirectClinicalHours = clinicalLogs.reduce(
    (total, log) => total + parseFloat(log.indirect_Hours || "0"),
    0
  );

  const totalSupervisionHours = supervisionLogs.reduce(
    (total, log) => total + log.supervision_Hours,
    0
  );

  // Data for Clinical Hours Table
  const dataClinicalHours = [
    {
      "Clinical Goal": clinicalGoal,
      "Direct Hours Logged": totalDirectClinicalHours,
      "Indirect Hours Logged": totalIndirectClinicalHours,
      Remaining:
        clinicalGoal - (totalDirectClinicalHours + totalIndirectClinicalHours),
    },
  ];

  // Data for Supervision Hours Table
  const dataSupervisionHours = [
    {
      "Supervision Goal": supervisionGoal,
      "Supervision Hours Logged": totalSupervisionHours,
      Remaining: supervisionGoal - totalSupervisionHours,
    },
  ];

  return (
    <main className="space-y-5 overflow-y-auto h-[70%] w-full">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-3xl mb-4 md:mb-0 font-bold">Goals</h1>
        <button
          className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
          onClick={openPopup}
        >
          Update Goals
        </button>
      </div>

      <div className="bg-white shadow-lg p-4 md:p-10 rounded-md border space-y-10">
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Clinical Hours</h3>
          <Table
            headers={[
              "Clinical Goal",
              "Direct Hours Logged",
              "Indirect Hours Logged",
              "Remaining",
            ]}
            data={dataClinicalHours}
          />
        </div>
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Supervision Hours</h3>
          <Table
            headers={[
              "Supervision Goal",
              "Supervision Hours Logged",
              "Remaining",
            ]}
            data={dataSupervisionHours}
          />
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="p-5 rounded-md shadow-lg w-[90%] bg-white">
            <h2 className="text-2xl mb-4">Update Your Goal</h2>
            <UpdateGoal
              closePopup={closePopup}
              supervisionGoal={supervisionGoal}
              clinicalGoal={clinicalGoal}
            />
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
