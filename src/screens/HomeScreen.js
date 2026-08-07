import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { colors, radii, spacing, shadow } from '../theme/colors';
import { useApp } from '../context/AppContext';
import ModeToggle from '../components/ModeToggle';

const STEPS = ['Matching', 'Rider en route', 'Picked up', 'Delivered'];

function ActiveOrderStrip({ order, navigation }) {
  if (!order) return null;
  const stepIndex = order.status ?? 0;
  return (
    <Pressable style={styles.activeCard} onPress={() => navigation.navigate('OrderTracking')}>
      <View style={styles.activeHeaderRow}>
        <Text style={styles.activeTitle}>Active order — {order.storeName}</Text>
        <Text style={styles.activePin}>PIN {order.pin}</Text>
      </View>
      <View style={styles.stepsRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= stepIndex && styles.stepDotActive]} />
            <Text style={[styles.stepLabel, i <= stepIndex && styles.stepLabelActive]} numberOfLines={1}>{s}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { mode, setMode, profile, activeOrder, riderOnline, riderEarningsToday } = useApp();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: spacing(10) }}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <View>
            <Text style={styles.brand}>Pedal</Text>
            <Text style={styles.brandSub}>Neighborhood delivery</Text>
          </View>
        </View>
        <ModeToggle mode={mode} onChange={setMode} />
      </View>

      {mode === 'sender' && <ActiveOrderStrip order={activeOrder} navigation={navigation} />}

      {mode === 'rider' && (
        <View style={styles.riderStatusCard}>
          <View>
            <Text style={styles.riderStatusLabel}>{riderOnline ? 'You are online' : 'You are offline'}</Text>
            <Text style={styles.riderEarnings}>${riderEarningsToday.toFixed(2)} earned today</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: riderOnline ? colors.brandGreenDark : colors.inkMuted }]} />
        </View>
      )}

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          {mode === 'sender' ? `Hey ${profile.name || 'there'}, what do you need today?` : 'Ready to ride?'}
        </Text>
        <Text style={styles.heroSubtitle}>
          {mode === 'sender'
            ? 'Send a local rider on a small errand — no cars, no chains.'
            : 'Browse nearby runs and pick one that fits your route.'}
        </Text>
        <Pressable
          style={styles.heroButton}
          onPress={() => navigation.navigate(mode === 'sender' ? 'Orders' : 'Feed')}
        >
          <Text style={styles.heroButtonText}>{mode === 'sender' ? 'Start an order' : 'View run board'}</Text>
        </Pressable>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>90%</Text>
          <Text style={styles.infoLabel}>of every delivery fee goes to your rider</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>0</Text>
          <Text style={styles.infoLabel}>emissions — every run is by bike</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceMuted, paddingHorizontal: spacing(4), paddingTop: spacing(4) },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing(4) },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 40, height: 40, borderRadius: radii.sm },
  brand: { fontSize: 18, fontWeight: '800', color: colors.brandGreenDeep },
  brandSub: { fontSize: 11, color: colors.inkMuted },

  activeCard: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(4), marginBottom: spacing(4), ...shadow },
  activeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing(3) },
  activeTitle: { fontWeight: '700', color: colors.ink, fontSize: 14 },
  activePin: { fontWeight: '800', color: colors.brandGreenDeep, fontSize: 13 },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border, marginBottom: 4 },
  stepDotActive: { backgroundColor: colors.brandGreenDark },
  stepLabel: { fontSize: 9.5, color: colors.inkMuted, textAlign: 'center' },
  stepLabelActive: { color: colors.brandGreenDeep, fontWeight: '700' },

  riderStatusCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing(4),
    marginBottom: spacing(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow,
  },
  riderStatusLabel: { fontWeight: '700', color: colors.ink },
  riderEarnings: { color: colors.inkMuted, fontSize: 12.5, marginTop: 2 },
  dot: { width: 12, height: 12, borderRadius: 6 },

  hero: { backgroundColor: colors.brandGreenDeep, borderRadius: radii.lg, padding: spacing(6), marginBottom: spacing(4) },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: '800', marginBottom: spacing(2) },
  heroSubtitle: { color: '#DDEFE2', fontSize: 14, marginBottom: spacing(5) },
  heroButton: { backgroundColor: colors.brandGreen, borderRadius: radii.pill, paddingVertical: 13, alignItems: 'center' },
  heroButtonText: { color: colors.brandGreenDeep, fontWeight: '800', fontSize: 15 },

  infoGrid: { flexDirection: 'row', gap: spacing(3) },
  infoCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(4), ...shadow },
  infoValue: { fontSize: 22, fontWeight: '800', color: colors.brandGreenDeep },
  infoLabel: { fontSize: 12, color: colors.inkMuted, marginTop: 4 },
});
