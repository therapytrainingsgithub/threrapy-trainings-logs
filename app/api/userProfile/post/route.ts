import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    console.log("API request received"); // To verify that the request is hitting the API

    // Parse the request body to get user details
    const { email, password, name, role } = await req.json();

    // Use Supabase Admin API to create the user without logging them in
    const { data, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role }, // Optional user metadata
      });

    if (userError || !data?.user?.id) {
      return NextResponse.json(
        { error: userError?.message || "User creation failed" },
        { status: 400 }
      );
    }

    const userId = data.user.id;

    // Insert the user profile into the `user_profiles` table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: userId,
          name,
          email,
          role,
        },
      ]);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // Insert goals into the `goals` table for the newly created user
    const { data: goalsData, error: goalsError } = await supabaseAdmin
      .from("goals")
      .insert([
        {
          user_Id: userId, // Link the goal to the newly created user
          clinical_Hours: 4000, // Default clinical hours
          supervision_Hours: 100, // Default supervision hours
        },
      ]);

    if (goalsError) {
      return NextResponse.json({ error: goalsError.message }, { status: 400 });
    }

    // Return a success response with the newly created user and goals data
    return NextResponse.json(
      {
        message: "User and goals created successfully",
        user: profileData,
        goals: goalsData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user and goals:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user and goals" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
