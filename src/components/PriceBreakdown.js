import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';

function Row({ label, value, bold, muted, positive }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.bold, muted && styles.muted]}>{label}</Text>
      <Text style={[styles.value, bold && styles.bold, positive && styles.positive]}>{value}</Text>
    </View>
  );
}

export default function PriceBreakdown({ itemsSubtotal, distanceKm, itemCount, fee }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order summary</Text>
      <Row label="Items subtotal" value={`$${itemsSubtotal.toFixed(2)}`} />
      <View style={styles.divider} />
      <Row label="Pedal delivery fee" value="" muted />
      <Row label={`  Base fee`} value={`$${fee.baseFee.toFixed(2)}`} muted />
      <Row label={`  Distance (${distanceKm.toFixed(1)} km × $0.50)`} value={`$${fee.distanceCost.toFixed(2)}`} muted />
      <Row
        label={`  Items beyond 5 (${fee.extraItems} × $0.10)`}
        value={`$${fee.itemCost.toFixed(2)}`}
        muted
      />
      <Row label="Delivery fee total" value={`$${fee.deliveryFee.toFixed(2)}`} />
      <View style={styles.divider} />
      <Row label="Total" value={`$${(itemsSubtotal + fee.deliveryFee).toFixed(2)}`} bold />
      <View style={styles.splitBox}>
        <Row label="Rider keeps (90%)" value={`$${fee.riderPayout.toFixed(2)}`} positive bold />
        <Row label="Pedal platform (10%)" value={`$${fee.platformCut.toFixed(2)}`} muted />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(4), borderWidth: 1, borderColor: colors.border },
  title: { fontWeight: '700', fontSize: 15, color: colors.ink, marginBottom: spacing(2) },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { color: colors.inkMuted, fontSize: 13.5 },
  value: { color: colors.ink, fontSize: 13.5, fontWeight: '500' },
  bold: { fontWeight: '800', fontSize: 15.5, color: colors.ink },
  muted: { color: colors.inkMuted },
  positive: { color: colors.brandGreenDark },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  splitBox: { marginTop: spacing(2), backgroundColor: colors.surfaceMuted, borderRadius: radii.sm, padding: spacing(2) },
});
