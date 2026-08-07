// Supabase client stub.
//
// The app currently runs on local device state (see src/context/AppContext.js)
// so every screen is fully clickable without any backend configured. To make
// Pedal a real, multi-user service, wire this file in and swap the local
// state calls (setAuthed, setActiveOrder, etc.) for calls into this client.
//
// Setup:
//   1. npm install @supabase/supabase-js
//   2. Create a project at https://supabase.com
//   3. Add your URL + anon key below (use environment variables, not
//      hardcoded strings, before this ever ships to real users)
//   4. Recommended tables: profiles, stores, items, orders, order_items, runs
//   5. Use Supabase Realtime on `orders` and `runs` so the rider feed and
//      Sender's order tracker update live instead of from mock data.
//
// import { createClient } from '@supabase/supabase-js';
//
// const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
//
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabase = null; // replace with the real client once configured
