// Stripe Connect integration notes.
//
// Real card payments cannot run from inside the Expo client alone — Stripe
// requires a server (or Supabase Edge Function / Vercel serverless function)
// holding your SECRET key to create PaymentIntents, Connect accounts, and
// payouts. Never put a Stripe secret key in this React Native app.
//
// Recommended flow, matching the escrow model discussed for Pedal:
//
// 1. Rider onboarding
//    Server creates a Stripe Connect Express account per rider:
//      stripe.accounts.create({ type: 'express', capabilities: { transfers: { requested: true } } })
//    Client opens the returned onboarding link (stripe.accountLinks.create).
//
// 2. Sender places an order
//    Server creates a PaymentIntent for (itemsSubtotal + deliveryFee) with
//    `capture_method: 'manual'` so funds are authorized but held, not captured:
//      stripe.paymentIntents.create({
//        amount, currency: 'cad', capture_method: 'manual',
//        transfer_group: orderId,
//      })
//    Client confirms it with @stripe/stripe-react-native (npm install
//    @stripe/stripe-react-native) using a publishable key — that part IS
//    safe to keep in the app.
//
// 3. Delivery confirmed (PIN entered or 15-min porch timer elapses)
//    Server captures the PaymentIntent, then creates a Transfer to the
//    rider's connected account for `riderPayout` (see src/utils/pricing.js
//    for the exact 90/10 split calculation already implemented):
//      stripe.paymentIntents.capture(paymentIntentId)
//      stripe.transfers.create({ amount: riderPayoutCents, currency: 'cad',
//        destination: riderStripeAccountId, transfer_group: orderId })
//
// 4. Rider payout timing (the feature discussed in this chat)
//    Standard payouts (Stripe's default, ACH/bank, ~free) vs Instant
//    Payouts (~1-1.5% + flat fee, minutes not days) are both native Stripe
//    features — no separate processor needed:
//      stripe.payouts.create({ amount, currency: 'cad', method: 'instant' })
//      // omit `method` (defaults to 'standard') for the free batched payout
//
// None of the above can run inside this Expo app directly — it needs a
// small server. A single Vercel serverless function (or Supabase Edge
// Function) exposing endpoints like /create-payment-intent, /capture-order,
// and /rider-payout is enough to start.

export const STRIPE_INTEGRATION_NOTES = 'See comments in this file for the real payment flow.';
