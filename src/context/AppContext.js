import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMockRuns } from '../data/mockRuns';

const AppContext = createContext(null);
const STORAGE_KEY = 'pedal.profile.v1';

export function AppProvider({ children }) {
  const [mode, setMode] = useState('sender'); // 'sender' | 'rider'
  const [profile, setProfile] = useState({
    name: '',
    avatarUri: null,
    address: '',
    lat: 51.1367,
    lng: -114.2497,
    useAutoLocation: false,
  });
  const [authed, setAuthed] = useState(false);

  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [cart, setCart] = useState([]); // [{itemId, name, price, qty, size}]
  const [activeOrder, setActiveOrder] = useState(null); // Sender's placed order
  const [riderActiveRun, setRiderActiveRun] = useState(null);
  const [riderEarningsToday, setRiderEarningsToday] = useState(0);
  const [riderOnline, setRiderOnline] = useState(false);

  const [runs] = useState(() => generateMockRuns());

  const [riderFilters, setRiderFilters] = useState({
    maxDistanceKm: 8,
    maxItems: 15,
    minPay: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setProfile((p) => ({ ...p, ...saved }));
          setAuthed(true);
        }
      } catch (e) {
        // Local storage unavailable — app still works, just won't persist.
      }
    })();
  }, []);

  const persistProfile = async (next) => {
    setProfile(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // no-op — non-fatal if storage isn't available
    }
  };

  function addToCart(item, qty = 1, size = null) {
    setCart((prev) => {
      const key = size ? `${item.id}-${size}` : item.id;
      const existing = prev.find((c) => c.key === key);
      const price = size ? item.sizes[size] : item.price;
      if (existing) {
        return prev.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { key, itemId: item.id, name: size ? `${item.name} (${size})` : item.name, price, qty, size }];
    });
  }

  function updateCartQty(key, qty) {
    setCart((prev) => (qty <= 0 ? prev.filter((c) => c.key !== key) : prev.map((c) => (c.key === key ? { ...c, qty } : c))));
  }

  function clearCart() {
    setCart([]);
    setSelectedStoreId(null);
  }

  const value = useMemo(
    () => ({
      mode,
      setMode,
      profile,
      setProfile: persistProfile,
      authed,
      setAuthed,
      selectedStoreId,
      setSelectedStoreId,
      cart,
      addToCart,
      updateCartQty,
      clearCart,
      activeOrder,
      setActiveOrder,
      runs,
      riderActiveRun,
      setRiderActiveRun,
      riderFilters,
      setRiderFilters,
      riderEarningsToday,
      setRiderEarningsToday,
      riderOnline,
      setRiderOnline,
    }),
    [mode, profile, authed, selectedStoreId, cart, activeOrder, runs, riderActiveRun, riderFilters, riderEarningsToday, riderOnline]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
