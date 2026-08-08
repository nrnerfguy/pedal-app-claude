import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// ── Setup (do this before anything below works) ─────────────────────────
// 1. Create a free project at https://supabase.com
// 2. Project Settings → API → copy the "Project URL" and "anon public" key
// 3. Create a file called `.env` in the project root (already git-ignored)
//    containing:
//      EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
//      EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
// 4. Run the SQL in supabase/schema.sql (Supabase dashboard → SQL Editor)
//    to create the `profiles` table with row-level security.
// 5. For Google sign-in, follow supabase/google-oauth-setup.md
//
// The anon key is safe to ship in the client — it only grants what your
// Row Level Security policies allow (see schema.sql). Never put your
// Supabase "service_role" key in this app; that one bypasses RLS entirely
// and belongs only on a server you control.

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// SecureStore-backed storage adapter: sessions are held in the device's
// encrypted keychain/keystore instead of plain AsyncStorage.
const SecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: SecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    '[Pedal] Supabase is not configured — running in local demo mode. ' +
      'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to a .env file. ' +
      'See src/services/supabase.js for setup steps.'
  );
}
