import React from "react";
import { supabase } from "@/lib/supabase";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface RequestProps {
  closePopup: () => void;
}

const NewUserForm: React.FC<RequestProps> = ({ closePopup }) => {
  const { refreshUsers } = useUserProfileContext();

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: Yup.string()
      .required("Role is required")
      .oneOf(["user", "supervisor"], "Invalid role selected"),
  });

  const handleSubmit = async (
    values: { email: string; password: string; name: string; role: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (authError) {
      toast.error(`Failed to insert data: ${authError}`);
      console.error("Error signing up:", authError.message);
      setSubmitting(false);
      return;
    }

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: authData.user.id,
            name: values.name,
            role: values.role,
            email: values.email,
          },
        ])
        .select();

      if (profileError) {
        toast.error(`Failed to insert data: ${profileError}`);
        console.error(
          "Error inserting into user_profiles:",
          profileError.message
        );
      } else {
        console.log("User profile added:", profileData);
        refreshUsers();
        closePopup();
        toast.success("Data inserted successfully!");
      }
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        name: "",
        role: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col items-center space-y-6">
          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="name">Name</label>
            <Field
              className="rounded-md px-5 py-2"
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="email">Email</label>
            <Field
              className="rounded-md px-5 py-2"
              type="email"
              id="email"
              name="email"
              placeholder="username@example.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="password">Password</label>
            <Field
              className="rounded-md px-5 py-2"
              type="password"
              id="password"
              name="password"
              placeholder="****************"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="role">Role</label>
            <Field
              as="select"
              className="rounded-md px-5 py-2"
              id="role"
              name="role"
            >
              <option value="" hidden>
                Select Role
              </option>
              <option value="user">User</option>
              <option value="supervisor">Supervisor</option>
            </Field>
            <ErrorMessage
              name="role"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div className="w-[50%]">
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "#8cbf68",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              className="px-5 py-2 rounded-md text-white w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewUserForm;
