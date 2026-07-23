begin;

create policy "admins delete payment links"
on public.payment_links
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

grant delete on public.payment_links to authenticated;

commit;
