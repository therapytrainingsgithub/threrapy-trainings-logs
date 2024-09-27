import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!;

// Client for public API usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (use this for createUser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
