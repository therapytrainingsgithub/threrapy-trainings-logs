import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    console.log("API request received"); // To verify that the request is hitting the API

    // Parse the request body to get user details
    const { email, password, name, role } = await req.json();

    console.log("Request data:", { email, password, name, role }); // To check if the request data is coming through correctly

    // Use Supabase Admin API to create the user without logging them in
    const { data, error: userError } = await supabase.auth.admin.createUser({
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
    const { data: profileData, error: profileError } = await supabase
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

    // Return a success response with the newly created user data
    return NextResponse.json(
      { message: "User created successfully", user: profileData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
