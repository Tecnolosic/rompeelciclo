-- Add is_verified column to profiles table to track purchase/license status
alter table public.profiles 
add column if not exists is_verified boolean default false;

-- Create a policy to allow users to update their own verification status (if not already covered by update policy)
-- Note: Existing policy "Users can update own profile" should cover this as long as it allows updating the whole row.
