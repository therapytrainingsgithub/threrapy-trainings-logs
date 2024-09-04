import React, { useEffect, useState } from "react";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";

interface RequestProps {
  log: Record<string, React.ReactNode>;
  closePopup: () => void;
  refresh: () => void;
}

const Request: React.FC<RequestProps> = ({ log, closePopup, refresh }) => {
  const [clinicalLog, setClinicalLog] = useState<Record<string, any> | null>(
    null
  );
  const [status, setStatus] = useState<string>("");
  const { allClinicalLogs } = useClinicalLogsContext();

  useEffect(() => {
    if (log && allClinicalLogs) {
      const matchedLog = allClinicalLogs.find((l) => l.id === log.Log_Id);
      setClinicalLog(matchedLog || null);
      if (matchedLog) {
        setStatus(matchedLog.status);
      }
    }
  }, [allClinicalLogs, log]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
    setStatus(event.target.value);
  };

  const handleSubmit = async () => {
    if (clinicalLog) {
      console.log(status);
      try {
        const response = await fetch(
          `/api/clinicalHours//update/${clinicalLog.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
          }
        );
        const result = await response.json();
        console.log("Update result:", result);
        // Handle response and any UI updates here
        if (response.ok) {
          // Close popup and refresh logs on successful update
          refresh();
          closePopup();
        }
      } catch (error) {
        console.error("Error updating status:", error);
        // Handle error here
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Log Details</h3>
      <div className="space-y-2">
        {clinicalLog && (
          <>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{formatDate(clinicalLog.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Week:</span>
              <span>{clinicalLog.week}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Direct Hours:</span>
              <span>{clinicalLog.direct_Hours}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Indirect Hours:</span>
              <span>{clinicalLog.indirect_Hours}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Site:</span>
              <span>{clinicalLog.site}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <select
                value={status}
                onChange={handleStatusChange}
                className="border p-1 rounded"
              >
                  <option value="" disabled>
                    Select a status
                  </option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
              </select>
            </div>
            <div className="w-full">
              <button
                onClick={handleSubmit}
                style={{
                  background: "#8cbf68",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="px-4 py-2 rounded-md text-white w-full "
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Request;
