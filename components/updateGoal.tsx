import { useUserContext } from "@/app/context/userContext";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useGoalsContext } from "@/app/context/goalsContext";

interface NewGoalsProps {
  closePopup: () => void;
  supervisionGoal: number;
  clinicalGoal: number;
}

const validationSchema = Yup.object({
  clinical_Hours: Yup.number().required("Clinical Hours Goal is required"),
  supervision_Hours: Yup.number().required(
    "Supervision Hours Goal is required"
  ),
});

const UpdateGoal: React.FC<NewGoalsProps> = ({
  closePopup,
  supervisionGoal,
  clinicalGoal,
}) => {
  const { userID } = useUserContext();
  const { goals, refreshGoals } = useGoalsContext();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      let method = "POST"; // Default to POST (create)
      let url = `/api/goals/post`; // Default to POST URL

      if (goals.length > 0) {
        // If goals already exist, switch to PUT (update)
        method = "PUT";
        url = `/api/goals/update/${userID}`; // Use the specific goal ID for update
      }

      // Make the API request with the appropriate method (PUT or POST)
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, user_Id: userID }),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh the goals in the context after successful update/creation
        refreshGoals();
        toast.success(
          `Goals ${method === "POST" ? "created" : "updated"} successfully!`
        );
        closePopup();
      } else {
        toast.error(
          `Failed to ${method === "POST" ? "create" : "update"} goals: ${
            result.error
          }`
        );
      }
    } catch (err) {
      toast.error("Unexpected error occurred. Please try again.");
      console.error("Unexpected error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-5 px-4 sm:px-10 space-y-6 sm:space-y-10">
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-6 sm:space-y-10">
        <div className="w-full">
          <Formik
            initialValues={{
              clinical_Hours: clinicalGoal,
              supervision_Hours: supervisionGoal,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col items-center space-y-6">
                {/* Clinical Hours Goal Input */}
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="clinical_Hours">Clinical Hours Goal</label>
                  <Field
                    as="input"
                    type="number"
                    id="clinical_Hours"
                    name="clinical_Hours"
                    placeholder="Enter Clinical Goal"
                    className="rounded-md px-4 py-2 w-full border-2"
                  />
                  <ErrorMessage
                    name="clinical_Hours"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Supervision Hours Goal Input */}
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="supervision_Hours">
                    Supervision Hours Goal
                  </label>
                  <Field
                    as="input"
                    type="number"
                    id="supervision_Hours"
                    name="supervision_Hours"
                    placeholder="Enter Supervision Goal"
                    className="rounded-md px-4 py-2 w-full border-2"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
                  >
                    {isSubmitting ? "Updating..." : "Update"}
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

export default UpdateGoal;
