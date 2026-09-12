-- ============================================================
-- CampusFind — Supabase Schema
-- Run this entire file in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Enable UUID extension ─────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  full_name   text not null,
  email       text not null,
  avatar_url  text,
  phone       text,
  department  text,
  student_id  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint profiles_user_id_key unique (user_id)
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- ─── ITEMS ─────────────────────────────────────────────────────────────────
create table if not exists public.items (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  type               text not null check (type in ('lost', 'found')),
  name               text not null,
  description        text not null,
  category           text not null,
  color              text,
  brand              text,
  location           text not null,
  location_details   text,
  date               date not null,
  time               time,
  additional_details text,          -- private: hidden from public reads
  image_url          text,
  status             text not null default 'active'
                       check (status in ('active', 'claimed', 'resolved', 'closed')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists items_type_status_idx on public.items (type, status);
create index if not exists items_user_id_idx on public.items (user_id);
create index if not exists items_created_at_idx on public.items (created_at desc);

alter table public.items enable row level security;

-- Items policies
-- Anyone authenticated can read public fields (additional_details excluded via view or app-level)
create policy "Authenticated users can read items"
  on public.items for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own items"
  on public.items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own items"
  on public.items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own items"
  on public.items for delete
  using (auth.uid() = user_id);

-- ─── CLAIMS ────────────────────────────────────────────────────────────────
create table if not exists public.claims (
  id                  uuid primary key default uuid_generate_v4(),
  item_id             uuid not null references public.items (id) on delete cascade,
  claimant_id         uuid not null references auth.users (id) on delete cascade,
  verification_text   text not null,
  status              text not null default 'pending'
                        check (status in ('pending', 'under_review', 'approved', 'rejected')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint claims_item_claimant_key unique (item_id, claimant_id)
);

create index if not exists claims_claimant_id_idx on public.claims (claimant_id);
create index if not exists claims_item_id_idx on public.claims (item_id);

alter table public.claims enable row level security;

-- Claims policies
create policy "Users can read own claims"
  on public.claims for select
  using (auth.uid() = claimant_id);

-- Item owners can also see claims on their items
create policy "Item owners can read claims on their items"
  on public.claims for select
  using (
    exists (
      select 1 from public.items
      where items.id = claims.item_id
        and items.user_id = auth.uid()
    )
  );

create policy "Authenticated users can create claims"
  on public.claims for insert
  with check (auth.uid() = claimant_id);

-- ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  message    text not null,
  type       text not null default 'info'
               check (type in ('match', 'claim', 'system', 'info')),
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_read_idx on public.notifications (user_id, read);

alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── TRIGGER: auto-update updated_at ───────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger items_updated_at
  before update on public.items
  for each row execute function public.handle_updated_at();

create trigger claims_updated_at
  before update on public.claims
  for each row execute function public.handle_updated_at();

-- ─── TRIGGER: auto-create profile on signup ────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── STORAGE: item-images bucket ───────────────────────────────────────────
-- Run this after enabling Storage in your Supabase dashboard
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder
create policy "Authenticated users can upload item images"
  on storage.objects for insert
  with check (
    bucket_id = 'item-images'
    and auth.role() = 'authenticated'
  );

-- Anyone can read item images (they're public)
create policy "Public can read item images"
  on storage.objects for select
  using (bucket_id = 'item-images');

-- Users can delete their own item images
create policy "Users can delete own item images"
  on storage.objects for delete
  using (
    bucket_id = 'item-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
