import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("clinical_Logs")
      .select("*");

    if (error) {
      console.error("Error fetching session:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the returned data from Supabase to ensure it's fresh
    console.log("Fetched clinical logs:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
