import { useUserContext } from "@/app/context/userContext";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
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
  const { refreshGoals } = useGoalsContext();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Call the API to update the goals
      const response = await fetch(`/api/goals/update/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, user_Id: userID }),
      });

      const result = await response.json();

      if (response.ok) {
        refreshGoals();
        toast.success("Goals updated successfully!"); // Success message
        closePopup();
      } else {
        toast.error(`Failed to update goals: ${result.error}`); // Error message
      }
    } catch (err) {
      toast.error("Unexpected error occurred. Please try again."); // Error message
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
