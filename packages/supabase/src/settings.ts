import { requireAdmin } from "./auth.js";
import { unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { Json } from "./types.js";

export async function listPublicSettings(client: CBrainSupabaseClient) {
  const { data, error } = await client
    .from("site_settings")
    .select("*")
    .eq("is_public", true)
    .order("key", { ascending: true });

  return unwrapSupabaseData(data, error);
}

export async function listAdminSettings(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  return unwrapSupabaseData(data, error);
}

export async function upsertSetting(
  client: CBrainSupabaseClient,
  input: {
    isPublic?: boolean;
    key: string;
    value: Json;
  },
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("site_settings")
    .upsert({
      is_public: input.isPublic ?? false,
      key: input.key,
      value: input.value,
    })
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}
