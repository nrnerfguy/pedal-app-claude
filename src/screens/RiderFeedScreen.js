import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Switch } from 'react-native';
import { colors, radii, spacing, shadow } from '../theme/colors';
import { useApp } from '../context/AppContext';
import FilterSlider from '../components/FilterSlider';

function RunCard({ run, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardTop}>
        <Image source={run.store.logo} style={styles.storeLogo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.storeName}>{run.store.name}</Text>
          <Text style={styles.destination} numberOfLines={1}>To {run.destination.label}</Text>
        </View>
        <Text style={styles.payout}>+${run.fee.riderPayout.toFixed(2)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaChip}>{run.distanceKm} km</Text>
        <Text style={styles.metaChip}>{run.itemCount} items</Text>
        <Text style={styles.metaChip}>~{run.etaMinutes} min</Text>
      </View>
    </Pressable>
  );
}

export default function RiderFeedScreen({ navigation }) {
  const { runs, riderFilters, setRiderFilters, riderOnline, setRiderOnline, riderEarningsToday } = useApp();
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(
    () =>
      runs.filter(
        (r) =>
          r.distanceKm <= riderFilters.maxDistanceKm &&
          r.itemCount <= riderFilters.maxItems &&
          r.fee.riderPayout >= riderFilters.minPay
      ),
    [runs, riderFilters]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Live gig feed</Text>
          <Text style={styles.subheading}>${riderEarningsToday.toFixed(2)} earned today</Text>
        </View>
        <View style={styles.onlineToggle}>
          <Text style={styles.onlineLabel}>{riderOnline ? 'Online' : 'Offline'}</Text>
          <Switch
            value={riderOnline}
            onValueChange={setRiderOnline}
            trackColor={{ true: colors.brandGreen, false: colors.border }}
            thumbColor={colors.brandGreenDeep}
          />
        </View>
      </View>

      <Pressable style={styles.filterToggle} onPress={() => setShowFilters((s) => !s)}>
        <Text style={styles.filterToggleText}>{showFilters ? 'Hide filters' : 'Show filters'}</Text>
      </Pressable>

      {showFilters && (
        <View style={styles.filterCard}>
          <FilterSlider
            label="Max distance"
            value={riderFilters.maxDistanceKm}
            onChange={(v) => setRiderFilters((f) => ({ ...f, maxDistanceKm: v }))}
            min={0.5}
            max={10}
            step={0.5}
            formatValue={(v) => `${v.toFixed(1)} km`}
          />
          <FilterSlider
            label="Max items"
            value={riderFilters.maxItems}
            onChange={(v) => setRiderFilters((f) => ({ ...f, maxItems: v }))}
            min={1}
            max={20}
            step={1}
            formatValue={(v) => `${v}`}
          />
          <FilterSlider
            label="Minimum pay"
            value={riderFilters.minPay}
            onChange={(v) => setRiderFilters((f) => ({ ...f, minPay: v }))}
            min={0}
            max={15}
            step={0.5}
            formatValue={(v) => `$${v.toFixed(2)}`}
          />
        </View>
      )}

      {!riderOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Go online to accept runs.</Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: spacing(4), paddingTop: spacing(2) }}
        renderItem={({ item }) => (
          <RunCard run={item} onPress={() => riderOnline && navigation.navigate('ConfirmRun', { runId: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No runs match your filters right now.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceMuted },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing(4), paddingBottom: spacing(2) },
  heading: { fontSize: 19, fontWeight: '800', color: colors.ink },
  subheading: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },
  onlineToggle: { alignItems: 'center' },
  onlineLabel: { fontSize: 11, color: colors.inkMuted, marginBottom: 2, fontWeight: '600' },

  filterToggle: { alignSelf: 'flex-start', marginHorizontal: spacing(4), marginBottom: spacing(2) },
  filterToggleText: { color: colors.brandGreenDeep, fontWeight: '700', fontSize: 12.5 },
  filterCard: { backgroundColor: colors.surface, marginHorizontal: spacing(4), padding: spacing(4), borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing(2) },

  offlineBanner: { marginHorizontal: spacing(4), backgroundColor: '#FDECEC', borderRadius: radii.sm, padding: spacing(3), marginBottom: spacing(2) },
  offlineText: { color: colors.danger, fontWeight: '600', fontSize: 12.5, textAlign: 'center' },

  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing(3), marginBottom: spacing(3), borderWidth: 1, borderColor: colors.border, ...shadow },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  storeLogo: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.surfaceMuted },
  storeName: { fontWeight: '700', color: colors.ink, fontSize: 14.5 },
  destination: { color: colors.inkMuted, fontSize: 12, marginTop: 2 },
  payout: { fontWeight: '800', color: colors.brandGreenDark, fontSize: 16 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  metaChip: { backgroundColor: colors.surfaceMuted, color: colors.inkMuted, fontSize: 11.5, fontWeight: '600', paddingVertical: 4, paddingHorizontal: 9, borderRadius: radii.pill, overflow: 'hidden' },
  emptyText: { textAlign: 'center', color: colors.inkMuted, marginTop: spacing(8) },
});
