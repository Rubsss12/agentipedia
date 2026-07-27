// Browser-side Supabase client for the login front door. The URL and the
// publishable key are public by design (safe to ship in client code). Override
// per-environment with NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exdpayjilefpzhujusoo.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_V1IqD4Z4j5hZHTyckdSFPw_XbCvWn63";

// Only these emails may request a link (client-side gate); "" allows any.
export const ALLOWED_DOMAIN = "hubinstitute.com";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
