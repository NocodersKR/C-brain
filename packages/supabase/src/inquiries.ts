import { requireAdmin, requireUser } from "./auth.js";
import { unwrapSupabaseData } from "./result.js";
import type { CBrainSupabaseClient } from "./server.js";
import type { InquiryStatus, TableInsert, TableUpdate } from "./types.js";

export async function createInquiry(
  client: CBrainSupabaseClient,
  input: TableInsert<"inquiries">,
) {
  const { data, error } = await client
    .from("inquiries")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function listMyInquiries(client: CBrainSupabaseClient) {
  const user = await requireUser(client);

  const { data, error } = await client
    .from("inquiries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function listAdminInquiries(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("inquiries")
    .select("*, inquiry_attachments(*)")
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function updateInquiry(
  client: CBrainSupabaseClient,
  id: string,
  input: TableUpdate<"inquiries">,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("inquiries")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updateInquiryStatus(
  client: CBrainSupabaseClient,
  id: string,
  status: InquiryStatus,
) {
  return updateInquiry(client, id, { status });
}
