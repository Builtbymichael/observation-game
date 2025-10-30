-- Create profiles table that references auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create observations table (game entries)
create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  correct_answer text not null,
  submitted_answer text,
  set_date date not null,
  due_date date not null,
  answered_date date,
  status text not null check (status in ('PENDING', 'DUE', 'ANSWERED_CORRECT', 'ANSWERED_INCORRECT')),
  delay_days integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.observations enable row level security;

-- RLS policies for observations
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

-- Create user_stats table
create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  has_onboarded boolean default false not null,
  unlocked_achievements text[] default '{}' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.user_stats enable row level security;

-- RLS policies for user_stats
create policy "Users can view their own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert their own stats"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own stats"
  on public.user_stats for update
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists observations_user_id_idx on public.observations(user_id);
create index if not exists observations_due_date_idx on public.observations(due_date);
create index if not exists observations_status_idx on public.observations(status);
