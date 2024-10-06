"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  // Check if the username is already taken in the profiles table
  const { data: existingUsername, error: usernameCheckError } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUsername) {
    return { error: "Username already taken, please try another one" };
  }

  if (usernameCheckError && usernameCheckError.code !== "PGRST116") {
    return { error: "An error occurred while checking username availability" };
  }

  // Proceed with the signup if the username is not taken
  const { error: signupError, data: signupData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/login", // Correct URL for the live domain
      data: {
        username, // Store username in user_metadata (optional)
      },
    },
  });

  if (signupError) {
    return { error: signupError.message };
  }

  if (!signupData || !signupData.user) {
    return { error: "An error occurred during signup. No user data returned." };
  }

  const userId = signupData.user.id;

  try {
    // Create a new user profile in the 'profiles' table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username: username,
      email: email,
    });

    if (profileError) {
      // If profile creation fails, delete the created user
      await supabase.auth.admin.deleteUser(userId);
      return {
        error:
          "An error occurred while creating the user profile. User deleted.",
      };
    }

    // Insert default goals for the new user in the 'goals' table
    const { data: goalsData, error: goalsError } = await supabase
      .from("goals")
      .insert([
        {
          user_Id: userId, // Link the goal to the newly created user
          clinical_Hours: 4000, // Default clinical hours
          supervision_Hours: 100, // Default supervision hours
        },
      ])
      .select();

    if (goalsError) {
      // If goals creation fails, delete both the user and profile
      await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.admin.deleteUser(userId);
      return {
        error:
          "An error occurred while creating the goals. User and profile deleted.",
      };
    }

    // Return success response with the user and goals data
    return {
      message: "User and goals created successfully",
      user: signupData.user,
      goals: goalsData,
    };
  } catch (err) {
    // Catch any unexpected errors, and delete the user as a fallback
    await supabase.auth.admin.deleteUser(userId);
    return {
      error: "An unexpected error occurred. User deleted.",
    };
  }
}
