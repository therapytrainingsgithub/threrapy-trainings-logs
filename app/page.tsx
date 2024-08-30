"use client";

import React, { useState, useEffect } from "react";
import ClinicalLogs from "@/components/clinicalLogs";
import Goals from "@/components/goals";
import Header from "@/components/header";
import Overview from "@/components/overview";
import SupervisionLogs from "@/components/supervisionLogs";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Log {
  id: number;
  created_at: string;
  week: string;
  user_id: string;
  direct_Hours: string;
  indirect_Hours: string;
  supervision_Hours: string;
  source: string;
}

export default function Home() {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      router.push("/login");
      return;
    }
    const userID = user.id;

    try {
      const response = await fetch(`/api/fetchtracker/${userID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data: Log[] = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <>
      <main className="py-5 px-10 space-y-10 font-chesna font-regular">
        <Header />
        <Overview logs={logs} />
        <ClinicalLogs logs={logs} />
        <SupervisionLogs logs={logs} />
        <Goals logs={logs} />
      </main>
    </>
  );
}
