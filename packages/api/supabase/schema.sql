-- =========================================================================
-- UB Platform 2.0 - Master Supabase PostgreSQL Schema & Security Policies
-- =========================================================================

-- 1. PROFILES TABLE (Dual Public User & Master Admin System)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Automated Trigger: Create Profile on auth.users Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_admin boolean;
  assigned_role text;
  raw_username text;
begin
  -- Automatically grant admin privileges to Ankit's verified email / handles
  is_admin := (
    new.email in ('upgraderboy@gmail.com', 'ankit@upgraderboy.com')
    or (new.raw_user_meta_data->>'username') = 'upgraderboy'
  );

  if is_admin then
    assigned_role := 'admin';
  else
    assigned_role := 'user';
  end if;

  raw_username := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, username, full_name, email, phone, avatar_url, role)
  values (
    new.id,
    raw_username,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', raw_username),
    new.email,
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    assigned_role
  )
  on conflict (id) do update set
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. LEADS TABLE (Inquiries from /contact Scope Estimator & Strategy Scheduler)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  scope_type text,
  budget_range text,
  timeline text,
  notes text,
  status text default 'new' check (status in ('new', 'in_review', 'contacted', 'closed', 'archived')),
  created_at timestamptz default now()
);

-- Enable RLS on Leads
alter table public.leads enable row level security;

-- Anyone can submit a lead inquiry
create policy "Anyone can submit a lead inquiry"
  on public.leads for insert
  with check (true);

-- Only Admins can view and update leads
create policy "Admins can view and manage leads"
  on public.leads for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 3. USER BOOKMARKS TABLE (Saved Study Resources & Blogs for logged-in students)
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_type text not null check (item_type in ('resource', 'blog', 'project')),
  item_id text not null,
  item_title text not null,
  item_url text not null,
  created_at timestamptz default now(),
  unique (user_id, item_type, item_id)
);

-- Enable RLS on Bookmarks
alter table public.bookmarks enable row level security;

create policy "Users can view and manage their own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id);
