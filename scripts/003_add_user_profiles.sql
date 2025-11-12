-- Add name and age columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS age integer;

-- Update existing profiles to have a default name if needed
UPDATE public.profiles
SET name = COALESCE(name, 'User')
WHERE name IS NULL;
