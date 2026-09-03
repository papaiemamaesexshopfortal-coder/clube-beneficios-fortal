create extension if not exists pgcrypto;

create sequence if not exists public.lucky_number_seq minvalue 1 start 1;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  cpf text not null,
  lucky_number bigint not null default nextval('public.lucky_number_seq'),
  terms_accepted_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(email),
  unique(cpf),
  unique(lucky_number)
);

alter table public.members enable row level security;

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  draw_date timestamptz not null,
  winner_member_id uuid references public.members(id),
  winner_lucky_number bigint,
  created_at timestamptz not null default now()
);

alter table public.draws enable row level security;

create or replace function public.pick_draw_winner(p_draw_id uuid)
returns public.draws
language plpgsql
security definer
set search_path = public
as $$
declare result_draw public.draws;
begin
  select * into result_draw from public.draws where id = p_draw_id for update;
  if result_draw.id is null then raise exception 'Sorteio não encontrado'; end if;
  if result_draw.winner_member_id is not null then return result_draw; end if;
  select m.id, m.lucky_number into result_draw.winner_member_id, result_draw.winner_lucky_number
  from public.members m order by random() limit 1;
  if result_draw.winner_member_id is null then raise exception 'Nenhum participante cadastrado'; end if;
  update public.draws set winner_member_id=result_draw.winner_member_id, winner_lucky_number=result_draw.winner_lucky_number where id=p_draw_id returning * into result_draw;
  return result_draw;
end;
$$;

create index if not exists members_created_at_idx on public.members(created_at desc);
create index if not exists draws_date_idx on public.draws(draw_date desc);
