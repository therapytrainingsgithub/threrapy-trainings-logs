"use client";

import React, { useEffect, useState } from "react";
import ClinicalLogs from "@/components/clinicalLogs";
import Header from "@/components/header";
import Overview from "@/components/overview";
import SupervisionLogs from "@/components/supervisionLogs";
import AppProviders from "./context";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API delay
      
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
        <Overview />
        <ClinicalLogs />
        <SupervisionLogs />
      </main>
    </>
  );
}
