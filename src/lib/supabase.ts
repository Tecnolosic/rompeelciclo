import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://slaxvavhcsckfznawpzo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ALBYTHv7KIUia1-QdXk2kA_K3iLQv6I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
