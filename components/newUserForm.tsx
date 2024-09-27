import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserProfileContext } from "@/app/context/userProfileContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const passwordLength = 12;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const NewUserForm = () => {
  const { refreshUsers, userRole } = useUserProfileContext(); // Fetch current user's role
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
  } | null>(null);

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"), // Add validation for the role field
  });

  const handleSubmit = async (
    values: { email: string; password: string; name: string; role: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
      // API call to the Next.js API route for user creation
      const response = await fetch("/api/userProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Send user details to the API
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(`Failed to create user: ${result.error}`);
        console.error("Error creating user:", result.error);
        setSubmitting(false);
        return;
      }

      // If successful
      toast.success("User created successfully!");
      console.log("User created successfully:", result.user);

      // You can refresh your user list or perform any additional logic
      refreshUsers(); // Optional: if you have a function to refresh the user list
      setUserData({ ...values, role: values.role }); // Optional: set the user data
    } catch (error) {
      toast.error("An error occurred while creating the user.");
      console.error("Error during handleSubmit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordGenerate = (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setFieldValue("password", newPassword);
  };

  const handleCopyCredentials = () => {
    if (userData) {
      const { name, email, password } = userData;
      const credentials = `Name: ${name}  Email: ${email} Password: ${password}`;
      navigator.clipboard
        .writeText(credentials)
        .then(() => {
          toast.success("Credentials copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy credentials.");
        });
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        name: "",
        role:
          userRole === "admin"
            ? ""
            : userRole === "user"
            ? "supervisor"
            : userRole === "supervisor"
            ? "user"
            : "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="flex flex-col items-center space-y-6">
          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="name">Name</label>
            <Field
              className="rounded-md px-5 py-2 border-2"
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
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
              className="rounded-md px-5 py-2 border-2"
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
            <div className="flex items-center space-x-2">
              <Field
                className="rounded-md px-5 py-2 border-2 flex-grow"
                type="password"
                id="password"
                name="password"
                placeholder="****************"
              />
              <button
                type="button"
                onClick={() => handlePasswordGenerate(setFieldValue)}
                className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
              >
                Generate Password
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          {userRole === "admin" && (
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="role">Role</label>
              <Field
                as="select"
                className="rounded-md px-5 py-2 border-2"
                id="role"
                name="role"
              >
                <option value="" disabled>
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
          )}

          <div className="w-[50%]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {userData && (
            <div className="w-[50%]">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="px-4 py-2 mt-4 rounded-md text-white bg-green-500 hover:bg-green-600 w-full"
              >
                Copy Credentials
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default NewUserForm;
