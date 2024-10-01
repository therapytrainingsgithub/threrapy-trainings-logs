import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserContext } from "@/app/context/userContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUserProfileContext } from "@/app/context/userProfileContext";

interface NewClinicalLogProps {
  closePopup: () => void;
  refreshLogs: () => void;
  existingLog?: {
    id: string | number;
    date_logged: string;
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
  date_logged: Yup.string().required("Date is required"),
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
  const {allUsers} = useUserProfileContext()
  const [allLocalUsers, setAllLocalUsers] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<any>([]);
  const router = useRouter();

  // Function to navigate to add new supervisor page
  const goToAddNew = () => {
    router.push("/addNew");
  };

  // Fetch all users from the database
  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase.from("supervisee").select("*");
      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } else {
        setAllLocalUsers(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred while fetching users.");
    }
  };

  // Effect to load users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filter supervisors from the list of users
  useEffect(() => {
    if (allLocalUsers.length > 0) {
      const filteredSupervisors = allLocalUsers.filter(
        (user: any) => user.supervisee_Id === userID
      );

      // Map over the filtered supervisors to find the corresponding names from allUsers
      const supervisorsWithNames = filteredSupervisors
        .map((supervisor) => {
          const matchedUser = allUsers?.find(
            (user) => user.id === supervisor.id
          );
          return matchedUser ? { ...supervisor, name: matchedUser.name } : null;
        })
        .filter(Boolean); // Remove any `null` values
        
      setSupervisors(supervisorsWithNames);
    }
  }, [allUsers, userID]);

  const formik = useFormik({
    initialValues: {
      date_logged: existingLog?.date_logged || "",
      direct_Hours: existingLog?.direct_Hours || "",
      indirect_Hours: existingLog?.indirect_Hours || "",
      site: existingLog?.site || "",
      supervisor: existingLog?.supervisor || "",
      supervisor_Id: existingLog?.supervisor_Id || "",
      status: existingLog?.status || "pending",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
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
          refreshLogs();
          closePopup();
        } else {
          toast.error("Unexpected error occurred. Please try again.");
          console.error("Failed to save data:", result.error);
        }
      } catch (err) {
        toast.error("Unexpected error occurred. Please try again.");
        console.error("Unexpected error:", err);
      } finally {
        setSubmitting(false); // Stop submitting state after request finishes
      }
    },
  });

  useEffect(() => {
    if (existingLog && supervisors.length > 0) {
      const supervisorData = supervisors.find(
        (supervisor: any) => supervisor.name === existingLog.supervisor
      );

      formik.setValues({
        date_logged: existingLog.date_logged,
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
    <main className="py-5 px-4 sm:px-10 space-y-6 sm:space-y-10">
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-6 sm:space-y-10">
        <div className="w-full">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center space-y-6"
          >
            {/* Date Logged Field */}
            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="date_logged">Date</label>
              <input
                className="rounded-md px-4 py-2 w-full border-2"
                type="date"
                id="date_logged"
                name="date_logged"
                value={formik.values.date_logged}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.date_logged && formik.errors.date_logged ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.date_logged}
                </div>
              ) : null}
            </div>

            {/* Direct Hours Field */}
            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="direct_Hours">Direct Hours</label>
              <input
                className="rounded-md px-4 py-2 w-full border-2"
                type="number"
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

            {/* Indirect Hours Field */}
            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="indirect_Hours">Indirect Hours</label>
              <input
                className="rounded-md px-4 py-2 w-full border-2"
                type="number"
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

            {/* Site Field */}
            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="site">Site</label>
              <input
                className="rounded-md px-4 py-2 w-full border-2"
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

            {/* Supervisor Field */}
            <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
              <label htmlFor="supervisor">Supervisor</label>
              {supervisors.length > 0 ? (
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
                  className="rounded-md px-4 py-2 w-full border-2"
                >
                  <option value="" disabled hidden>
                    Select Supervisor
                  </option>
                  {supervisors.map((supervisor: any) => (
                    <option
                      key={supervisor.id}
                      value={`${supervisor.name},${supervisor.id}`}
                    >
                      {supervisor.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500">No supervisor found</p>
              )}
              {formik.touched.supervisor && formik.errors.supervisor ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.supervisor}
                </div>
              ) : null}
            </div>

            {/* Button to add new supervisor */}
            <button
              type="button"
              onClick={goToAddNew}
              className="px-6 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
            >
              Add Supervisor
            </button>

            {/* Submit Button */}
            <div className="w-full sm:w-[50%]">
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? "Submitting..."
                  : mode === "update"
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default NewClinicalLog;
