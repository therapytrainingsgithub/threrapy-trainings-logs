import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserContext } from "@/app/context/userContext";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NewClinicalLogProps {
  closePopup: () => void;
  refreshLogs: () => void;
  existingLog?: {
    id: string | number;
    week: string;
    direct_Hours: string;
    indirect_Hours: string;
    site: string;
    supervisor: string;
    supervisor_Id?: string;
    status: string;
  };
  mode?: "create" | "update";
}

interface User {
  id: string;
  name: string;
  role: string;
}

const validationSchema = Yup.object({
  week: Yup.string().required("Week is required"),
  direct_Hours: Yup.number()
    .typeError("Direct Hours must be a number")
    .required("Direct Hours is required")
    .positive("Direct Hours must be positive")
    .integer("Direct Hours must be an integer"),
  indirect_Hours: Yup.number()
    .typeError("Indirect Hours must be a number")
    .required("Indirect Hours is required")
    .positive("Indirect Hours must be positive")
    .integer("Indirect Hours must be an integer"),
  site: Yup.string().required("Site is required"),
  supervisor: Yup.string().required("Supervisor is required"),
  supervisor_Id: Yup.string().required("Supervisor ID is required"),
});

const NewClinicalLog: React.FC<NewClinicalLogProps> = ({
  closePopup,
  refreshLogs,
  existingLog,
  mode = "create",
}) => {
  const { userID } = useUserContext();
  const { allUsers } = useUserProfileContext();
  const [supervisors, setSupervisors] = useState<User[]>([]);

  useEffect(() => {
    if (allUsers) {
      const filteredSupervisors = allUsers.filter(
        (user) => user.role === "supervisor" && user.id !== userID
      );
      setSupervisors(filteredSupervisors);
    }
  }, [allUsers, userID]);

  const formik = useFormik({
    initialValues: {
      week: existingLog?.week || "",
      direct_Hours: existingLog?.direct_Hours || "",
      indirect_Hours: existingLog?.indirect_Hours || "",
      site: existingLog?.site || "",
      supervisor: existingLog?.supervisor || "",
      supervisor_Id: existingLog?.supervisor_Id || "",
      status: existingLog?.status || "pending",
    },
    validationSchema,
    onSubmit: async (values) => {
      const url =
        mode === "create"
          ? "/api/clinicalHours/post"
          : `/api/clinicalHours/updateAll/${existingLog?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, user_Id: userID }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Data inserted successfully!");
          console.log("Data saved successfully:", result);
          refreshLogs();
          closePopup();
        } else {
          toast.error("Unexpected error occurred. Please try again.");
          console.error("Failed to save data:", result.error);
        }
      } catch (err) {
        toast.error("Unexpected error occurred. Please try again.");
        console.error("Unexpected error:", err);
      }
    },
  });

  useEffect(() => {
    if (existingLog) {
      const supervisorData = supervisors.find(
        (supervisor) => supervisor.name === existingLog.supervisor
      );

      formik.setValues({
        week: existingLog.week,
        direct_Hours: existingLog.direct_Hours,
        indirect_Hours: existingLog.indirect_Hours,
        site: existingLog.site,
        supervisor: existingLog.supervisor,
        supervisor_Id: supervisorData?.id || existingLog.supervisor_Id || "",
        status: existingLog.status,
      });
    }
  }, [existingLog, supervisors]);

  return (
    <main className="py-5 px-4 sm:px-10 font-chesna space-y-6 sm:space-y-10">
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-6 sm:space-y-10">
        <div className="w-full">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center space-y-6"
          >
            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="week">Week</label>
              <input
                className="rounded-md px-4 py-2 w-full"
                type="week"
                id="week"
                name="week"
                value={formik.values.week}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.week && formik.errors.week ? (
                <div className="text-red-500 text-sm">{formik.errors.week}</div>
              ) : null}
            </div>

            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="direct_Hours">Direct Hours</label>
              <input
                className="rounded-md px-4 py-2 w-full"
                type="text"
                id="direct_Hours"
                name="direct_Hours"
                placeholder="Enter Direct hours"
                value={formik.values.direct_Hours}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.direct_Hours && formik.errors.direct_Hours ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.direct_Hours}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="indirect_Hours">Indirect Hours</label>
              <input
                className="rounded-md px-4 py-2 w-full"
                type="text"
                id="indirect_Hours"
                name="indirect_Hours"
                placeholder="Enter Indirect hours"
                value={formik.values.indirect_Hours}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.indirect_Hours && formik.errors.indirect_Hours ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.indirect_Hours}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="site">Site</label>
              <input
                className="rounded-md px-4 py-2 w-full"
                type="text"
                id="site"
                name="site"
                placeholder="Enter Site"
                value={formik.values.site}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.site && formik.errors.site ? (
                <div className="text-red-500 text-sm">{formik.errors.site}</div>
              ) : null}
            </div>

            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="supervisor">Supervisor</label>
              <select
                name="supervisor"
                value={
                  formik.values.supervisor_Id
                    ? `${formik.values.supervisor},${formik.values.supervisor_Id}`
                    : ""
                }
                onChange={(e) => {
                  const [supervisorName, supervisorId] =
                    e.target.value.split(",");
                  formik.setFieldValue("supervisor", supervisorName);
                  formik.setFieldValue("supervisor_Id", supervisorId);
                }}
                onBlur={formik.handleBlur}
                className="rounded-md px-4 py-2 w-full"
              >
                <option value="" disabled hidden>
                  Select Supervisor
                </option>
                {supervisors.map((supervisor) => (
                  <option
                    key={supervisor.id}
                    value={`${supervisor.name},${supervisor.id}`}
                  >
                    {supervisor.name}
                  </option>
                ))}
              </select>
              {formik.touched.supervisor && formik.errors.supervisor ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.supervisor}
                </div>
              ) : null}
            </div>

            <div className="w-full sm:w-[50%]">
              <button
                type="submit"
                style={{
                  background: "#8cbf68",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="px-4 py-2 rounded-md text-white w-full"
              >
                {mode === "update" ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default NewClinicalLog;
