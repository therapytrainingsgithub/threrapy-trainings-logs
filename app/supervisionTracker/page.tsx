"use client";

import React from "react";
import Header from "@/components/header";
import Overview from "@/components/overview";
import ClinicalLogs from "@/components/clinicalLogs";
import SupervisionLogs from "@/components/supervisionLogs";
import AppProviders from "../context";

const SupervisionTracker = () => {
  return (
    <AppProviders>
      <SupervisionTrackerContent />
    </AppProviders>
  );
};

const SupervisionTrackerContent = () => {
  return (
    <>
      <Header />
      <main className="py-5 px-10 space-y-10 bg-[#f5f5f5] font-roboto">
        <Overview />
        <ClinicalLogs />
        <SupervisionLogs />
      </main>
    </>
  );
};

export default SupervisionTracker;
