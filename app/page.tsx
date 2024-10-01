"use client";

import React, { useEffect, useState } from "react";
import ClinicalLogs from "@/components/clinicalLogs";
import Header from "@/components/header";
import Overview from "@/components/overview";
import SupervisionLogs from "@/components/supervisionLogs";
import AppProviders from "./context";
import { useUserProfileContext } from "./context/userProfileContext";
import SupervisorUsers from "@/components/supervisorUsers";
import SupervisorRequest from "@/components/supervisorRequest";
import AdminUsers from "@/components/adminUsers";
import AdminSupervisor from "@/components/adminSupervisor";
import { ToastContainer } from "react-toastify";
import { supabase } from "@/lib/supabase";
import AdminDashboard from "@/components/adminDashboard";

export default function Home() {
  return (
    <AppProviders>
      <ToastContainer />
      <HomeContent />
    </AppProviders>
  );
}

function HomeContent() {
  const [loading, setLoading] = useState(true);
  const { userRole } = useUserProfileContext();

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Simulate the time it takes to fetch the user role
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API delay
        // Assuming the userRole is set after fetching the data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop the loader when data is fetched
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="py-5 px-10 space-y-10 bg-[#f5f5f5] font-roboto">
        {/* user UI */}
        {userRole === "user" && <Overview />}
        {userRole === "user" && <ClinicalLogs />}
        {userRole === "user" && <SupervisionLogs />}

        {/* supervisor UI */}
        {userRole === "supervisor" && <Overview />}
        {userRole === "supervisor" && <ClinicalLogs />}
        {userRole === "supervisor" && <SupervisionLogs />}
        {userRole === "supervisor" && <SupervisorUsers />}
        {userRole === "supervisor" && <SupervisorRequest />}

        {/* admin UI */}
        {userRole === "admin" && <AdminDashboard />}
      </main>
    </>
  );
}
