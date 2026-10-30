-- Review against the restored project's schema and take a backup before applying.
-- Existing records are retained. Install only after configuring a site admin below.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.site_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create or replace function public.is_site_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from private.site_admins where user_id = auth.uid()) $$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;
-- Replace existing policies, including permissive policies that would override these.
do $$ declare p record; begin
  for p in select schemaname,tablename,policyname from pg_policies where schemaname='public' and tablename in ('contacts','messages','memories','souvenirs','orders','site_settings') loop
    execute format('drop policy %I on %I.%I',p.policyname,p.schemaname,p.tablename);
  end loop;
end $$;
do $$ declare t text; begin
  foreach t in array array['contacts','messages','memories','souvenirs','orders','site_settings'] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security',t);
      execute format('create policy admin_all on public.%I for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin())',t);
    end if;
  end loop;
end $$;
-- Revoke broad default grants including TRUNCATE (which RLS does not cover),
-- then grant only the operations used by the application. RLS still governs rows.
revoke all on public.contacts, public.messages, public.memories, public.souvenirs, public.orders, public.site_settings from anon, authenticated, public;
grant select on public.messages, public.memories, public.souvenirs to anon, authenticated;
grant select(id, created_at, name, role, email, social) on public.contacts to anon, authenticated;
grant insert, update, delete on public.contacts, public.messages, public.memories, public.souvenirs, public.orders to authenticated;
grant select on public.orders to authenticated;
create policy public_read_contacts on public.contacts for select to anon, authenticated using (true);
create policy public_read_messages on public.messages for select to anon, authenticated using (not coalesce(is_hidden, false));
create policy public_read_memories on public.memories for select to anon, authenticated using (true);
create policy public_read_souvenirs on public.souvenirs for select to anon, authenticated using (true);
alter table public.orders add column if not exists shipping_address text;
alter table public.orders add column if not exists lookup_hash text unique;
alter table public.souvenirs add column if not exists name_en text;
alter table public.souvenirs add column if not exists name_zh_cn text;
alter table public.souvenirs add column if not exists name_zh_tw text;
alter table public.souvenirs add column if not exists description_en text;
alter table public.souvenirs add column if not exists description_zh_cn text;
alter table public.souvenirs add column if not exists description_zh_tw text;
-- Before production rollout, add only the verified administrator's Auth user ID:
-- insert into private.site_admins(user_id) values ('<auth-user-id>') on conflict do nothing;
-- Run after confirming Storage is enabled. Only admins can upload; public reads
-- apply solely to intentionally published site imagery in this bucket.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('site-images','site-images',true,8388608,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;
drop policy if exists site_images_admin_insert on storage.objects;
drop policy if exists site_images_admin_update on storage.objects;
drop policy if exists site_images_admin_delete on storage.objects;
drop policy if exists site_images_public_read on storage.objects;
create policy site_images_admin_insert on storage.objects for insert to authenticated with check (bucket_id='site-images' and public.is_site_admin());
create policy site_images_admin_update on storage.objects for update to authenticated using (bucket_id='site-images' and public.is_site_admin()) with check (bucket_id='site-images' and public.is_site_admin());
create policy site_images_admin_delete on storage.objects for delete to authenticated using (bucket_id='site-images' and public.is_site_admin());
create policy site_images_public_read on storage.objects for select to anon, authenticated using (bucket_id='site-images');

commit;
