// src/supabase.client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vrjeaqcpjjqotxntpatt.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log(supabaseUrl, supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

let supabaseInstance = null;

function getSupabase() {
  if (supabaseInstance === null) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return supabaseInstance;
}

// Export the supabase instance
export const supabase = getSupabase();

// You can also export the getSupabase function if needed
export { getSupabase };

// Default export
export default supabase;