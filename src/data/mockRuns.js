import { STORES } from './stores';
import { distanceKm } from '../utils/geo';
import { computeDeliveryFee } from '../utils/pricing';

// Default "home base" used to seed nearby mock destinations (Tuscany, Calgary).
const HUB = { lat: 51.1367, lng: -114.2497 };

const DESTINATIONS = [
  { label: '46 Tuscany Ridge Pk NW', lat: 51.1401, lng: -114.2455 },
  { label: '128 Tuscany Hills Cl NW', lat: 51.1332, lng: -114.2538 },
  { label: '212 Tuscany Springs Bv NW', lat: 51.1289, lng: -114.2401 },
  { label: '35 Tuscany Vista Rd NW', lat: 51.1420, lng: -114.2570 },
  { label: '88 Tuscany Estates Dr NW', lat: 51.1310, lng: -114.2450 },
  { label: '19 Tuscany Meadows Pl NW', lat: 51.1355, lng: -114.2610 },
];

function buildRun(id, store, destIndex, itemPicks) {
  const dest = DESTINATIONS[destIndex % DESTINATIONS.length];
  const km = distanceKm(store.lat, store.lng, dest.lat, dest.lng);
  const itemCount = itemPicks.reduce((s, i) => s + i.qty, 0);
  const fee = computeDeliveryFee({ distanceKm: km, itemCount });
  return {
    id,
    store,
    destination: dest,
    distanceKm: Math.round(km * 10) / 10,
    items: itemPicks,
    itemCount,
    fee,
    etaMinutes: Math.max(8, Math.round(km * 6 + itemCount * 0.8)),
  };
}

function pick(store, indices) {
  return indices.map((i, idx) => {
    const item = store.items[i];
    const price = item.price ?? Object.values(item.sizes)[0];
    return { itemId: item.id, name: item.name, price, qty: idx === 0 ? 2 : 1 };
  });
}

export function generateMockRuns() {
  const sobeys = STORES[0];
  const circlek = STORES[1];
  const starbucks = STORES[2];
  const dominos = STORES[3];

  return [
    buildRun('run-1', sobeys, 0, pick(sobeys, [0, 2, 4])),
    buildRun('run-2', circlek, 1, pick(circlek, [0, 1, 2, 3])),
    buildRun('run-3', starbucks, 2, pick(starbucks, [0, 1])),
    buildRun('run-4', dominos, 3, pick(dominos, [0, 5])),
    buildRun('run-5', sobeys, 4, pick(sobeys, [1, 3, 5, 0, 2])),
    buildRun('run-6', dominos, 5, pick(dominos, [2, 3])),
  ];
}
