-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Ensure profiles table exists (should be there from previous migrations, but safe to check)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  profession text,
  dob date,
  north_star text,
  current_identity text,
  new_identity text,
  xp bigint default 0,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(name) >= 3)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a trigger to automatically create a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, xp, updated_at)
  values (new.id, new.raw_user_meta_data->>'name', 0, now());
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Also ensure pillar_progress RLS
alter table public.pillar_progress enable row level security;

create policy "Users can view own pillar progress"
  on pillar_progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert own pillar progress"
  on pillar_progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own pillar progress"
  on pillar_progress for update
  using ( auth.uid() = user_id );
