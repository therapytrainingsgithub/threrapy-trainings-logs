// Import necessary modules
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// Define the DELETE method handler
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const { error } = await supabase
      .from("clinical_Logs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting log:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { status: "deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
