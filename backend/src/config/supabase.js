import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only create Supabase client if credentials are provided
let supabase = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✅ Supabase client initialized');
} else {
  console.warn(
    '⚠️  Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
  );
  console.warn(
    '⚠️  Server will start but database operations will fail until configured.'
  );
}

export { supabase };

// Test connection (optional)
export const testSupabaseConnection = async () => {
  if (!supabase) {
    console.warn('⚠️  Skipping Supabase connection test (not configured)');
    return;
  }

  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist yet (expected before migration)
      console.warn('⚠️  Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.warn('⚠️  Supabase connection test error:', err.message);
  }
};
