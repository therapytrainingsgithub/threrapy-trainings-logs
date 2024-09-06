"use client";

import React from "react";
import ClinicalLogs from "@/components/clinicalLogs";
import Goals from "@/components/goals";
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

export default function Home() {
  return (
    <AppProviders>
      <ToastContainer />
      <HomeContent />
    </AppProviders>
  );
}

function HomeContent() {
  const { userRole } = useUserProfileContext();

  return (
    <main className="py-5 px-10 space-y-10 bg-[#f5f5f5]">
      <Header />

      {/* user UI */}
      {userRole === "user" && <Overview />}
      {userRole === "user" && <ClinicalLogs />}
      {userRole === "user" && <SupervisionLogs />}
      {userRole === "user" && <Goals />}

      {/* supervisor UI */}
      {userRole === "supervisor" && <Overview />}
      {userRole === "supervisor" && <ClinicalLogs />}
      {userRole === "supervisor" && <SupervisionLogs />}
      {userRole === "supervisor" && <Goals />}
      {userRole === "supervisor" && <SupervisorUsers />}
      {userRole === "supervisor" && <SupervisorRequest />}

      {/* admin UI */}
      {userRole === "admin" && <AdminUsers />}
      {userRole === "admin" && <AdminSupervisor />}
    </main>
  );
}
