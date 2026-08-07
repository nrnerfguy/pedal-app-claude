import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { setProfile, setAuthed } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [error, setError] = useState('');

  // NOTE: this is a local, offline auth stand-in so the app is fully clickable
  // without a live backend. Wire this to Supabase Auth (email/password or OAuth)
  // before launch — see src/services/supabase.js for the client stub.
  const handleSubmit = () => {
    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }
    setError('');
    setProfile((p) => ({ ...p, name: name || p.name || email.split('@')[0], email }));
    setAuthed(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoRow}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.brand}>Pedal</Text>
        </View>
        <Text style={styles.tagline}>Neighborhood errands, delivered by bike.</Text>

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

          <PrimaryButton title={mode === 'signin' ? 'Sign in' : 'Create account'} onPress={handleSubmit} />
        </View>

        <Text style={styles.disclaimer}>
          Demo build — authentication is stored on-device only until connected to a real backend.
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
  tagline: { textAlign: 'center', color: colors.brandGreenDeep, fontSize: 15, marginBottom: spacing(6), fontWeight: '500' },
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
  disclaimer: { textAlign: 'center', color: colors.brandGreenDeep, opacity: 0.8, fontSize: 12, marginTop: spacing(5) },
});
