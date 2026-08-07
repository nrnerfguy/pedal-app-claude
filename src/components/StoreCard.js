import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { colors, radii, spacing, shadow } from '../theme/colors';

export default function StoreCard({ store, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.logoWrap}>
        <Image source={store.logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.name} numberOfLines={1}>{store.name}</Text>
      <Text style={styles.blurb} numberOfLines={1}>{store.blurb}</Text>
      <Text style={styles.hours}>{store.hours}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing(3),
    marginRight: spacing(3),
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow,
  },
  cardSelected: { borderColor: colors.brandGreenDark, backgroundColor: '#F0FBF3' },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(2),
    overflow: 'hidden',
  },
  logo: { width: 44, height: 44 },
  name: { fontWeight: '700', fontSize: 14, color: colors.ink },
  blurb: { fontSize: 11.5, color: colors.inkMuted, marginTop: 2 },
  hours: { fontSize: 11, color: colors.inkMuted, marginTop: 4 },
});
