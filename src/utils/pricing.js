// Pedal pricing formula, exactly as specified:
//   $2.00 base fee
// + $0.50 per km (Sender <-> store)
// + $0.10 per item beyond the first 5 items
// Rider keeps 90% of the delivery fee, platform keeps 10%.

export const PRICING = {
  baseFee: 2.0,
  perKm: 0.5,
  perExtraItem: 0.1,
  freeItemAllowance: 5,
  riderShare: 0.9,
};

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computeDeliveryFee({ distanceKm, itemCount }) {
  const distanceCost = round2(distanceKm * PRICING.perKm);
  const extraItems = Math.max(0, itemCount - PRICING.freeItemAllowance);
  const itemCost = round2(extraItems * PRICING.perExtraItem);
  const deliveryFee = round2(PRICING.baseFee + distanceCost + itemCost);
  const riderPayout = round2(deliveryFee * PRICING.riderShare);
  const platformCut = round2(deliveryFee - riderPayout);
  return {
    baseFee: PRICING.baseFee,
    distanceCost,
    extraItems,
    itemCost,
    deliveryFee,
    riderPayout,
    platformCut,
  };
}

export function itemsSubtotal(cartItems) {
  return round2(cartItems.reduce((sum, ci) => sum + ci.price * ci.qty, 0));
}

export function cartItemCount(cartItems) {
  return cartItems.reduce((sum, ci) => sum + ci.qty, 0);
}
