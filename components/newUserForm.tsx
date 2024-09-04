import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserProfileContext } from "@/app/context/userProfileContext";

interface RequestProps {
  closePopup: () => void;
}

const NewUserForm: React.FC<RequestProps> = ({ closePopup }) => {
  const { refreshUsers } = useUserProfileContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      console.error("Error signing up:", authError.message);
      return;
    }

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: authData.user.id,
            name: formData.name,
            role: formData.role,
            email: formData.email,
          },
        ])
        .select();

      if (profileError) {
        console.error(
          "Error inserting into user_profiles:",
          profileError.message
        );
      } else {
        console.log("User profile added:", profileData);
        refreshUsers();
        closePopup();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-6"
    >
      <div className="flex flex-col space-y-1 w-[50%]">
        <label htmlFor="name">Name</label>
        <input
          className="rounded-md px-5 py-2"
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col space-y-1 w-[50%]">
        <label htmlFor="email">Email</label>
        <input
          className="rounded-md px-5 py-2"
          type="email"
          id="email"
          name="email"
          placeholder="username@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col space-y-1 w-[50%]">
        <label htmlFor="password">Password</label>
        <input
          className="rounded-md px-5 py-2"
          placeholder="****************"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col space-y-1 w-[50%]">
        <label htmlFor="role">Role</label>
        <select
          className="rounded-md px-5 py-2"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="" hidden>
            Select Role
          </option>
          <option value="user">User</option>
          <option value="supervisor">Supervisor</option>
        </select>
      </div>

      <div className="w-[50%]">
        <button
          type="submit"
          style={{
            background: "#8cbf68",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          className="px-5 py-2 rounded-md text-white w-full"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default NewUserForm;
