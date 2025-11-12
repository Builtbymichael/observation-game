-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, age)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    (new.raw_user_meta_data->>'age')::integer
  );
  
  insert into public.user_stats (user_id)
  values (new.id);
  
  return new;
end;
$$;

-- Trigger to automatically create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
