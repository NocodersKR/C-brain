import { requireAdmin } from "./auth.js";
import { assertSupabaseSuccess, unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { TableInsert, TableUpdate } from "./types.js";

export async function listPublishedServices(client: CBrainSupabaseClient) {
  const { data, error } = await client
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  return unwrapSupabaseData(data, error);
}

export async function listAdminServices(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  return unwrapSupabaseData(data, error);
}

export async function createService(
  client: CBrainSupabaseClient,
  input: TableInsert<"services">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("services")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updateService(
  client: CBrainSupabaseClient,
  id: string,
  input: TableUpdate<"services">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("services")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function deleteService(client: CBrainSupabaseClient, id: string) {
  await requireAdmin(client);

  const { error } = await client.from("services").delete().eq("id", id);

  assertSupabaseSuccess(error);
}
