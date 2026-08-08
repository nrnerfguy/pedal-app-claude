# Pedal

Neighborhood bike delivery app — Sender (customer) and Rider modes in one Expo/React Native app.

## What's real vs. what's stubbed

**Fully working right now, no setup required beyond `npm install`:**
- Every screen described: landing Home, Orders (store browse → cart → live price breakdown), Rider feed with slider filters, Confirm-run page with map + Google/Apple Maps deep links, Settings (profile photo, address, location)
- Real store & item data from your spreadsheet (Sobeys, Circle K, Starbucks, Domino's — all Tuscany, Calgary)
- Real uploaded logos/icon — nothing AI-generated
- The exact pricing formula you specified: $2 base + $0.50/km + $0.10/item beyond 5, rider keeps 90%
- Runs in "local demo mode" until Supabase is connected (see below) — fully clickable, nothing crashes, it just won't save to a real account yet

**Real account login, saved to a real database — needs ~10 minutes of your own setup (I can't create these accounts for you):**
1. Create a free project at https://supabase.com
2. Copy `.env.example` to `.env`, fill in your Project URL + anon key (Project Settings → API)
3. Supabase dashboard → SQL Editor → run everything in `supabase/schema.sql` (creates the `profiles` table, row-level security policies, and the `avatars` storage bucket)
4. For "Continue with Google" specifically: follow `supabase/google-oauth-setup.md` (needs a Google Cloud OAuth client — a separate free step)
5. Restart `expo start` after adding `.env` — Expo only reads env vars at startup

Once that's done: email/password sign-up, sign-in, and Google sign-in all create/use a **real Supabase account**, and your profile (name, address, avatar) saves to a **real Postgres database row that only you can read or write** (enforced by Row Level Security, not just app code). Profile photos upload to real cloud storage.

**Security practices actually implemented, not just described:**
- No secrets of any kind in the app code — the Supabase "anon" key is the only key that ships client-side, and it's designed to be public (it can't do anything your database's row-level security doesn't explicitly allow)
- Auth sessions are stored in your device's encrypted keychain/keystore (`expo-secure-store`), not plain storage
- Database rules (RLS) mean a user can only ever read/write their own profile row and their own avatar file — enforced by Postgres itself, so even a bug in the app code can't leak someone else's data
- Passwords are never touched by this app's code at all — Supabase's auth service handles hashing/storage entirely

**What I still can't promise:** "zero security risk" isn't a real claim anyone can make. This follows solid practices, but a real launch handling real people's money should get an actual security review before going live — especially once Stripe payments are wired in (see `src/services/stripe.js`).

**Still stubbed (needs your own credentials, same reasoning as above):**
- `src/services/stripe.js` — real card payments, Connect payouts, standard-vs-instant payout timing
- The rider feed is still mock/generated data — replace `src/data/mockRuns.js` with a live Supabase query once real orders exist

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
