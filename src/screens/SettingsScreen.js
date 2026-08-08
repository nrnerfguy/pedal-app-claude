import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Switch, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors, radii, spacing, shadow } from '../theme/colors';
import { useApp } from '../context/AppContext';
import PrimaryButton from '../components/PrimaryButton';
import { supabase, isSupabaseConfigured } from '../services/supabase';

function SettingRow({ label, sub, value, onValueChange }) {
  return (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sub ? <Text style={styles.settingSub}>{sub}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.brandGreen, false: colors.border }} thumbColor={colors.brandGreenDeep} />
    </View>
  );
}

export default function SettingsScreen() {
  const { profile, setProfile, signOut, user } = useApp();
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.address);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Enable photo access in your device settings to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return;
    const localUri = result.assets[0].uri;

    // Local demo mode (no Supabase configured yet) — just keep it on-device.
    if (!isSupabaseConfigured || !user) {
      setProfile({ ...profile, avatarUri: localUri });
      return;
    }

    // Real mode — upload to the user's own folder in Supabase Storage
    // (RLS in supabase/schema.sql only allows writing inside <your-user-id>/...)
    // and save the public URL to their profile row.
    setUploadingAvatar(true);
    try {
      const response = await fetch(localUri);
      const blob = await response.blob();
      const ext = localUri.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      await setProfile({ ...profile, avatarUri: `${data.publicUrl}?t=${Date.now()}` });
    } catch (e) {
      Alert.alert('Upload failed', e.message || 'Could not upload your photo. Try again.');
    }
    setUploadingAvatar(false);
  };

  const useDeviceLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Enable location access to auto-fill your position.');
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({});
      setProfile({ ...profile, lat: pos.coords.latitude, lng: pos.coords.longitude, useAutoLocation: true });
      Alert.alert('Location updated', 'Using your device location for distance calculations.');
    } catch (e) {
      Alert.alert('Could not get location', 'Try entering your address manually instead.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await setProfile({ ...profile, name, address, useAutoLocation: profile.useAutoLocation });
    setSaving(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing(4), paddingBottom: spacing(10) }}>
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <Pressable onPress={pickAvatar} disabled={uploadingAvatar}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{(name || 'P')[0].toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>{uploadingAvatar ? '…' : 'Edit'}</Text>
            </View>
          </Pressable>
          <View style={{ flex: 1, marginLeft: spacing(4) }}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Your name" placeholderTextColor={colors.inkMuted} />
          </View>
        </View>
      </View>

      <Text style={styles.heading}>Location</Text>
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholder="Street address, city"
          placeholderTextColor={colors.inkMuted}
          multiline
        />
        <Text style={styles.helperText}>
          Used to calculate delivery distance. Automatic GPS location isn't always reliable indoors —
          set your address manually for the most accurate pricing.
        </Text>
        <PrimaryButton title="Use my current device location" variant="outline" onPress={useDeviceLocation} />
        {profile.useAutoLocation && <Text style={styles.locActive}>✓ Using live device location</Text>}
      </View>

      <Text style={styles.heading}>App settings</Text>
      <View style={styles.card}>
        <SettingRow label="Push notifications" sub="Order and run status updates" value={notifications} onValueChange={setNotifications} />
        <View style={styles.divider} />
        <SettingRow label="Dark mode" sub="Coming soon" value={darkMode} onValueChange={setDarkMode} />
      </View>

      <PrimaryButton title={saving ? 'Saving…' : 'Save changes'} onPress={handleSave} loading={saving} />
      <View style={{ height: spacing(3) }} />
      <PrimaryButton title="Sign out" variant="outline" onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceMuted },
  heading: { fontSize: 15, fontWeight: '800', color: colors.ink, marginBottom: spacing(2), marginTop: spacing(2) },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(4), marginBottom: spacing(5), borderWidth: 1, borderColor: colors.border, ...shadow },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: { backgroundColor: colors.brandGreen, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '800', color: colors.brandGreenDeep },
  avatarBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.brandGreenDeep, borderRadius: radii.pill, paddingHorizontal: 6, paddingVertical: 2 },
  avatarBadgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  fieldLabel: { fontSize: 12, color: colors.inkMuted, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.ink, marginBottom: spacing(2) },
  helperText: { fontSize: 11.5, color: colors.inkMuted, marginBottom: spacing(3), lineHeight: 16 },
  locActive: { fontSize: 12, color: colors.brandGreenDark, fontWeight: '700', marginTop: spacing(2), textAlign: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing(2) },
  settingLabel: { fontSize: 14, fontWeight: '600', color: colors.ink },
  settingSub: { fontSize: 11.5, color: colors.inkMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border },
});
