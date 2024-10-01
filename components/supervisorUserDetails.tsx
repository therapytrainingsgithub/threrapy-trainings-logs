import React, { useEffect, useState } from "react";
import Table from "./table";
import PieChart from "./piechart";

// Define props type
interface SupervisorUserDetailsProps {
  superviseeID: string | undefined;
}

interface ClinicalLog {
  id: number;
  created_at: string;
  user_Id: string;
  direct_Hours: string;
  indirect_Hours: string;
  supervision_Hours: string;
  site: string;
  supervisor: string;
  status: string;
  supervisor_Id: string;
  date_logged: any;
}

interface SupervisionLog {
  id: number;
  created_at: string;
  supervision_Hours: number;
  user_Id: string;
  date_logged: any;
}

interface Goal {
  id: number;
  created_at: string;
  description: string;
  user_id: string;
  clinical_Hours: number;
  supervision_Hours: number;
}

const SupervisorUserDetails: React.FC<SupervisorUserDetailsProps> = ({
  superviseeID,
}) => {
  const [clinicalLogs, setClinicalLogs] = useState<ClinicalLog[]>([]);
  const [supervisionLogs, setSupervisionLogs] = useState<SupervisionLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  const fetchClinicalLogs = async () => {
    if (!superviseeID) return;
    try {
      const response = await fetch(`/api/clinicalHours/fetch/${superviseeID}`);
      if (!response.ok) throw new Error("Failed to fetch clinical logs");
      const data: ClinicalLog[] = await response.json();
      setClinicalLogs(data);
    } catch (error) {
      console.error("Error fetching clinical logs:", error);
      setError("Error fetching clinical logs");
    }
  };

  const fetchSupervisionLogs = async () => {
    if (!superviseeID) return;
    try {
      const response = await fetch(
        `/api/supervisionHours/fetch/${superviseeID}`
      );
      if (!response.ok) throw new Error("Failed to fetch supervision logs");
      const data: SupervisionLog[] = await response.json();
      setSupervisionLogs(data);
    } catch (error) {
      console.error("Error fetching supervision logs:", error);
      setError("Error fetching supervision logs");
    }
  };

  const fetchGoals = async () => {
    if (!superviseeID) return;
    try {
      const response = await fetch(`/api/goals/fetch/${superviseeID}`);
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data: Goal[] = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Error fetching goals");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchClinicalLogs(),
      fetchSupervisionLogs(),
      fetchGoals(),
    ]).finally(() => setLoading(false));
  }, [superviseeID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const clinicalHeaders = [
    "Date Logged",
    "Direct Hours",
    "Indirect Hours",
    "Site",
    "Status",
  ];

  const clinicalData = clinicalLogs.map((log) => {
    return {
      "Date Logged": new Date(log.date_logged).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      "Direct Hours": log.direct_Hours,
      "Indirect Hours": log.indirect_Hours,
      Site: log.site ?? "N/A",
      Status: capitalizeFirstLetter(log.status),
    };
  });

  const supervisionHeaders = [
    "Date Logged",
    "Supervision Hours",
    "Indirect Hours",
    "Site",
    "Status",
  ];
  const supervisionData = supervisionLogs.map((log) => {
    return {
      "Date Logged": new Date(log.date_logged).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      "Supervision Hours": log.supervision_Hours,
    };
  });

  const totalDirectHours = clinicalLogs.reduce(
    (total, log) => total + parseFloat(log.direct_Hours),
    0
  );
  const totalIndirectHours = clinicalLogs.reduce(
    (total, log) => total + parseFloat(log.indirect_Hours),
    0
  );

  const clinicalGoal =
      goals.reduce((total, goal) => total + (goal.clinical_Hours || 0), 0)

  const clinicalRemaining =
    clinicalGoal - (totalDirectHours + totalIndirectHours);

  const totalSupervisionHours = supervisionLogs.reduce(
    (total, log) => total + log.supervision_Hours,
    0
  );

  const supervisionGoal =
  goals.reduce((total, goal) => total + (goal.supervision_Hours || 0), 0)


  const supervisionRemaining = supervisionGoal - totalSupervisionHours;

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
    <div className="flex flex-col space-y-10">
      <div>
        <h1 className="font-bold text-2xl">Progress</h1>
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
      </div>

      <div>
        <h1 className="font-bold text-2xl">Clinical Logs</h1>
        <div className="bg-white p-6 md:p-10 rounded-md border shadow-lg flex flex-col md:flex-row justify-center space-y-4 md:space-y-0">
          <Table headers={clinicalHeaders} data={clinicalData} />
        </div>
      </div>

      <div>
        <h1 className="font-bold text-2xl">Supervision Logs</h1>
        <div className="bg-white p-6 md:p-10 rounded-md border shadow-lg flex flex-col md:flex-row justify-center space-y-4 md:space-y-0">
          <Table headers={supervisionHeaders} data={supervisionData} />
        </div>
      </div>
    </div>
  );
};

export default SupervisorUserDetails;
