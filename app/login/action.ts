import { supabase } from "@/lib/supabase";

export async function login(email: string, password: string) {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if(error){
      console.log(error)
    }
  } catch (error) {
    console.log(error);
  }
}
