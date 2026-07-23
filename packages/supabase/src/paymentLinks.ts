import { requireAdmin } from "./auth.ts";
import { assertSupabaseSuccess, unwrapSupabaseData } from "./result.ts";
import type { CBrainSupabaseClient } from "./server.ts";
import type { PaymentOrderStatus, TableInsert, TableUpdate } from "./types.ts";

type PaymentLinkInput = Pick<
  TableInsert<"payment_links">,
  | "amount"
  | "category"
  | "client_name"
  | "page_quantity"
  | "paper"
  | "payment_name"
  | "service"
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
    | "amount"
    | "category"
    | "client_name"
    | "page_quantity"
    | "paper"
    | "payment_name"
    | "service"
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

export async function deletePaymentLink(
  client: CBrainSupabaseClient,
  id: string,
) {
  await requireAdmin(client);

  const { error } = await client.from("payment_links").delete().eq("id", id);

  assertSupabaseSuccess(error);
}

export async function getPublicPaymentLink(
  client: CBrainSupabaseClient,
  publicToken: string,
) {
  const { data, error } = await client
    .from("payment_links")
    .select("*")
    .eq("public_token", publicToken)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPaymentOrderByLinkId(
  client: CBrainSupabaseClient,
  paymentLinkId: string,
) {
  const { data, error } = await client
    .from("payment_orders")
    .select("*")
    .eq("payment_link_id", paymentLinkId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPaymentOrderByOrderId(
  client: CBrainSupabaseClient,
  orderId: string,
) {
  const { data, error } = await client
    .from("payment_orders")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrCreatePaymentOrder(
  client: CBrainSupabaseClient,
  publicToken: string,
) {
  const { data, error } = await client
    .rpc("get_or_create_payment_order", { p_public_token: publicToken })
    .single();

  return unwrapSupabaseData(data, error);
}

type CompletePaymentOrderInput = {
  amount: number;
  nicepayTid: string;
  orderId: string;
  paidAt: string;
  payMethod: string | null;
  receiptUrl: string | null;
  resultCode: string;
  resultMessage: string;
};

export async function completePaymentOrder(
  client: CBrainSupabaseClient,
  input: CompletePaymentOrderInput,
) {
  const { error } = await client.rpc("complete_payment_order", {
    p_amount: input.amount,
    p_nicepay_tid: input.nicepayTid,
    p_order_id: input.orderId,
    p_paid_at: input.paidAt,
    p_pay_method: input.payMethod,
    p_receipt_url: input.receiptUrl,
    p_result_code: input.resultCode,
    p_result_message: input.resultMessage,
  });

  assertSupabaseSuccess(error);
}

export async function updatePaymentOrder(
  client: CBrainSupabaseClient,
  orderId: string,
  input: Omit<
    Pick<
      TableUpdate<"payment_orders">,
      | "cancelled_at"
      | "nicepay_tid"
      | "provider_status"
      | "result_code"
      | "result_message"
    >,
    "provider_status"
  > & {
    provider_status?: Exclude<PaymentOrderStatus, "paid">;
  },
) {
  const { data, error } = await client
    .from("payment_orders")
    .update(input)
    .eq("order_id", orderId)
    .select("*")
    .single();

  return unwrapSupabaseData(data, error);
}
