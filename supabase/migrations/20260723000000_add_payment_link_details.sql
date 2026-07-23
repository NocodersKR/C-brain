begin;

alter table public.payment_links
  add column category text not null default '미입력'
    check (char_length(trim(category)) > 0),
  add column service text not null default '미입력'
    check (char_length(trim(service)) > 0),
  add column paper text not null default '미입력'
    check (char_length(trim(paper)) > 0),
  add column page_quantity text not null default '미입력'
    check (char_length(trim(page_quantity)) > 0);

alter table public.payment_links
  alter column category drop default,
  alter column service drop default,
  alter column paper drop default,
  alter column page_quantity drop default;

grant insert (category, service, paper, page_quantity)
on public.payment_links to authenticated;

grant update (category, service, paper, page_quantity)
on public.payment_links to authenticated;

commit;
