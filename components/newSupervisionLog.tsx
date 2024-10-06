import { useUserContext } from "@/app/context/userContext";
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

interface NewSupervisionLogProps {
  closePopup: () => void;
  refreshLogs: () => void;
  mode: "update" | "create";
  existingLog?: {
    id: number;
    date_logged: string;
    supervision_Hours: string;
  };
}

const NewSupervisionLog: React.FC<NewSupervisionLogProps> = ({
  closePopup,
  refreshLogs,
  mode,
  existingLog,
}) => {
  const { userID } = useUserContext();

  const initialValues = {
    date_logged:
      mode === "update" && existingLog ? existingLog.date_logged : "",
    supervision_Hours:
      mode === "update" && existingLog ? existingLog.supervision_Hours : "",
  };

  const validationSchema = Yup.object({
    date_logged: Yup.string().required("Date is required"),
    supervision_Hours: Yup.number()
      .typeError("Must be a valid number")
      .required("Supervision hours are required")
      .positive("Supervision hours must be positive"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (mode === "update" && existingLog) {
      await updateLog(existingLog.id, values);
    } else {
      try {
        const response = await fetch("/api/supervisionHours/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, user_Id: userID }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Data inserted successfully!");
          console.log("Data inserted successfully:", result);
          refreshLogs();
          closePopup();
        } else {
          console.error("Failed to insert data:", result.error);
          toast.error(`Failed to insert data: ${result.error}`);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error(`Failed to insert data: ${err}`);
      }
    }
  };

  const updateLog = async (
    id: number,
    updatedFields: { [key: string]: any }
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/supervisionHours/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update log:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Log updated successfully:", result);
      refreshLogs();
      closePopup();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <main className="py-5 px-4 sm:px-10 space-y-6 sm:space-y-10">
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-6 sm:space-y-10">
        <div className="w-full">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, isValid }) => (
              <Form className="flex flex-col items-center space-y-6">
                {/* Date Logged Field */}
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="date_logged">Date</label>
                  <Field
                    className="rounded-md px-4 py-2 w-full border-2"
                    type="date"
                    id="date_logged"
                    name="date_logged"
                  />
                  <ErrorMessage
                    name="date_logged"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Supervision Hours Field */}
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="supervision_Hours">Supervision Hours</label>
                  <Field
                    className="rounded-md px-4 py-2 w-full border-2"
                    type="number"
                    id="supervision_Hours"
                    name="supervision_Hours"
                    placeholder="Enter supervision hours"
                  />
                  <ErrorMessage
                    name="supervision_Hours"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="w-full sm:w-[50%]">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : mode === "update"
                      ? "Update"
                      : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default NewSupervisionLog;
