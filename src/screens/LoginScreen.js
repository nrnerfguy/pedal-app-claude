import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { signInWithGoogle } from '../services/googleAuth';

export default function LoginScreen() {
  const { setAuthed, setProfile, profile } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = () => {
    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.');
      return false;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name to create an account.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validate()) return;

    if (!isSupabaseConfigured) {
      // Local demo mode — no backend configured yet. Everything still
      // works for clicking through the app; it just won't persist to a
      // real account until Supabase is set up (see src/services/supabase.js).
      setProfile({ ...profile, name: name || email.split('@')[0] });
      setAuthed(true);
      return;
    }

    setLoading(true);
    const { error: authError } =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
        : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    if (mode === 'signup') {
      setError('Check your email to confirm your account, then sign in.');
      setMode('signin');
    }
    // On success, AppContext's onAuthStateChange listener picks up the
    // session automatically — nothing else to do here.
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      setError('Google sign-in needs a configured Supabase project — see supabase/google-oauth-setup.md');
      return;
    }
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e.message || 'Google sign-in failed.');
    }
    setGoogleLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoRow}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.brand}>Pedal</Text>
        </View>
        <Text style={styles.tagline}>Neighborhood errands, delivered by bike.</Text>

        {!isSupabaseConfigured && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>
              Demo mode — Supabase isn't connected yet, so sign-in won't save to a real
              account. See src/services/supabase.js to connect it.
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.switchRow}>
            <Text onPress={() => setMode('signin')} style={[styles.switchItem, mode === 'signin' && styles.switchActive]}>Sign in</Text>
            <Text onPress={() => setMode('signup')} style={[styles.switchItem, mode === 'signup' && styles.switchActive]}>Create account</Text>
          </View>

          {mode === 'signup' && (
            <TextInput
              placeholder="Full name"
              placeholderTextColor={colors.inkMuted}
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
            />
          )}
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.inkMuted}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.inkMuted}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          {!!error && <Text style={styles.error}>{error}</Text>}

          <PrimaryButton title={mode === 'signin' ? 'Sign in' : 'Create account'} onPress={handleSubmit} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.googleBtn} onPress={handleGoogle} disabled={googleLoading}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>{googleLoading ? 'Opening Google…' : 'Continue with Google'}</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          {isSupabaseConfigured
            ? 'Your data is saved securely to your account.'
            : 'Demo build — connect Supabase to enable real accounts.'}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.brandGreen, padding: spacing(6), justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing(2) },
  logo: { width: 56, height: 56, borderRadius: radii.sm, marginRight: 10 },
  brand: { fontSize: 32, fontWeight: '800', color: colors.brandGreenDeep },
  tagline: { textAlign: 'center', color: colors.brandGreenDeep, fontSize: 15, marginBottom: spacing(4), fontWeight: '500' },
  demoBanner: { backgroundColor: '#FFF3D6', borderRadius: radii.sm, padding: spacing(3), marginBottom: spacing(4) },
  demoBannerText: { color: '#8A5A00', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  form: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing(5) },
  switchRow: { flexDirection: 'row', marginBottom: spacing(4), gap: spacing(4) },
  switchItem: { fontSize: 15, color: colors.inkMuted, fontWeight: '600', paddingBottom: 6 },
  switchActive: { color: colors.brandGreenDeep, borderBottomWidth: 2, borderBottomColor: colors.brandGreenDeep },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(3),
    paddingVertical: 12,
    marginBottom: spacing(3),
    fontSize: 15,
    color: colors.ink,
  },
  error: { color: colors.danger, marginBottom: spacing(3), fontSize: 13 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing(4), gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.inkMuted, fontSize: 12 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 13,
    gap: 10,
  },
  googleG: { fontWeight: '800', color: '#4285F4', fontSize: 16 },
  googleText: { fontWeight: '700', color: colors.ink, fontSize: 14.5 },
  disclaimer: { textAlign: 'center', color: colors.brandGreenDeep, opacity: 0.8, fontSize: 12, marginTop: spacing(5) },
});
