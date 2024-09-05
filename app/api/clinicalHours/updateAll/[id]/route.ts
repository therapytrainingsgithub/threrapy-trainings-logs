import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const updatedFields = await req.json(); // Get the entire object

  try {
    const { data, error } = await supabase
      .from("clinical_Logs")
      .update(updatedFields) // Update with the entire object
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating log:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
