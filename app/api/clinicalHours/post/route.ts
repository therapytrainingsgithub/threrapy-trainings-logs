import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Directly parse the JSON body of the request
    const formData = await req.json();
    console.log("Received formData:", formData);

    // Insert the data into the Supabase table
    const { data, error } = await supabase
      .from("clinical_Logs")
      .insert(formData)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
