import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Directly parse the JSON body of the request
    const formData = await req.json();

    // Insert the data into the Supabase table
    const { data: clinicalLog, error: insertError } = await supabase
      .from("clinical_Logs")
      .insert(formData)
      .select();

    if (insertError) {
      console.error("Supabase error:", insertError);
      throw insertError;
    }

    // Return success response
    return NextResponse.json(clinicalLog, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
