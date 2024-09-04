import { useUserContext } from "@/app/context/userContext";
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface NewSupervisionLogProps {
  closePopup: () => void;
  refreshLogs: () => void;
  mode: "update" | "create";
  existingLog?: {
    id: number;
    week: string;
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
    week: mode === "update" && existingLog ? existingLog.week : "",
    supervision_Hours:
      mode === "update" && existingLog ? existingLog.supervision_Hours : "",
  };

  const validationSchema = Yup.object({
    week: Yup.string().required("Week is required"),
    supervision_Hours: Yup.string()
      .matches(/^\d+(\.\d{1,2})?$/, "Must be a valid number")
      .required("Supervision hours are required"),
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
          console.log("Data inserted successfully:", result);
          refreshLogs();
          closePopup();
        } else {
          console.error("Failed to insert data:", result.error);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
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
      refreshLogs(); // Refresh the logs after updating
      closePopup();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <main className="py-5 px-4 sm:px-10 font-chesna space-y-6 sm:space-y-10">
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
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="week">Week</label>
                  <Field
                    className="rounded-md px-4 py-2 w-full"
                    type="week"
                    id="week"
                    name="week"
                  />
                  <ErrorMessage
                    name="week"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="supervision_Hours">Supervision Hours</label>
                  <Field
                    className="rounded-md px-4 py-2 w-full"
                    type="text"
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

                <div className="w-full sm:w-[50%]">
                  <button
                    type="submit"
                    style={{
                      background: isValid ? "#8cbf68" : "#c0c0c0",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    className="px-4 py-2 rounded-md text-white w-full"
                    disabled={!isValid || isSubmitting}
                  >
                    {mode === "update" ? "Update" : "Submit"}
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
