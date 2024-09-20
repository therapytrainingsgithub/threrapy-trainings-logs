"use client";

import React from "react";
import Header from "@/components/header";
import NewUserForm from "@/components/newUserForm";
import { useUserProfileContext } from "../context/userProfileContext";
import { useRouter } from "next/navigation";
import AppProviders from "../context";

function AddNew() {
  return (
    <AppProviders>
      <AddNewContent />
    </AppProviders>
  );
}

function AddNewContent() {
  const router = useRouter();
  const { userRole } = useUserProfileContext();
  let role =
    userRole === "user"
      ? "Supervisor"
      : userRole === "supervisor"
      ? "Supervisee"
      : "";

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <>
      <div className="space-y-10">
        <Header />
        <div className="flex space-x-4 px-10">
          <button onClick={handleHomeClick} className="text-blue-600 underline">
            Home
          </button>
          <span>{">"}</span>
          <button className="text-gray-600">Add New {role}</button>
        </div>

        <div className="flex flex-col space-y-10 p-10">
          <div>
            <h1 className="font-bold text-2xl">Add New {role}</h1>
            <div className="bg-white p-10 rounded-md border shadow-lg flex flex-col justify-center space-y-4">
              <NewUserForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNew;
