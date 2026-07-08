import { requireAdmin } from "./auth.js";
import { assertSupabaseSuccess, unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { TableInsert, TableUpdate } from "./types.js";

export async function listPublishedPortfolioItems(
  client: CBrainSupabaseClient,
) {
  const { data, error } = await client
    .from("portfolio_items")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function getPublishedPortfolioItem(
  client: CBrainSupabaseClient,
  slug: string,
) {
  const { data, error } = await client
    .from("portfolio_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function listAdminPortfolioItems(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function createPortfolioItem(
  client: CBrainSupabaseClient,
  input: TableInsert<"portfolio_items">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("portfolio_items")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updatePortfolioItem(
  client: CBrainSupabaseClient,
  id: string,
  input: TableUpdate<"portfolio_items">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("portfolio_items")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function deletePortfolioItem(
  client: CBrainSupabaseClient,
  id: string,
) {
  await requireAdmin(client);

  const { error } = await client.from("portfolio_items").delete().eq("id", id);

  assertSupabaseSuccess(error);
}
