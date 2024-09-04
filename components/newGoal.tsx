import { useUserContext } from "@/app/context/userContext";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify

interface NewGoalsProps {
  closePopup: () => void;
}

// Define validation schema with Yup
const validationSchema = Yup.object({
  week: Yup.string().required("Week is required"),
  clinical_Hours: Yup.string().required("Clinical Hours Goal is required"),
  supervision_Hours: Yup.string().required(
    "Supervision Hours Goal is required"
  ),
});

const NewGoal: React.FC<NewGoalsProps> = ({ closePopup }) => {
  const { userID } = useUserContext();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch("/api/goals/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, user_Id: userID }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Data inserted successfully!"); // Success message
        closePopup();
      } else {
        toast.error(`Failed to insert data: ${result.error}`); // Error message
      }
    } catch (err) {
      toast.error("Unexpected error occurred. Please try again."); // Error message
      console.error("Unexpected error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-5 px-4 sm:px-10 font-chesna space-y-6 sm:space-y-10">
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-6 sm:space-y-10">
        <div className="w-full">
          <Formik
            initialValues={{
              week: "",
              clinical_Hours: "",
              supervision_Hours: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col items-center space-y-6">
                {/* Week Input */}
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="week">Week</label>
                  <Field
                    as="input"
                    type="week"
                    id="week"
                    name="week"
                    className="rounded-md px-4 py-2 w-full"
                  />
                  <ErrorMessage
                    name="week"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Clinical Hours Goal Input */}
                <div className="flex flex-col space-y-1 w-full sm:w-[50%]">
                  <label htmlFor="clinical_Hours">Clinical Hours Goal</label>
                  <Field
                    as="input"
                    type="text"
                    id="clinical_Hours"
                    name="clinical_Hours"
                    placeholder="Enter Clinical Goal"
                    className="rounded-md px-4 py-2 w-full"
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
                    type="text"
                    id="supervision_Hours"
                    name="supervision_Hours"
                    placeholder="Enter Supervision Goal"
                    className="rounded-md px-4 py-2 w-full"
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
                    style={{
                      background: "#8cbf68",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    className="px-4 py-2 rounded-md text-white w-full"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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

export default NewGoal;
