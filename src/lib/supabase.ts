import { createClient } from '@supabase/supabase-js';

// Provide fallback values so the app doesn't crash if environment variables are missing.
// In a real environment, these should be set in the .env file or deployment settings.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
