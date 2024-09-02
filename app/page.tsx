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

export default function Home() {
  return (
    <AppProviders>
      <HomeContent />
    </AppProviders>
  );
}

function HomeContent() {
  const { userRole } = useUserProfileContext();

  return (
    <main className="py-5 px-10 space-y-10 font-chesna font-regular">
      <Header />

      {/* user UI */}
      {userRole === "user" && <Overview />}
      {userRole === "user" && <ClinicalLogs />}
      {userRole === "user" && <SupervisionLogs />}
      {userRole === "user" && <Goals />}

      {/* supervisor UI */}
      {userRole === "supervisor" && <SupervisorUsers />}
      {userRole === "supervisor" && <SupervisorRequest />}
    </main>
  );
}
