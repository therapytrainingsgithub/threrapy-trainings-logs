import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RequestProps {
  user: Record<string, React.ReactNode>;
  closePopup: () => void;
  refresh: () => void;
  role: string;
}

const validationSchema = Yup.object().shape({
  role: Yup.string()
    .required("Role is required")
    .oneOf(["supervisor", "user"], "Invalid role"),
});

const AdminRequest: React.FC<RequestProps> = ({
  user,
  closePopup,
  refresh,
  role,
}) => {
  const [currentUser, setCurrentUser] = useState<Record<string, any> | null>(
    null
  );

  // Determine current role based on the prop 'role'
  const currentRole =
    role === "user" ? "User" : role === "supervisor" ? "Supervisor" : "";

  // Set the current user state when 'user' prop changes
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Function to handle form submission and API request
  const handleSubmit = async (
    values: { role: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (currentUser) {
      try {
        // Send updated role to the backend
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

        // Handle success case
        if (response.ok) {
          toast.success("Role updated successfully!");
          refresh(); // Refresh the parent data
          closePopup(); // Close the popup after successful submission
        } else {
          toast.error(`Failed to update role: ${result.message}`);
        }
      } catch (error) {
        // Handle error case
        toast.error("Unexpected error occurred. Please try again.");
        console.error("Error updating role:", error);
      } finally {
        setSubmitting(false); // Stop the form submission spinner
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">{currentRole} Details</h3>
      <div className="space-y-2">
        {currentUser && (
          <Formik
            initialValues={{ role: currentUser.role || "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className=" flex justify-center items-center">
                <div className="w-[50%]">
                  {/* Displaying current user details */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Name:</span>
                    <span>{currentUser?.Name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Current Role:</span>
                    <span>{currentRole}</span>
                  </div>
                  {/* Dropdown for selecting new role */}
                  <div className="flex justify-between items-center mt-2">
                    <label className="font-semibold">New Role:</label>
                    <Field
                      as="select"
                      name="role"
                      className="p-1 rounded border-2 w-[50%]"
                    >
                      <option value="" label="Select New Role" disabled />
                      {currentRole === "User" && (
                        <option value="supervisor" label="Supervisor" />
                      )}
                      {currentRole === "Supervisor" && (
                        <option value="user" label="User" />
                      )}
                    </Field>
                  </div>
                  {/* Error message for role selection */}
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                  {/* Submit button */}
                  <div className="w-full mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
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
