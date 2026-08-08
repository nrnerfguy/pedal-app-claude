import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { generateMockRuns } from '../data/mockRuns';

const AppContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  avatarUri: null,
  address: '',
  lat: 51.1367,
  lng: -114.2497,
  useAutoLocation: false,
};

export function AppProvider({ children }) {
  const [mode, setMode] = useState('sender'); // 'sender' | 'rider'
  const [profile, setProfileState] = useState(DEFAULT_PROFILE);
  const [session, setSession] = useState(null);
  const [authedLocal, setAuthedLocal] = useState(false); // only used when Supabase isn't configured
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);

  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [riderActiveRun, setRiderActiveRun] = useState(null);
  const [riderEarningsToday, setRiderEarningsToday] = useState(0);
  const [riderOnline, setRiderOnline] = useState(false);
  const [runs] = useState(() => generateMockRuns());
  const [riderFilters, setRiderFilters] = useState({ maxDistanceKm: 8, maxItems: 15, minPay: 0 });

  // ── Real auth session (Supabase) ────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return; // local demo mode — see LoginScreen
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Load the signed-in user's real profile row from the database ───
  useEffect(() => {
    if (!isSupabaseConfigured || !session?.user) return;
    (async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!error && data) {
        setProfileState({
          name: data.name || '',
          avatarUri: data.avatar_url || null,
          address: data.address || '',
          lat: data.lat ?? DEFAULT_PROFILE.lat,
          lng: data.lng ?? DEFAULT_PROFILE.lng,
          useAutoLocation: data.use_auto_location || false,
        });
        setMode(data.mode || 'sender');
        setRiderEarningsToday(data.rider_earnings_today || 0);
      }
    })();
  }, [session?.user?.id]);

  // Saves to the real account (Supabase) when configured; otherwise stays
  // in local device memory so the app still works before you've set up
  // your Supabase project.
  const setProfile = async (updater) => {
    const next = typeof updater === 'function' ? updater(profile) : updater;
    setProfileState(next);
    if (isSupabaseConfigured && session?.user) {
      await supabase.from('profiles').upsert({
        id: session.user.id,
        name: next.name,
        address: next.address,
        lat: next.lat,
        lng: next.lng,
        use_auto_location: next.useAutoLocation,
        avatar_url: next.avatarUri,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      setAuthedLocal(false);
    }
    setProfileState(DEFAULT_PROFILE);
  };

  function addToCart(item, qty = 1, size = null) {
    setCart((prev) => {
      const key = size ? `${item.id}-${size}` : item.id;
      const existing = prev.find((c) => c.key === key);
      const price = size ? item.sizes[size] : item.price;
      if (existing) return prev.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c));
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

  const isAuthed = isSupabaseConfigured ? Boolean(session?.user) : authedLocal;

  const value = useMemo(
    () => ({
      mode,
      setMode,
      profile,
      setProfile,
      authed: isAuthed,
      authLoading,
      // Local-demo-only escape hatch (used by LoginScreen when Supabase isn't configured)
      setAuthed: isSupabaseConfigured ? () => {} : setAuthedLocal,
      user: session?.user || null,
      signOut,
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
    [mode, profile, session, isAuthed, authLoading, selectedStoreId, cart, activeOrder, runs, riderActiveRun, riderFilters, riderEarningsToday, riderOnline]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
