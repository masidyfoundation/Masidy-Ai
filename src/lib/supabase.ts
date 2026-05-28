import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fcyeujjqklwcultctcrd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeWV1ampxa2x3Y3VsdGN0Y3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MTAxOTIsImV4cCI6MjA5NTQ4NjE5Mn0.rXuK7t0KVyNmrrX4wGGpahLRyjmt2OjcNZ8FNe2KJAU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
};
