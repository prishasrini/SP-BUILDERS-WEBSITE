create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null check (char_length(name) between 2 and 100),
 email text not null check (char_length(email) <= 254),
 phone text not null check (char_length(phone) <= 24),
 project_type text not null,
 message text not null check (char_length(message) between 10 and 4000),
 consent boolean not null check (consent = true)
);
alter table public.enquiries enable row level security;
alter table public.enquiries add column if not exists email_status text not null default 'pending';
alter table public.enquiries add column if not exists whatsapp_status text not null default 'pending';
alter table public.enquiries add column if not exists email_provider_id text;
alter table public.enquiries add column if not exists whatsapp_provider_id text;
revoke all on public.enquiries from anon, authenticated;
create table if not exists public.enquiry_limits (key text primary key, window_start timestamptz not null default now(), count integer not null default 1);
alter table public.enquiry_limits enable row level security;
revoke all on public.enquiry_limits from anon, authenticated;
create or replace function public.allow_enquiry(client_key text) returns boolean language plpgsql security definer set search_path = public as $$
declare attempts integer;
begin
 insert into enquiry_limits(key) values(client_key)
 on conflict(key) do update set
 count = case when enquiry_limits.window_start < now() - interval '1 hour' then 1 else enquiry_limits.count+1 end,
 window_start = case when enquiry_limits.window_start < now() - interval '1 hour' then now() else enquiry_limits.window_start end
 returning count into attempts;
 return attempts <= 5;
end;
$$;
revoke all on function public.allow_enquiry(text) from public, anon, authenticated;
grant execute on function public.allow_enquiry(text) to service_role;
