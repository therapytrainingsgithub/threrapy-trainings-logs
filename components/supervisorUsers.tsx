import React, { useEffect, useState } from "react";
import Table from "./table";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { useUserContext } from "@/app/context/userContext";
import SupervisorUserDetails from "./supervisorUserDetails";
import { supabase } from "@/lib/supabase";

interface ClinicalLog {
  created_at: string;
  direct_Hours: string;
  indirect_Hours: string;
  site: string;
  status: string;
  user_Id: string;
  supervisor_Id: string;
}

const SupervisorUsers: React.FC = () => {
  const [superviseeID, setSuperviseeID] = useState<string | undefined>(
    undefined
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { allUsers } = useUserProfileContext();
  const { userID } = useUserContext();
  const [supervisorsUsers, setSupervisorsUsers] = useState<ClinicalLog[]>([]);

  // Fetch logs for supervisor
  const fetchSupervisees = async () => {
    try {
      const { data, error } = await supabase.from("supervisee").select("*");

      if (error) {
        console.error("Error fetching logs:", error);
        return;
      }

      const supervisees = data.filter(
        (supervisee: any) => supervisee.id === userID
      );

      setSupervisorsUsers(supervisees);
    } catch (err) {
      console.error("Unexpected error fetching logs:", err);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchSupervisees();
    }
  }, [userID]);

  const headers = ["Supervisees"];

  const data = supervisorsUsers
    .map((supervisee: any) => {
      const user = allUsers?.find(
        (user) => user.id === supervisee.supervisee_Id
      );
      const userName = user ? user.name : "Unknown";

      return {
        Supervisees: userName,
        id: supervisee.supervisee_Id,
      };
    })
    .filter((entry) => entry !== null);

  // Handle row click in the table (to open the popup)
  const handleRowClick = (rowData: Record<string, React.ReactNode>) => {
    const superviseeId = rowData.id as string | undefined;
    if (superviseeId) {
      setSuperviseeID(superviseeId);
      setIsPopupOpen(true);
    }
  };

  // Close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <main className="space-y-5 p-4 md:p-10">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-[24px] mb-4 md:mb-0 font-bold">Supervisees</h1>
      </div>

      <div className="bg-white shadow-lg p-4 md:p-10 rounded-md border overflow-x-auto">
        <Table
          headers={headers}
          data={data}
          editable={true}
          onRowClick={handleRowClick}
        />
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="p-5 rounded-md shadow-lg w-[90%] bg-white border overflow-y-auto h-[80%]">
            <h2 className="text-2xl mb-4 font-bold">Supervisee Details</h2>
            <SupervisorUserDetails superviseeID={superviseeID} />
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

export default SupervisorUsers;
