import { createClient } from "@supabase/supabase-js";

import { getServerSupabaseEnv } from "./env.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { Database } from "./types.js";

export function createAdminSupabaseClient(): CBrainSupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("Admin Supabase client can only be created on the server.");
  }

  const { secretKey, url } = getServerSupabaseEnv();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as unknown as CBrainSupabaseClient;
}
