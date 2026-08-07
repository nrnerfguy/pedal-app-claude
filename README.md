# Pedal

Neighborhood bike delivery app — Sender (customer) and Rider modes in one Expo/React Native app.

## What's real vs. what's stubbed

**Fully working right now, no setup required beyond `npm install`:**
- Every screen described: landing Home, Orders (store browse → cart → live price breakdown), Rider feed with slider filters, Confirm-run page with map + Google/Apple Maps deep links, Settings (profile photo, address, location)
- Real store & item data from your spreadsheet (Sobeys, Circle K, Starbucks, Domino's — all Tuscany, Calgary)
- Real uploaded logos/icon — nothing AI-generated
- The exact pricing formula you specified: $2 base + $0.50/km + $0.10/item beyond 5, rider keeps 90%
- Local, on-device "auth" so you can click all the way through the app immediately

**Needs your own credentials before this is a real, live business (see comments in each file):**
- `src/services/supabase.js` — real accounts, live order/run sync across devices
- `src/services/stripe.js` — real card payments, Connect payouts, standard-vs-instant payout timing
- Currently the app runs entirely on local state, so two phones won't see each other's live orders yet — that requires the Supabase step above

**Important before you launch publicly:** the store logos (Sobeys, Circle K, Starbucks, Domino's) are those companies' real trademarks. Using them in a live public app implies a partnership that doesn't exist yet — that's a real legal risk, not a technical one. Fine for a prototype/demo; get explicit permission (or use neutral placeholder branding) before anyone outside your team uses this.

## Run it locally (Expo Go on your phone)

```bash
npm install
npx expo start
```
Scan the QR code with the Expo Go app (iOS or Android).

## Run it in your browser

```bash
npx expo start --web
```

## Deploy the web version to Vercel

```bash
npx expo export --platform web
```
This outputs to `/dist`. Deploy that folder as a static site on Vercel (or connect the repo and Vercel will run `vercel-build` from `package.json` automatically).

## Project structure

```
App.js                      entry point
src/
  context/AppContext.js     global state (profile, cart, orders, rider filters)
  data/stores.js            real store + item data
  data/mockRuns.js          mock live rider feed (replace with Supabase Realtime)
  utils/pricing.js          the $2 + $0.50/km + $0.10/item formula
  utils/geo.js              distance calc + map links
  navigation/RootNavigator.js
  screens/                  Home, Orders, RiderFeed, ConfirmRun, Settings, OrderTracking, Login
  services/                 Supabase + Stripe integration notes
```
