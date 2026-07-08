import { createBrowserClient } from "@supabase/ssr";

import { getPublicSupabaseEnv } from "./env.js";
import type { Database } from "./types.js";

export function createBrowserSupabaseClient() {
  const { publishableKey, url } = getPublicSupabaseEnv();

  return createBrowserClient<Database>(url, publishableKey);
}
