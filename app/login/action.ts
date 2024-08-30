import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export async function login(email: string, password: string) {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

  } catch (error) {
    console.log(error);
  }
}
