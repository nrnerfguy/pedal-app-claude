import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native';
import { colors, radii, spacing, shadow } from '../theme/colors';
import { STORES, CATEGORIES } from '../data/stores';
import StoreCard from '../components/StoreCard';
import PrimaryButton from '../components/PrimaryButton';
import PriceBreakdown from '../components/PriceBreakdown';
import { useApp } from '../context/AppContext';
import { distanceKm } from '../utils/geo';
import { computeDeliveryFee, itemsSubtotal, cartItemCount, round2 } from '../utils/pricing';

function ItemRow({ item, onAdd }) {
  const [size, setSize] = useState(item.sizes ? Object.keys(item.sizes)[0] : null);
  const price = item.sizes ? item.sizes[size] : item.price;
  return (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          ${price.toFixed(2)} {item.unit === 'lb' ? '/ lb' : ''}
        </Text>
        {item.sizes && (
          <View style={styles.sizeRow}>
            {Object.keys(item.sizes).map((s) => (
              <Pressable key={s} onPress={() => setSize(s)} style={[styles.sizePill, size === s && styles.sizePillActive]}>
                <Text style={[styles.sizeText, size === s && styles.sizeTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <Pressable style={styles.addBtn} onPress={() => onAdd(item, size)}>
        <Text style={styles.addBtnText}>+ Add</Text>
      </Pressable>
    </View>
  );
}

export default function OrdersScreen({ navigation }) {
  const { profile, selectedStoreId, setSelectedStoreId, cart, addToCart, updateCartQty, clearCart, setActiveOrder } = useApp();
  const [category, setCategory] = useState('All');

  const stores = category === 'All' ? STORES : STORES.filter((s) => s.category === category);
  const store = STORES.find((s) => s.id === selectedStoreId);

  const km = store ? distanceKm(profile.lat, profile.lng, store.lat, store.lng) : 0;
  const itemCount = cartItemCount(cart);
  const subtotal = itemsSubtotal(cart);
  const fee = useMemo(() => computeDeliveryFee({ distanceKm: km, itemCount }), [km, itemCount]);

  const handlePlaceOrder = () => {
    if (!store || cart.length === 0) return;
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    setActiveOrder({
      storeName: store.name,
      items: cart,
      fee,
      subtotal,
      pin,
      status: 0,
      placedAt: Date.now(),
    });
    Alert.alert(
      'Order placed',
      `Your order from ${store.name} has been sent to nearby riders. Your hand-off PIN is ${pin}.`,
      [{ text: 'OK', onPress: () => { clearCart(); navigation.navigate('Home'); } }]
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        <Text style={styles.heading}>Pick a local store</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <Pressable key={c} onPress={() => setCategory(c)} style={[styles.catPill, category === c && styles.catPillActive]}>
              <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing(5) }}>
          {stores.map((s) => (
            <StoreCard key={s.id} store={s} selected={s.id === selectedStoreId} onPress={() => setSelectedStoreId(s.id)} />
          ))}
        </ScrollView>

        {store ? (
          <>
            <Text style={styles.heading}>Your shopping list</Text>
            <Text style={styles.subheading}>Tap items from {store.name} to add — prices set by the store</Text>
            <View style={styles.itemsCard}>
              {store.items.map((item) => (
                <ItemRow key={item.id} item={item} onAdd={(it, size) => addToCart(it, 1, size)} />
              ))}
            </View>

            {cart.length > 0 && (
              <>
                <Text style={styles.heading}>Basket</Text>
                <View style={styles.itemsCard}>
                  {cart.map((c) => (
                    <View key={c.key} style={styles.basketRow}>
                      <Text style={styles.itemName}>{c.name}</Text>
                      <View style={styles.qtyControls}>
                        <Pressable onPress={() => updateCartQty(c.key, c.qty - 1)} style={styles.qtyBtn}>
                          <Text style={styles.qtyBtnText}>–</Text>
                        </Pressable>
                        <Text style={styles.qtyText}>{c.qty}</Text>
                        <Pressable onPress={() => updateCartQty(c.key, c.qty + 1)} style={styles.qtyBtn}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </Pressable>
                      </View>
                      <Text style={styles.lineTotal}>${round2(c.price * c.qty).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        ) : (
          <Text style={styles.emptyHint}>Select a store above to start building your order.</Text>
        )}
      </ScrollView>

      {store && cart.length > 0 && (
        <View style={styles.reviewBar}>
          <PriceBreakdown itemsSubtotal={subtotal} distanceKm={km} itemCount={itemCount} fee={fee} />
          <PrimaryButton title="Place order" onPress={handlePlaceOrder} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceMuted },
  heading: { fontSize: 17, fontWeight: '800', color: colors.ink, paddingHorizontal: spacing(4), marginTop: spacing(4), marginBottom: spacing(2) },
  subheading: { fontSize: 12.5, color: colors.inkMuted, paddingHorizontal: spacing(4), marginBottom: spacing(3) },
  categoryRow: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing(4), marginBottom: spacing(3), flexWrap: 'wrap' },
  catPill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  catPillActive: { backgroundColor: colors.brandGreenDeep, borderColor: colors.brandGreenDeep },
  catText: { fontSize: 12.5, color: colors.inkMuted, fontWeight: '600' },
  catTextActive: { color: colors.white },

  itemsCard: { backgroundColor: colors.surface, marginHorizontal: spacing(4), borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: spacing(3), borderBottomWidth: 1, borderBottomColor: colors.border },
  itemName: { fontWeight: '700', color: colors.ink, fontSize: 14 },
  itemPrice: { color: colors.inkMuted, fontSize: 12.5, marginTop: 2 },
  sizeRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  sizePill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.surfaceMuted },
  sizePillActive: { backgroundColor: colors.brandGreen },
  sizeText: { fontSize: 11, color: colors.inkMuted, fontWeight: '600' },
  sizeTextActive: { color: colors.brandGreenDeep },
  addBtn: { backgroundColor: colors.surfaceMuted, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill },
  addBtnText: { color: colors.brandGreenDeep, fontWeight: '700', fontSize: 12.5 },

  basketRow: { flexDirection: 'row', alignItems: 'center', padding: spacing(3), borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontWeight: '800', color: colors.brandGreenDeep },
  qtyText: { fontWeight: '700', minWidth: 16, textAlign: 'center' },
  lineTotal: { fontWeight: '700', color: colors.ink, width: 55, textAlign: 'right' },

  emptyHint: { paddingHorizontal: spacing(4), color: colors.inkMuted, marginTop: spacing(6), textAlign: 'center' },

  reviewBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceMuted,
    padding: spacing(4),
    paddingTop: spacing(3),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing(3),
    ...shadow,
  },
});
