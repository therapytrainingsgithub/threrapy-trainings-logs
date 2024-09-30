import React, { useEffect, useState } from "react";
import Table from "./table";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { useUserContext } from "@/app/context/userContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "@/lib/supabase";

interface ClinicalLog {
  id: number;
  created_at: string;
  week: string;
  direct_Hours: string;
  indirect_Hours: string;
  site: string;
  status: string;
  user_Id: string;
  supervisor_Id: string;
}

const SupervisorRequest: React.FC = () => {
  const { allClinicalLogs, refreshLogs } = useClinicalLogsContext();
  const { allUsers } = useUserProfileContext();
  const { userID } = useUserContext();
  const [supervisorsLogs, setSupervisorsLogs] = useState<ClinicalLog[]>([]);

  // Function to capitalize the first letter of a string
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Fetch and filter logs for the supervisor when the component mounts or `userID` changes
  useEffect(() => {
    const fetchLogs = async () => {
      refreshLogs(); // Fetch the latest logs once
      const logsForSupervisor = allClinicalLogs.filter(
        (log) => log.supervisor_Id === userID
      );
      setSupervisorsLogs(logsForSupervisor);
    };

    if (userID) fetchLogs();
  }, [userID, allClinicalLogs]);

  // Handle status updates for clinical logs
  const handleAction = async (id: number, status: string) => {
    if (id) {
      try {
        const response = await fetch(`/api/clinicalHours/update/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // Disable cache for the update request
          body: JSON.stringify({ status: status }),
        });
        const result = await response.json();

        if (response.ok) {
          toast.success("Status updated successfully!");
          refreshLogs(); // Fetch fresh logs after status update
          fetchAllClinicalLogs()
        } else {
          toast.error(`Failed to update status: ${result.error}`);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(`Failed to update status: ${error}`);
      }
    }
  };

  const fetchAllClinicalLogs = async () => {
    try {
      const response = await fetch(`/api/clinicalHours/fetchAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate", // Ensure no caching
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all clinical logs");
      }

      const data: ClinicalLog[] = await response.json();
      // setAllLogs(data); // Store the fetched logs in state
      console.log(data)
    } catch (error) {
      console.error("Error fetching all clinical logs:", error);
    }
  };

  // Table headers
  const headers = [
    "Week Logged",
    "Date Logged",
    "User",
    "Direct Hours",
    "Indirect Hours",
    "Site",
    "Status",
    "Action",
  ];

  // Map the supervisors logs into a format compatible with the table
  const data = supervisorsLogs.map((log) => {
    const user = allUsers?.find((user) => user.id === log.user_Id);
    const [year, week] = log.week.split("-W");
    const { start, end } = getWeekDates(parseInt(year, 10), parseInt(week, 10));

    return {
      Log_Id: log.id,
      "Week Logged": `${log.week}-${start} to ${end}`,
      "Date Logged": new Date(log.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      User: user ? user.name : "Unknown",
      "Direct Hours": log.direct_Hours,
      "Indirect Hours": log.indirect_Hours,
      Site: log.site ?? "N/A",
      Status: capitalizeFirstLetter(log.status),
      Action: (
        <div className="space-x-2">
          <button
            onClick={() => handleAction(log.id, "decline")}
            className={`px-5 py-2 rounded-md text-white ${
              log.status === "pending"
                ? "bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={log.status !== "pending"}
          >
            Decline
          </button>
          <button
            onClick={() => handleAction(log.id, "accept")}
            className={`px-5 py-2 rounded-md text-white ${
              log.status === "pending"
                ? "bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={log.status !== "pending"}
          >
            Accept
          </button>
        </div>
      ),
    };
  });

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0 font-bold">
          Request for Logged Hours
        </h1>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-md shadow-lg border overflow-x-auto">
        <Table headers={headers} data={data} />
      </div>
    </main>
  );
};

export default SupervisorRequest;

// Helper function to get the start and end dates of a week
function getWeekDates(year: number, week: number) {
  const startDate = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = startDate.getDay();
  const start = new Date(
    startDate.setDate(startDate.getDate() - dayOfWeek + 1)
  );
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

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
