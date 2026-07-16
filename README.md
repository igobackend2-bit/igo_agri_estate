# IGO Agri Estates

Agri real-estate marketplace — buy, sell, rent, and lease verified agricultural land across Tamil Nadu, India, with location/category browsing, WhatsApp-based inquiries, and an investor/seller dashboard, based in Chennai, India.

## Tech Stack

- React 19 + TypeScript, built on Vite 8 (`vite`/`rolldown-vite`)
- Tailwind CSS 4
- React Router v7 (client-side routing, 30 routes, code-split via `React.lazy()`)
- Supabase (`@supabase/supabase-js`) — auth + database, with a localStorage fallback when unreachable
- react-helmet-async — per-route SEO metadata, canonical tags, JSON-LD schema
- Framer Motion — animation
- Three.js / `@react-three/fiber` / `@react-three/drei` — 3D elements
- lucide-react — icons

## Features

- Estate browsing filtered by location (Mahabalipuram, Maduranthagam, Chennai City, Kanchipuram, Chennai Suburban), category (Open Field, Horticulture, Nursery, Livestock, Protected, Hydroponic, Mushroom, Microgreens), and free-text search
- Per-estate detail pages with revenue model, soil/water data, infrastructure distances, FAQs, and image gallery
- WhatsApp click-to-chat pre-filled with the specific estate name and inquiry text
- Favorites and a "compare" selector (see Known Limitations — the comparison view itself is not yet built)
- Admin dashboard for property/lead/blog/video CRUD
- Buyer "Post Requirement" and seller "Post Property" submission flows
- Investor dashboard, valuation simulator, AI investment report, tax optimizer (see Known Limitations for what's simulated vs. real)
- Full SEO/AEO/GEO coverage: meta titles/descriptions/keywords, JSON-LD schema, sitemap.xml, robots.txt (including AI-crawler allow rules), llms.txt
- Per-estate `latitude`/`longitude` data (added in the latest audit pass — not yet rendered as an interactive map; see Known Limitations)

## Project Structure

```
src/
  components/
    3d/            Three.js elements
    admin/         Admin panel components
    ai/            DocumentAssistant and other "AI"-labeled UI
    charts/        Data visualization
    dashboard/     Investor dashboard widgets
    home/          Homepage-specific sections
    maps/          DiscoveryMap (currently a static mockup)
    modals/        AuthRequiredModal, ReservationModal, VRTourModal, etc.
    property/      Property-card-adjacent components (AIInvestmentReport, etc.)
  context/         AuthContext and other React context providers
  data/            Static estate datasets (locationEstates.ts, properties.ts)
  hooks/           useProperties and other data hooks
  lib/             Supabase client, leadsService, notificationService, trackingService, localSync
  pages/
    admin/         Admin dashboard, property form, delete modal
    dashboard/     Investor dashboard pages
    services/      LegalServices, SoilIntelligence
  types/           Shared TypeScript types (Property, etc.)
  utils/           Utility functions
```

## Getting Started

**Prerequisites:** Node.js 18+

1. **Install dependencies**
   ```
   npm install
   ```

2. **Copy `.env.example` → `.env`** and set your own credentials:
   - `VITE_SUPABASE_URL` — your Supabase project URL, used for all property/lead/auth data
   - `VITE_SUPABASE_ANON_KEY` — the public anon key for that Supabase project
   > The `.env.example` currently checked into this repo has real, working values rather than placeholders — treat it as sensitive.

3. **Run the app locally**
   ```
   npm run dev
   ```
   This starts the Vite dev server at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then build the production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Status & Known Limitations

This is a working, actively developed platform — not everything is production-complete. From a full code audit, current known gaps are:

**Payments & trust**
- The "Reserve Estate" flow collects card details in plain form fields, but no payment gateway is actually called — the "Payment Successful" screen and transaction ID are fake. No real charge occurs and no real transaction record is created.
- Admin auth is a single shared password (see `BUILD_AND_DEPLOY.md`) stored in local settings — there are no per-admin accounts, roles, or an audit trail of admin actions.
- No cookie consent / GDPR banner exists anywhere on the site.

**Functional gaps / mocked features**
- The Document Assistant and AI Investment Report are `setTimeout`-based canned responses — no real LLM call is made (a `GEMINI_API_KEY` env var is referenced in `vite.config.ts` but unused anywhere in `src/`).
- The Live Chat widget is a hardcoded keyword-matching bot — no real backend or human handoff beyond displaying a phone/email fallback.
- The "VR Tour" modal shows a single static stock photo with a hover-zoom effect — not an actual 360° panorama.
- `DiscoveryMap.tsx` (the "View Map" toggle on Listings) renders a decorative SVG grid with 4 hardcoded fake pins, not connected to real estate data. Real per-estate `latitude`/`longitude` now exists in the data layer, but the map component itself hasn't been rebuilt to consume it yet.
- The estate comparison feature is incomplete: Listings lets a customer select up to 3 estates to compare ("Comparing 2/3"), and PropertyDetails has a "Compare ROI" button, but there is no comparison page for either to lead to — both are currently dead ends.
- `brochureUrl` exists on the `Property` type but is never rendered anywhere in the UI, even when populated.

**Data persistence**
- Supabase is configured and used when reachable, but every write path (auth, leads, properties, notifications, analytics) also has a localStorage fallback. If that fallback is ever silently triggered, data will not sync across devices or browsers and is lost if the browser cache is cleared.
- The 9 estates in `src/data/properties.ts` only ever had a generic city/state location (no street address), so their newly-added `latitude`/`longitude` are approximated to IGO's registered office rather than a real site-specific location. The 11 estates in `src/data/locationEstates.ts` have real addresses and were geocoded individually.

**Documentation drift**
- `BUILD_AND_DEPLOY.md`'s route-testing table still lists `/contact` as expected to 404 ("contact is a section on Home, not a standalone page"). This is out of date — `/contact` and `/about` are both real standalone routes now; that gap was found and fixed in an earlier pass, but the deployment doc itself was never updated to match.
- Both `BUILD_AND_DEPLOY.md` (Hostinger, `.htaccess`) and `vercel.json` (Vercel rewrites) are present as deployment targets — confirm which one is actually in use before assuming the other is current.

## Suggested Next Steps for Whoever Picks This Up

Roughly in priority order:

1. **Fix the two dead-end features first** — the "Compare ROI" button and the estate comparison selector both currently do nothing for the customer. Low effort, high visibility since they're already live and clickable.
2. **Replace the fake payment flow with a real gateway** (Razorpay is the natural fit for an India-based platform) before any real customer is expected to complete a reservation.
3. **Decide on a single source of truth for data** — either commit to Supabase as the only durable store and remove the silent localStorage fallbacks, or explicitly document localStorage as an intentional offline/demo mode.
4. **Build the real map** — the data prerequisite (`latitude`/`longitude` on every estate) is already done; swapping `DiscoveryMap.tsx`'s mockup for a real Mapbox/Leaflet integration is now a self-contained frontend task. See `Real_Maps_and_360_Tours_Plan.md`.
5. **Reconcile the deployment docs** — confirm whether this project ships via Hostinger or Vercel and update the other file (or remove it) so there's one clear deployment path.
6. **Tighten admin security** — move off the single shared password toward real per-admin accounts/roles before this handles anything more sensitive than it already does.
7. **Add real customer testimonials/reviews** with `AggregateRating` schema — currently there is zero third-party trust signal anywhere on the site, which matters more for land investment than for most other product categories.
8. Everything else already scoped in the planning docs in this repo — `IGO_Agri_Estates_Upgrade_Plan.md` (full prioritized roadmap), `Real_Maps_and_360_Tours_Plan.md`, `Frontend_Only_Upgrade_Options.md`, and `Customer_Experience_Update_Plan.md` — read those before starting new work to avoid re-deriving priorities that have already been worked out.

## Deployment

See `BUILD_AND_DEPLOY.md` for the documented Hostinger deployment steps (`npm run build` → upload `dist/` contents via hPanel/FTP → confirm `.htaccess` is present for client-side routing). A `vercel.json` is also present in the repo root for Vercel-style deployment — see the Documentation Drift note above before assuming either is current.
