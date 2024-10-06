"use client";

import React, { useEffect, useState } from "react";
import AppProviders from "./context";
import { ToastContainer } from "react-toastify";
import SupervisionTracker from "./supervisionTracker/page";

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
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
      <SupervisionTracker />
    </>
  );
}
