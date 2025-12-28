-- Fix RLS for Goals
alter table public.goals enable row level security;
drop policy if exists "Users can view own goals" on goals;
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own goals" on goals;
create policy "Users can insert own goals" on goals for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own goals" on goals;
create policy "Users can update own goals" on goals for update using (auth.uid() = user_id);

-- Fix RLS for Confessions
alter table public.confessions enable row level security;
drop policy if exists "Users can view own confessions" on confessions;
create policy "Users can view own confessions" on confessions for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own confessions" on confessions;
create policy "Users can insert own confessions" on confessions for insert with check (auth.uid() = user_id);

-- Fix RLS for Daily Sparks (Read Only for users)
alter table public.daily_sparks enable row level security;
drop policy if exists "Everyone can view daily sparks" on daily_sparks;
create policy "Everyone can view daily sparks" on daily_sparks for select using (true);
