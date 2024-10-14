import React, { useState, useEffect } from "react";
import PieChart from "./piechart";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useSupervisionLogsContext } from "@/app/context/supervisionContext";
import { useGoalsContext } from "@/app/context/goalsContext";
import { useUserContext } from "@/app/context/userContext";
import Goals from "./goals";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";

interface Log {
  user_Id: string;
  direct_Hours?: number;
  indirect_Hours?: number;
  site?: string;
  supervision_Hours?: number;
  date_logged?: Date;
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
  const { userID } = useUserContext() || {};

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

  const totalDirectHours = clinicalLogs.reduce(
    (total, log) => total + (log.direct_Hours || 0),
    0
  );

  const totalIndirectHours = clinicalLogs.reduce(
    (total, log) => total + (log.indirect_Hours || 0),
    0
  );

  const clinicalGoal = goals[0]?.clinical_Hours || 0;
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

  const supervisionGoal = goals[0]?.supervision_Hours || 0;
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

  function convertUTCtoLocalTime(utcTime: any) {
    const utcDate = new Date(utcTime);

    const localTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(utcDate);

    return localTime;
  }

  // Export clinical and supervision logs to Excel
  const exportToSpreadsheet = (clinicalLogs: any, supervisionLogs: any) => {
    try {
      const workbook = XLSX.utils.book_new();

      // Clinical logs section
      const clinicalTitle = [
        [{ v: "Therapy Trainings", s: { font: { bold: true, sz: 14 } } }],
        [
          {
            v: "Clinical Hours Log Report",
            s: { font: { bold: true, sz: 12 } },
          },
        ],
        [],
      ];

      const clinicalLogHeaders = [
        {
          v: "Date Logged",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
        {
          v: "Direct Hours",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
        {
          v: "Indirect Hours",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
        {
          v: "Site",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
      ];

      const clinicalLogData = clinicalLogs.map((log: any) => [
        convertUTCtoLocalTime(log.date_logged) || "N/A",
        log.direct_Hours || 0,
        log.indirect_Hours || 0,
        log.site || "Unknown",
      ]);

      const totalDirectHours = clinicalLogs.reduce(
        (sum: any, log: any) => sum + (log.direct_Hours || 0),
        0
      );
      const totalIndirectHours = clinicalLogs.reduce(
        (sum: any, log: any) => sum + (log.indirect_Hours || 0),
        0
      );

      const summarySection = [
        [],
        [{ v: "Summary", s: { font: { bold: true } } }],
        [
          { v: "Goal", s: { font: { bold: true } } },
          { v: clinicalGoal, s: { alignment: { horizontal: "right" } } },
        ],
        [
          { v: "Total Hours Logged", s: { font: { bold: true } } },
          {
            v: totalDirectHours + totalIndirectHours,
            s: { alignment: { horizontal: "right" } },
          },
        ],
        [
          { v: "Remaining", s: { font: { bold: true } } },
          {
            v: clinicalGoal - (totalDirectHours + totalIndirectHours),
            s: {
              font: { bold: true },
              alignment: { horizontal: "right" },
              border: { top: { style: "thick" }, bottom: { style: "thick" } },
            },
          },
        ],
        [],
        [
          {
            v: "Supervisor Name: ___________________________",
            s: { font: { bold: true } },
          },
        ],
        [
          {
            v: "Supervisor Signature: ________________________",
            s: { font: { bold: true } },
          },
        ],
      ];

      const clinicalLogWorksheet = XLSX.utils.aoa_to_sheet([
        ...clinicalTitle,
        clinicalLogHeaders,
        ...clinicalLogData,
        [],
        [
          null,
          {
            v: totalDirectHours,
            s: {
              font: { bold: true },
              alignment: { horizontal: "right" },
              border: { top: { style: "thick" }, bottom: { style: "thick" } },
            },
          },
          {
            v: totalIndirectHours,
            s: {
              font: { bold: true },
              alignment: { horizontal: "right" },
              border: { top: { style: "thick" }, bottom: { style: "thick" } },
            },
          },
        ],
        ...summarySection,
      ]);

      clinicalLogWorksheet["!cols"] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        clinicalLogWorksheet,
        "Clinical Logs"
      );

      // Supervision logs section

      const supervisionTitle = [
        [{ v: "Therapy Trainings", s: { font: { bold: true, sz: 14 } } }],
        [
          {
            v: "Supervision Hours Log Report",
            s: { font: { bold: true, sz: 12 } },
          },
        ],
        [],
      ];

      const supervisionLogHeaders = [
        {
          v: "Date Logged",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
        {
          v: "Supervision Hours",
          s: { font: { bold: true }, alignment: { horizontal: "center" } },
        },
      ];

      const supervisionLogData = supervisionLogs.map((log: any) => [
        convertUTCtoLocalTime(log.date_logged) || "N/A",
        log.supervision_Hours || 0,
      ]);

      const totalSupervisionHours = supervisionLogs.reduce(
        (sum: any, log: any) => sum + (log.supervision_Hours || 0),
        0
      );

      const supervisionSummarySection = [
        [],
        [{ v: "Summary", s: { font: { bold: true } } }],
        [
          { v: "Goal", s: { font: { bold: true } } },
          { v: supervisionGoal, s: { alignment: { horizontal: "right" } } },
        ],
        [
          { v: "Total Hours Logged", s: { font: { bold: true } } },
          {
            v: totalSupervisionHours,
            s: { alignment: { horizontal: "right" } },
          },
        ],
        [
          { v: "Remaining", s: { font: { bold: true } } },
          {
            v: supervisionGoal - totalSupervisionHours,
            s: {
              font: { bold: true },
              alignment: { horizontal: "right" },
              border: { top: { style: "thick" }, bottom: { style: "thick" } },
            },
          },
        ],
        [],
        [
          {
            v: "Supervisor Name: ___________________________",
            s: { font: { bold: true } },
          },
        ],
        [
          {
            v: "Supervisor Signature: ________________________",
            s: { font: { bold: true } },
          },
        ],
      ];

      const supervisionLogWorksheet = XLSX.utils.aoa_to_sheet([
        ...supervisionTitle,
        supervisionLogHeaders,
        ...supervisionLogData,
        [],
        [
          null,
          {
            v: totalSupervisionHours,
            s: {
              font: { bold: true },
              alignment: { horizontal: "right" },
              border: { top: { style: "thick" }, bottom: { style: "thick" } },
            },
          },
        ],
        ...supervisionSummarySection,
      ]);

      supervisionLogWorksheet["!cols"] = [{ wch: 20 }, { wch: 15 }];

      XLSX.utils.book_append_sheet(
        workbook,
        supervisionLogWorksheet,
        "Supervision Logs"
      );

      // Write the Excel file
      XLSX.writeFile(workbook, "logs.xlsx");
    } catch (error) {
      console.error("Error exporting to spreadsheet:", error);
    }
  };

  const handleExportClick = () => {
    exportToSpreadsheet(clinicalLogs, userSupervisionLogs);
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
        <div className="w-full md:w-1/2 space-y-3">
          <h3 className="text-lg font-semibold">Clinical Hours</h3>
          <PieChart data={clinicalHoursChart} />
          <h1 className="text-center">
            <span className="font-bold">Goal: </span>
            {goals[0]?.clinical_Hours ? goals[0]?.clinical_Hours : 0}
          </h1>
        </div>
        <div className="w-full md:w-1/2 space-y-3">
          <h3 className="text-lg font-semibold">Supervision Hours</h3>
          <PieChart data={supervisionHoursChart} />
          <h1 className="text-center">
            <span className="font-bold">Goal:</span>{" "}
            {goals[0]?.supervision_Hours ? goals[0]?.supervision_Hours : 0}
          </h1>
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
