import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radii, spacing, shadow } from '../theme/colors';
import { useApp } from '../context/AppContext';

const STEPS = ['Matching', 'Rider en route', 'Picked up', 'Delivered'];

export default function OrderTrackingScreen() {
  const { activeOrder } = useApp();

  if (!activeOrder) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyText}>No active order right now.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing(4) }}>
      <View style={styles.card}>
        <Text style={styles.title}>{activeOrder.storeName}</Text>
        <View style={styles.stepsCol}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepRow}>
              <View style={[styles.dot, i <= activeOrder.status && styles.dotActive]} />
              <Text style={[styles.stepText, i <= activeOrder.status && styles.stepTextActive]}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hand-off PIN</Text>
        <Text style={styles.pin}>{activeOrder.pin}</Text>
        <Text style={styles.helper}>
          Give this PIN to your rider at hand-off, or if they leave it at your door, you'll get 15
          minutes to confirm receipt before payment auto-releases.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order items</Text>
        {activeOrder.items.map((i) => (
          <View key={i.key} style={styles.itemRow}>
            <Text style={styles.itemName}>{i.name} × {i.qty}</Text>
            <Text style={styles.itemPrice}>${(i.price * i.qty).toFixed(2)}</Text>
          </View>
        ))}
        <View style={[styles.itemRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total paid</Text>
          <Text style={styles.totalValue}>${(activeOrder.subtotal + activeOrder.fee.deliveryFee).toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceMuted },
  emptyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted },
  emptyText: { color: colors.inkMuted },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(4), marginBottom: spacing(4), borderWidth: 1, borderColor: colors.border, ...shadow },
  title: { fontSize: 17, fontWeight: '800', color: colors.ink, marginBottom: spacing(3) },
  stepsCol: { gap: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.brandGreenDark },
  stepText: { color: colors.inkMuted, fontSize: 13.5 },
  stepTextActive: { color: colors.ink, fontWeight: '700' },
  sectionTitle: { fontWeight: '700', color: colors.ink, fontSize: 14, marginBottom: spacing(2) },
  pin: { fontSize: 34, fontWeight: '800', color: colors.brandGreenDeep, letterSpacing: 6, marginBottom: spacing(2) },
  helper: { fontSize: 12, color: colors.inkMuted, lineHeight: 17 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemName: { color: colors.ink, fontSize: 13.5 },
  itemPrice: { color: colors.inkMuted, fontSize: 13.5, fontWeight: '600' },
  totalRow: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontWeight: '800', color: colors.ink },
  totalValue: { fontWeight: '800', color: colors.brandGreenDark },
});
