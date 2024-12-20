import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserContext } from "@/app/context/userContext";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

interface NewClinicalLogProps {
  closePopup: () => void;
  refreshLogs: () => void;
  existingLog?: {
    id: string | number;
    date_logged: string;
    direct_Hours: string;
    indirect_Hours: string;
    site: string;
  };
  mode?: "create" | "update";
}

interface User {
  id: string;
  name: string;
  role: string;
}

const NewClinicalLog: React.FC<NewClinicalLogProps> = ({
  closePopup,
  refreshLogs,
  existingLog,
  mode = "create",
}) => {
  const { userID } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    date_logged: Yup.string().required("Date is required"),
    direct_Hours: Yup.number()
      .typeError("Direct Hours must be a number")
      .integer("Direct Hours must be an integer")
      .min(0, "Direct Hours must be at least 0")
      .nullable()
      .default(0), // Default to 0 if empty
    indirect_Hours: Yup.number()
      .typeError("Indirect Hours must be a number")
      .integer("Indirect Hours must be an integer")
      .min(0, "Indirect Hours must be at least 0")
      .nullable()
      .default(0), // Default to 0 if empty
    site: Yup.string().required("Site is required"),
  }).test(
    "one-must-be-positive",
    "Either Direct Hours or Indirect Hours must be filled.",
    function (value) {
      const { direct_Hours, indirect_Hours } = value;
      if ((direct_Hours || 0) === 0 && (indirect_Hours || 0) === 0) {
        return this.createError({
          path: "direct_Hours",
          message: "Either Direct Hours or Indirect Hours must be filled.",
        });
      }
      return true; // Validation passes if at least one is non-zero
    }
  );

  const formik = useFormik({
    initialValues: {
      date_logged: existingLog?.date_logged || "",
      direct_Hours: existingLog?.direct_Hours || 0,
      indirect_Hours: existingLog?.indirect_Hours || 0,
      site: existingLog?.site || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      // Get user-selected date
      const selectedDate = values.date_logged;

      // Get current time in UTC as `HH:mm:ss`
      const currentTime = new Date().toISOString().split("T")[1]; // Extracts `HH:mm:ss.sssZ`

      // Combine date and time to form a full UTC timestamp
      const combinedTimestamp = `${selectedDate}T${currentTime}`;

      // Ensure empty fields for hours are treated as 0
      const updatedValues = {
        ...values,
        date_logged: combinedTimestamp, // Use the combined date and time
        direct_Hours: values.direct_Hours || 0,
        indirect_Hours: values.indirect_Hours || 0,
      };

      const url =
        mode === "create"
          ? "/api/clinicalHours/post"
          : `/api/clinicalHours/update/${existingLog?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedValues, user_Id: userID }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to save data.");
        }

        toast.success("Data submitted successfully!");
        refreshLogs();
        closePopup();
      } catch {
        toast.error("An unexpected error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="py-5 px-4 sm:px-10 space-y-6 sm:space-y-10">
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-6 sm:space-y-10">
        <div className="w-full">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center space-y-6"
          >
            {/* Loading Indicator */}
            {loading && <p>Loading data...</p>}

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
              />
              {formik.touched.indirect_Hours && formik.errors.indirect_Hours ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.indirect_Hours}
                </div>
              ) : null}
              {formik.touched.direct_Hours && formik.errors.direct_Hours ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.direct_Hours}
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

            {/* Submit Button */}
            <div className="w-full sm:w-[50%]">
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
                disabled={formik.isSubmitting || loading}
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
