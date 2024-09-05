import React, { useEffect, useState } from "react";
import { useClinicalLogsContext } from "@/app/context/clinicalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";

interface RequestProps {
  log: Record<string, React.ReactNode>;
  closePopup: () => void;
  refresh: () => void;
}

const Request: React.FC<RequestProps> = ({ log, closePopup, refresh }) => {
  const [clinicalLog, setClinicalLog] = useState<Record<string, any> | null>(
    null
  );
  const { allClinicalLogs } = useClinicalLogsContext();

  useEffect(() => {
    if (log && allClinicalLogs) {
      const matchedLog = allClinicalLogs.find((l) => l.id === log.Log_Id);
      setClinicalLog(matchedLog || null);
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

  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      status: clinicalLog ? clinicalLog.status : "",
    },
    enableReinitialize: true, // Reinitialize form when clinicalLog updates
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      if (clinicalLog) {
        try {
          const response = await fetch(
            `/api/clinicalHours/update/${clinicalLog.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: values.status }),
            }
          );
          const result = await response.json();

          if (response.ok) {
            toast.success("Status updated successfully!");
            refresh(); // Refresh logs
            closePopup(); // Close the popup
          } else {
            toast.error(`Failed to update status: ${result.error}`);
          }
        } catch (error) {
          console.error("Error updating status:", error);
          toast.error(`Failed to update status: ${error}`);
        }
      }
    },
  });

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
            <form onSubmit={formik.handleSubmit}>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <select
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              {formik.touched.status &&
              typeof formik.errors.status === "string" ? (
                <div className="text-red-500">{formik.errors.status}</div>
              ) : null}
              <div className="w-full mt-4">
                <button
                  type="submit"
                  style={{
                    background: "#8cbf68",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  className="px-4 py-2 rounded-md text-white w-full"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Request;
