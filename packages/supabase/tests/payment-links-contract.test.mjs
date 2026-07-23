import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";

const migrationUrl = new URL(
  "../../../supabase/migrations/20260722000000_create_payment_links.sql",
  import.meta.url,
);
const detailMigrationUrl = new URL(
  "../../../supabase/migrations/20260723000000_add_payment_link_details.sql",
  import.meta.url,
);
const orderMigrationUrl = new URL(
  "../../../supabase/migrations/20260723000001_create_payment_orders.sql",
  import.meta.url,
);
const deleteMigrationUrl = new URL(
  "../../../supabase/migrations/20260723000002_allow_admin_payment_link_delete.sql",
  import.meta.url,
);
const typesUrl = new URL("../src/types.ts", import.meta.url);

test("payment links migration defines the minimal admin contract", async () => {
  const [migration, types] = await Promise.all([
    readFile(migrationUrl, "utf8"),
    readFile(typesUrl, "utf8"),
  ]);

  for (const field of [
    "payment_link_status",
    "payment_links",
    "public_token",
    "client_name",
    "payment_name",
    "amount",
    "status",
  ]) {
    assert.match(migration, new RegExp(`\\b${field}\\b`));
    assert.match(types, new RegExp(`\\b${field}\\b`));
  }

  assert.match(migration, /check \(amount between 1 and 999999999999\)/);
  assert.match(
    migration,
    /alter table public\.payment_links enable row level security/,
  );
  assert.match(migration, /create policy "admins select payment links"/);
  assert.match(migration, /create policy "admins insert payment links"/);
  assert.match(migration, /create policy "admins update payment links"/);
  assert.match(
    migration,
    /revoke insert, update on public\.payment_links from authenticated;/,
  );
  assert.match(
    migration,
    /grant select on public\.payment_links to authenticated;/,
  );
  assert.match(
    migration,
    /grant insert \(client_name, payment_name, amount\)\s+on public\.payment_links to authenticated;/,
  );
  assert.match(
    migration,
    /grant update \(client_name, payment_name, amount\)\s+on public\.payment_links to authenticated;/,
  );
  assert.match(
    migration,
    /grant all on public\.payment_links to service_role;/,
  );
  assert.doesNotMatch(
    migration,
    /grant (?:insert|update) on public\.payment_links to authenticated;/,
  );
  assert.doesNotMatch(migration, /anon/);
  assert.doesNotMatch(migration, /delete payment links/);
  assert.match(types, /payment_link_status: "pending" \| "paid"/);
});

test("payment link detail migration adds the Figma fields and write grants", async () => {
  const [migration, types] = await Promise.all([
    readFile(detailMigrationUrl, "utf8"),
    readFile(typesUrl, "utf8"),
  ]);

  for (const field of ["category", "service", "paper", "page_quantity"]) {
    assert.match(migration, new RegExp(`add column ${field} text not null`));
    assert.match(types, new RegExp(`${field}: string;`));
  }

  assert.match(
    migration,
    /grant insert \(category, service, paper, page_quantity\)/,
  );
  assert.match(
    migration,
    /grant update \(category, service, paper, page_quantity\)/,
  );
});

test("payment link deletion stays admin-only and preserves started orders", async () => {
  const [migration, orderMigration] = await Promise.all([
    readFile(deleteMigrationUrl, "utf8"),
    readFile(orderMigrationUrl, "utf8"),
  ]);

  assert.match(migration, /create policy "admins delete payment links"/);
  assert.match(
    migration,
    /grant delete on public\.payment_links to authenticated/,
  );
  assert.match(orderMigration, /on delete restrict/);
  assert.doesNotMatch(migration, /to anon/);
});

test("payment order migration keeps NICEPAY writes server-only and atomic", async () => {
  const [migration, types] = await Promise.all([
    readFile(orderMigrationUrl, "utf8"),
    readFile(typesUrl, "utf8"),
  ]);

  for (const field of [
    "payment_orders",
    "payment_link_id",
    "order_id",
    "nicepay_tid",
    "provider_status",
  ]) {
    assert.match(migration, new RegExp(`\\b${field}\\b`));
    assert.match(types, new RegExp(`\\b${field}\\b`));
  }

  assert.match(
    migration,
    /alter table public\.payment_orders enable row level security/,
  );
  assert.match(
    migration,
    /revoke all on public\.payment_orders from anon, authenticated/,
  );
  assert.match(
    migration,
    /grant all on public\.payment_orders to service_role/,
  );
  assert.match(
    migration,
    /create function public\.get_or_create_payment_order\(p_public_token uuid\)/,
  );
  assert.match(migration, /create function public\.complete_payment_order\(/);
  assert.match(migration, /create trigger payment_links_prevent_locked_update/);
  assert.match(migration, /payment_orders_enforce_status_transition/);
  assert.match(
    migration,
    /old\.provider_status = 'paid'[\s\S]*'cancelled'[\s\S]*'partialCancelled'/,
  );
  assert.match(
    migration,
    /grant execute on function public\.get_or_create_payment_order\(uuid\) to service_role/,
  );
  assert.match(
    migration,
    /grant execute on function public\.complete_payment_order\([\s\S]+?\) to service_role/,
  );
  assert.doesNotMatch(
    migration,
    /grant (?:all|insert|update|delete|execute)[\s\S]*?to (?:anon|authenticated)/,
  );
  assert.match(types, /get_or_create_payment_order:/);
  assert.match(types, /complete_payment_order:/);
});
