import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

// Standard Supabase + Expo Google sign-in flow:
// 1. Ask Supabase for the Google OAuth URL (Supabase talks to Google, not us)
// 2. Open it in a secure in-app browser tab
// 3. Google redirects back to our app's own URL scheme with a session code
// 4. Supabase exchanges that code for a real session behind the scenes
//
// IMPORTANT — testing environments this does and doesn't work in:
// - Real device via Expo Go / a dev build: works, using the redirect URI below
// - Local `expo start --web`: works, using your localhost URL as the redirect
// - Expo Snack: OAuth redirects are commonly unreliable in Snack's browser
//   preview because the redirect URI can't be fixed in advance. Test Google
//   sign-in on a real device or the deployed web build, not inside Snack.
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured yet — see src/services/supabase.js');
  }

  const redirectTo = Linking.createURL('auth-callback');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'success' && result.url) {
    // Extract the auth code/tokens Supabase appended to the redirect URL
    // and finish establishing the session.
    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
    }
  } else if (result.type === 'cancel') {
    throw new Error('Google sign-in was cancelled.');
  }
}
