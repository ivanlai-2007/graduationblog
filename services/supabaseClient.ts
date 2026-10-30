import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use the provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsblhtgprhjkugoqqdtg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYmxodGdwcmhqa3Vnb3FxZHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTA2ODIsImV4cCI6MjA4NjI2NjY4Mn0.-V3bI0L3sZIvqNq8zaqStowm-QcNqVNvrn9-6F3Md_k';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);