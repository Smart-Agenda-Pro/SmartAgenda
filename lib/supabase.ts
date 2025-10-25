import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://icseawozzuwkkicsmqnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc2Vhd296enV3a2tpY3NtcW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzE2ODgsImV4cCI6MjA3NjY0NzY4OH0.0UigLPIMLkMy4mThqxSu5tRpUtKDa9u12jj2ra9jV68';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
