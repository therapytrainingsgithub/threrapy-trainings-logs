"use client";

import React, { useState, useEffect } from "react";
import ClinicalLogs from "@/components/clinicalLogs";
import Goals from "@/components/goals";
import Header from "@/components/header";
import Overview from "@/components/overview";
import SupervisionLogs from "@/components/supervisionLogs";
import AppProviders from "./context";


export default function Home() {

  return (
    <>
      <AppProviders>
        <main className="py-5 px-10 space-y-10 font-chesna font-regular">
          <Header />
          <Overview />
          <ClinicalLogs />
          <SupervisionLogs />
          <Goals/>
        </main>
      </AppProviders>
    </>
  );
}
