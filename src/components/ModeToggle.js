import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii } from '../theme/colors';

// "Neighbor" -> "Sender" per request: you're the one sending a rider on a run.
export default function ModeToggle({ mode, onChange }) {
  return (
    <View style={styles.wrap}>
      {['sender', 'rider'].map((m) => {
        const active = mode === m;
        return (
          <Pressable key={m} onPress={() => onChange(m)} style={[styles.btn, active && styles.btnActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{m === 'sender' ? 'Sender' : 'Rider'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    padding: 3,
  },
  btn: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: radii.pill },
  btnActive: { backgroundColor: colors.brandGreen },
  label: { fontWeight: '600', color: colors.inkMuted, fontSize: 14 },
  labelActive: { color: colors.brandGreenDeep },
});
