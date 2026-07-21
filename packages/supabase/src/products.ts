import { requireAdmin } from "./auth.js";
import { unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { TableInsert, TableUpdate } from "./types.js";

export async function listAdminProducts(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function getAdminProduct(client: CBrainSupabaseClient, id: string) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  return unwrapSupabaseData(data, error);
}

export async function createProduct(
  client: CBrainSupabaseClient,
  input: TableInsert<"products">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("products")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updateProduct(
  client: CBrainSupabaseClient,
  id: string,
  input: TableUpdate<"products">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("products")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}
