import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, radii } from '../theme/colors';

export default function PrimaryButton({ title, onPress, disabled, loading, variant = 'solid', icon }) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.solid,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={isOutline ? colors.brandGreenDeep : colors.white} />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, isOutline && { color: colors.brandGreenDeep }]}>{title}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: { backgroundColor: colors.brandGreenDeep },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.brandGreenDeep },
  disabled: { opacity: 0.45 },
  text: { color: colors.white, fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
