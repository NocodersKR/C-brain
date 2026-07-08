import { requireAdmin } from "./auth.js";
import { assertSupabaseSuccess, unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { TableInsert, TableUpdate } from "./types.js";

export async function listPublishedPosts(client: CBrainSupabaseClient) {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function getPublishedPost(
  client: CBrainSupabaseClient,
  slug: string,
) {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function listAdminPosts(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function createPost(
  client: CBrainSupabaseClient,
  input: TableInsert<"posts">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("posts")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updatePost(
  client: CBrainSupabaseClient,
  id: string,
  input: TableUpdate<"posts">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("posts")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function deletePost(client: CBrainSupabaseClient, id: string) {
  await requireAdmin(client);

  const { error } = await client.from("posts").delete().eq("id", id);

  assertSupabaseSuccess(error);
}
