import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking, Alert } from 'react-native';
import { colors, radii, spacing, shadow } from '../theme/colors';
import { useApp } from '../context/AppContext';
import PrimaryButton from '../components/PrimaryButton';
import { staticMapUrl, googleMapsDirectionsUrl, appleMapsDirectionsUrl } from '../utils/geo';

export default function ConfirmRunScreen({ route, navigation }) {
  const { runId } = route.params;
  const { runs, setRiderActiveRun, setRiderEarningsToday } = useApp();
  const run = runs.find((r) => r.id === runId);

  if (!run) return null;

  const mapCoords = { fromLat: run.store.lat, fromLng: run.store.lng, toLat: run.destination.lat, toLng: run.destination.lng };
  const mapUrl = staticMapUrl({ ...mapCoords });

  const openMaps = (which) => {
    const url = which === 'google' ? googleMapsDirectionsUrl(mapCoords) : appleMapsDirectionsUrl(mapCoords);
    Linking.openURL(url).catch(() => Alert.alert('Could not open maps app'));
  };

  const handleConfirm = () => {
    setRiderActiveRun(run);
    setRiderEarningsToday((prev) => prev + run.fee.riderPayout);
    Alert.alert('Run accepted', `Head to ${run.store.name} to pick up the order.`, [
      { text: 'OK', onPress: () => navigation.navigate('Feed') },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing(4), paddingBottom: spacing(10) }}>
      <View style={styles.storeRow}>
        <Image source={run.store.logo} style={styles.storeLogo} resizeMode="contain" />
        <View>
          <Text style={styles.storeName}>{run.store.name}</Text>
          <Text style={styles.storeAddress}>{run.store.address}</Text>
        </View>
      </View>

      <Image source={{ uri: mapUrl }} style={styles.mapImage} resizeMode="cover" />
      <View style={styles.mapButtons}>
        <Pressable style={styles.mapBtn} onPress={() => openMaps('google')}>
          <Text style={styles.mapBtnText}>Open in Google Maps</Text>
        </Pressable>
        <Pressable style={styles.mapBtn} onPress={() => openMaps('apple')}>
          <Text style={styles.mapBtnText}>Open in Apple Maps</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Deliver to</Text>
        <Text style={styles.destination}>{run.destination.label}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Items to collect</Text>
        {run.items.map((i) => (
          <View key={i.itemId} style={styles.itemRow}>
            <Text style={styles.itemName}>{i.name} × {i.qty}</Text>
            <Text style={styles.itemPrice}>${(i.price * i.qty).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Run details</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>Distance</Text>
          <Text style={styles.itemPrice}>{run.distanceKm} km</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>Estimated time</Text>
          <Text style={styles.itemPrice}>~{run.etaMinutes} min</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>Customer pays (delivery fee)</Text>
          <Text style={styles.itemPrice}>${run.fee.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.itemRow, styles.payoutRow]}>
          <Text style={styles.payoutLabel}>You earn</Text>
          <Text style={styles.payoutValue}>${run.fee.riderPayout.toFixed(2)}</Text>
        </View>
      </View>

      <PrimaryButton title="Confirm & start run" onPress={handleConfirm} />
      <View style={{ height: spacing(3) }} />
      <PrimaryButton title="Back to feed" variant="outline" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceMuted },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing(4) },
  storeLogo: { width: 52, height: 52, borderRadius: radii.sm, backgroundColor: colors.surface },
  storeName: { fontWeight: '800', fontSize: 17, color: colors.ink },
  storeAddress: { fontSize: 12, color: colors.inkMuted, marginTop: 2, maxWidth: 260 },

  mapImage: { width: '100%', height: 180, borderRadius: radii.md, backgroundColor: colors.border, marginBottom: spacing(2) },
  mapButtons: { flexDirection: 'row', gap: spacing(2), marginBottom: spacing(4) },
  mapBtn: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, paddingVertical: 10, alignItems: 'center' },
  mapBtnText: { color: colors.brandGreenDeep, fontWeight: '700', fontSize: 12.5 },

  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(4), marginBottom: spacing(3), borderWidth: 1, borderColor: colors.border, ...shadow },
  cardTitle: { fontWeight: '700', color: colors.ink, marginBottom: spacing(2), fontSize: 14 },
  destination: { color: colors.inkMuted, fontSize: 13.5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemName: { color: colors.ink, fontSize: 13.5 },
  itemPrice: { color: colors.inkMuted, fontSize: 13.5, fontWeight: '600' },
  payoutRow: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  payoutLabel: { fontWeight: '800', color: colors.ink, fontSize: 15 },
  payoutValue: { fontWeight: '800', color: colors.brandGreenDark, fontSize: 17 },
});
