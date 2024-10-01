import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params; // This is the user ID from the URL
  const { clinical_Hours, supervision_Hours } = await req.json(); // Destructure the incoming request body

  try {
    // Update the user's goals in the Supabase `goals` table
    const { data, error } = await supabase
      .from("goals") // The goals table
      .update({
        clinical_Hours,      // Update clinical_Hours
        supervision_Hours,   // Update supervision_Hours
      })
      .eq("user_Id", id)     // Match the user by user_Id
      .select();

    if (error) {
      console.error("Error updating goals:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Goals updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
};
