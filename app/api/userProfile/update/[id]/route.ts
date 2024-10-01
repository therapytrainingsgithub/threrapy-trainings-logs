import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const { role } = await req.json();
  console.log(role)
  console.log(id)

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ role })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
};
