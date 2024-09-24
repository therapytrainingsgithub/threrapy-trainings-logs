import { supabase } from "@/lib/supabase";

export async function login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password. Please try again.");
      } else {
        throw new Error(error.message); // For other errors
      }
    }

    return data; // Return data if successful
  } catch (error: any) {
    console.error("Error during login:", error);
    throw error; // Re-throw the error to be caught in the calling function
  }
}
