-- WARNING: This will delete ALL data from observations, profiles, and user_stats tables
-- Only run this if you want to completely reset the database for testing

-- Delete all observations
DELETE FROM public.observations;

-- Delete all user stats
DELETE FROM public.user_stats;

-- Delete all profiles (this will cascade delete auth users)
DELETE FROM public.profiles;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('observations', 'profiles', 'user_stats');

-- Verify policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('observations', 'profiles', 'user_stats');
