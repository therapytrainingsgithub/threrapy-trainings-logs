import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RequestProps {
  user: Record<string, React.ReactNode>;
  closePopup: () => void;
  refresh: () => void;
}

const validationSchema = Yup.object().shape({
  role: Yup.string()
    .required("Role is required")
    .oneOf(["supervisor"], "Invalid role"),
});

const AdminRequest: React.FC<RequestProps> = ({
  user,
  closePopup,
  refresh,
}) => {
  const [currentUser, setCurrentUser] = useState<Record<string, any> | null>(
    null
  );

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const handleSubmit = async (
    values: { role: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (currentUser) {
      try {
        const response = await fetch(
          `/api/userProfile/update/${currentUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: values.role }),
          }
        );
        const result = await response.json();
        console.log("Update result:", result); // Debugging log
        if (response.ok) {
          toast.success("Data inserted successfully!");
          refresh();
          closePopup();
        }
      } catch (error) {
        toast.error("Unexpected error occurred. Please try again.");
        console.error("Error updating status:", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">User Details</h3>
      <div className="space-y-2">
        {currentUser && (
          <Formik
            initialValues={{ role: currentUser.role || "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="flex justify-between">
                  <span className="font-semibold">Name:</span>
                  <span>{currentUser?.Name}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold">Status:</label>
                  <Field as="select" name="role" className="p-1 rounded border-2">
                    <option value="" label="Select a status" disabled />
                    <option value="supervisor" label="Supervisor" />
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>
                <div className="w-full mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AdminRequest;
