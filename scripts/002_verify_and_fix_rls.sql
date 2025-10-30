-- First, drop existing policies to ensure clean slate
drop policy if exists "Users can view their own observations" on public.observations;
drop policy if exists "Users can insert their own observations" on public.observations;
drop policy if exists "Users can update their own observations" on public.observations;
drop policy if exists "Users can delete their own observations" on public.observations;

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

drop policy if exists "Users can view their own stats" on public.user_stats;
drop policy if exists "Users can insert their own stats" on public.user_stats;
drop policy if exists "Users can update their own stats" on public.user_stats;

-- Ensure RLS is enabled on all tables
alter table public.profiles enable row level security;
alter table public.observations enable row level security;
alter table public.user_stats enable row level security;

-- Recreate RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Recreate RLS policies for observations (CRITICAL - prevents data leaks)
create policy "Users can view their own observations"
  on public.observations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own observations"
  on public.observations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own observations"
  on public.observations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own observations"
  on public.observations for delete
  using (auth.uid() = user_id);

-- Recreate RLS policies for user_stats
create policy "Users can view their own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert their own stats"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own stats"
  on public.user_stats for update
  using (auth.uid() = user_id);
