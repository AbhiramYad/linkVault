import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials!');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Set' : 'MISSING');
  throw new Error('Missing Supabase credentials in environment variables');
}

// Admin client (server-side only)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Client for browser (created with anon key in frontend)
export const getSupabaseUrl = () => process.env.SUPABASE_URL;
export const getSupabaseAnonKey = () => process.env.SUPABASE_ANON_KEY;
