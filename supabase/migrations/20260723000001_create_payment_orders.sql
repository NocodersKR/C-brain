begin;

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  payment_link_id uuid not null unique
    references public.payment_links(id) on delete restrict,
  order_id text not null unique
    check (
      char_length(order_id) between 1 and 64
      and order_id ~ '^[A-Za-z0-9_-]+$'
    ),
  amount bigint not null check (amount between 1 and 999999999999),
  nicepay_tid text unique
    check (nicepay_tid is null or char_length(nicepay_tid) between 1 and 30),
  provider_status text not null default 'ready'
    check (
      provider_status in (
        'ready',
        'paid',
        'failed',
        'cancelled',
        'partialCancelled',
        'expired'
      )
    ),
  result_code text,
  result_message text,
  pay_method text,
  receipt_url text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index payment_orders_created_at_desc_idx
on public.payment_orders (created_at desc);

create function public.set_payment_orders_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger payment_orders_set_updated_at
before update on public.payment_orders
for each row
execute function public.set_payment_orders_updated_at();

create function public.enforce_payment_order_status_transition()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.provider_status = 'paid'
    and new.provider_status not in ('paid', 'cancelled', 'partialCancelled') then
    raise exception 'A paid order can only transition to a cancellation state.';
  end if;

  if old.provider_status = 'partialCancelled'
    and new.provider_status not in ('partialCancelled', 'cancelled') then
    raise exception 'A partially cancelled order can only become fully cancelled.';
  end if;

  if old.provider_status in ('cancelled', 'expired')
    and new.provider_status <> old.provider_status then
    raise exception 'A terminal payment order cannot change status.';
  end if;

  return new;
end;
$$;

create trigger payment_orders_enforce_status_transition
before update of provider_status on public.payment_orders
for each row
execute function public.enforce_payment_order_status_transition();

create function public.prevent_locked_payment_link_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (
    new.client_name,
    new.payment_name,
    new.amount,
    new.category,
    new.service,
    new.paper,
    new.page_quantity
  ) is distinct from (
    old.client_name,
    old.payment_name,
    old.amount,
    old.category,
    old.service,
    old.paper,
    old.page_quantity
  ) and exists (
    select 1
    from public.payment_orders
    where payment_orders.payment_link_id = old.id
  ) then
    raise exception 'A payment link cannot be edited after checkout starts.';
  end if;

  return new;
end;
$$;

create trigger payment_links_prevent_locked_update
before update on public.payment_links
for each row
execute function public.prevent_locked_payment_link_update();

alter table public.payment_orders enable row level security;

revoke all on public.payment_orders from anon, authenticated;
grant all on public.payment_orders to service_role;

create function public.get_or_create_payment_order(p_public_token uuid)
returns public.payment_orders
language plpgsql
security invoker
set search_path = public
as $$
declare
  payment_link public.payment_links%rowtype;
  payment_order public.payment_orders%rowtype;
begin
  select *
  into payment_link
  from public.payment_links
  where public_token = p_public_token
  for share;

  if not found then
    raise exception 'Payment link not found.';
  end if;

  if payment_link.status <> 'pending' then
    raise exception 'Payment link is not payable.';
  end if;

  insert into public.payment_orders (payment_link_id, order_id, amount)
  values (
    payment_link.id,
    'LP' || replace(payment_link.id::text, '-', ''),
    payment_link.amount
  )
  on conflict (payment_link_id) do nothing;

  select *
  into strict payment_order
  from public.payment_orders
  where payment_link_id = payment_link.id;

  if payment_order.amount <> payment_link.amount then
    raise exception 'Payment amount does not match the locked order.';
  end if;

  return payment_order;
end;
$$;

create function public.complete_payment_order(
  p_order_id text,
  p_amount bigint,
  p_nicepay_tid text,
  p_result_code text,
  p_result_message text,
  p_pay_method text,
  p_receipt_url text,
  p_paid_at timestamptz
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  payment_order public.payment_orders%rowtype;
begin
  select *
  into payment_order
  from public.payment_orders
  where order_id = p_order_id
  for update;

  if not found then
    raise exception 'Payment order not found.';
  end if;

  if payment_order.amount <> p_amount then
    raise exception 'Payment amount mismatch.';
  end if;

  if p_result_code <> '0000'
    or p_nicepay_tid is null
    or char_length(p_nicepay_tid) = 0
    or p_paid_at is null then
    raise exception 'Invalid successful payment result.';
  end if;

  if payment_order.provider_status = 'paid' then
    if payment_order.nicepay_tid is distinct from p_nicepay_tid then
      raise exception 'Payment order was completed with another transaction.';
    end if;

    return;
  end if;

  if payment_order.provider_status not in ('ready', 'failed') then
    raise exception 'Payment order cannot transition to paid.';
  end if;

  update public.payment_orders
  set
    nicepay_tid = p_nicepay_tid,
    provider_status = 'paid',
    result_code = p_result_code,
    result_message = p_result_message,
    pay_method = p_pay_method,
    receipt_url = p_receipt_url,
    paid_at = p_paid_at
  where id = payment_order.id;

  update public.payment_links
  set status = 'paid'
  where id = payment_order.payment_link_id;
end;
$$;

revoke all on function public.get_or_create_payment_order(uuid) from public;
revoke all on function public.complete_payment_order(
  text,
  bigint,
  text,
  text,
  text,
  text,
  text,
  timestamptz
) from public;

grant execute on function public.get_or_create_payment_order(uuid) to service_role;
grant execute on function public.complete_payment_order(
  text,
  bigint,
  text,
  text,
  text,
  text,
  text,
  timestamptz
) to service_role;

commit;
