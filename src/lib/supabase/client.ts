import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// We must use NEXT_PUBLIC variables for the client side. 
// If they aren't set, we fall back to standard process.env (for server context)
export const supabase = createClient(
  supabaseUrl || process.env.SUPABASE_URL || "",
  supabaseAnonKey || process.env.SUPABASE_ANON_KEY || ""
);
