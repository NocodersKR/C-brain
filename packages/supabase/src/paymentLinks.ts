import { requireAdmin } from "./auth.ts";
import { unwrapSupabaseData } from "./result.ts";
import type { CBrainSupabaseClient } from "./server.ts";
import type { TableInsert, TableUpdate } from "./types.ts";

type PaymentLinkInput = Pick<
  TableInsert<"payment_links">,
  "amount" | "client_name" | "payment_name"
>;

export async function listAdminPaymentLinks(client: CBrainSupabaseClient) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .select("*")
    .order("created_at", { ascending: false });

  return unwrapSupabaseData(data, error);
}

export async function getAdminPaymentLink(
  client: CBrainSupabaseClient,
  id: string,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .select("*")
    .eq("id", id)
    .single();

  return unwrapSupabaseData(data, error);
}

export async function createPaymentLink(
  client: CBrainSupabaseClient,
  input: PaymentLinkInput,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}

export async function updatePaymentLink(
  client: CBrainSupabaseClient,
  id: string,
  input: Pick<
    TableUpdate<"payment_links">,
    "amount" | "client_name" | "payment_name"
  >,
) {
  await requireAdmin(client);

  const { data, error } = await client
    .from("payment_links")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}
