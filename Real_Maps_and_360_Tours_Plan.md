IGO Agri Estates — Implementation Plan: Real Maps & Real 360° Tours

Prepared: July 2026


## Where these stand today

**Maps:** `src/components/maps/DiscoveryMap.tsx` is entirely decorative — it renders 4 hardcoded fake pins ("Green Valley", "Sunrise Vineyard") over an SVG grid background. None of it is connected to your actual property data, and there's no real geography underneath it at all.

**360° Tours:** `src/components/modals/VRTourModal.tsx` shows one static Unsplash stock photo with a hover-zoom effect, labeled "Live 360° Immersive Mode." There's no panorama, no drag-to-look-around interaction, and the image isn't even of the actual property.

**Also true for both:** your `Property` data model (`src/types/index.ts`) currently has no field for coordinates (latitude/longitude) and no field for panorama/tour images. Both features need a small data model change before any real map or tour can work — this isn't just a frontend swap.


## Part 1 — Real Maps

### Provider choice

| Option | Cost | Satellite imagery (matters for land) | Effort |
|---|---|---|---|
| **Mapbox GL JS** | Free up to 50,000 map loads/month, then pay-per-use | Excellent — good satellite/terrain layers out of the box | Low-medium |
| **Google Maps JavaScript API** | Free up to $200/month credit, then billed; requires a billing account on file even for free tier | Excellent, most familiar to Indian users | Low-medium |
| **Leaflet + OpenStreetMap** | Completely free, no API key, no billing account | Weak by default (would need a separate satellite tile source like Esri, which has its own usage limits) | Low |

**Recommendation: Mapbox.** For agricultural land specifically, buyers care about terrain, water bodies, and access roads — satellite/terrain view matters more here than for a typical apartment listing. Mapbox's free tier is generous enough for a site at your current traffic level, and it doesn't require putting a credit card on file the way Google Maps does. Leaflet is the fallback if you want zero ongoing cost and can accept weaker satellite imagery.

### Data model changes needed

Add to `Property` in `src/types/index.ts`:
```
latitude?: number;
longitude?: number;
```

Then:
- **Existing ~20 estates:** need to be geocoded once — either you provide the coordinates (if you know the plots), or they get looked up from the address text already stored in `projectAddress` (one-time manual or semi-automated pass, since geocoding accuracy for rural land plots by address text alone is often unreliable — cross-checking against Google Maps manually per estate is safer for something like land title accuracy).
- **New estates going forward:** the admin "add property" form gets two new fields (latitude/longitude), ideally with a small "pick on map" widget so whoever is entering the listing can click the exact plot location rather than typing coordinates by hand.

### Build steps

1. Add `latitude`/`longitude` to the type definition and to Supabase's `properties` table schema.
2. Backfill coordinates for existing estates (one-time data task, not code).
3. Install Mapbox GL JS (+ `react-map-gl` wrapper for cleaner React integration).
4. Replace `DiscoveryMap.tsx`'s mock SVG/pins with a real Mapbox instance:
   - Render one pin per real estate (from actual `Property[]` data, respecting current filters — All Estates, location tabs, category, search).
   - Pin popup on hover/click shows real title, price, ROI, and a "View Estate" link to the actual property page (not fake data).
   - Satellite/terrain/street view toggle (the "Layers" button already exists in the current UI — wire it to actually switch map style instead of doing nothing).
   - Cluster pins when zoomed out and many estates are close together (Mahabalipuram's 3 estates, for instance).
5. Add the "pick on map" coordinate picker to the admin property form.
6. Store the Mapbox access token as an environment variable (never hardcoded in source).

### Effort estimate
Roughly 2–4 days of focused development for a working version (map + real pins + popups + admin coordinate entry), assuming coordinates for existing estates are supplied. Clustering and satellite/terrain polish can follow in a second pass.


## Part 2 — Real 360° Tours

### The part that isn't code: you need real panoramic photos

This is the most important thing to plan for first — no code change makes this real without actual 360°/equirectangular photography of each estate. Two ways to get there:

- **Buy a 360 camera** (Insta360 ONE X2/X3 or Ricoh Theta, roughly ₹25,000–₹45,000) and have your site-visit team shoot each estate during their normal property visits. Cheapest long-term if you're regularly adding new listings.
- **Hire a local 360°/drone photography service per shoot** — higher per-estate cost, zero equipment investment, good for a pilot on your flagship estates before committing to buying equipment.

Either way, plan for **multiple capture points per estate** (entrance, field center, water source, farmhouse if present) rather than one single panorama, since land estates are large and one 360° shot from one spot won't represent the whole property.

### Library choice

| Option | Cost | Fit |
|---|---|---|
| **Photo Sphere Viewer** (+ React wrapper) | Free, open source, self-hosted images | Best fit — lightweight, supports hotspot navigation between multiple capture points, mobile gyroscope look-around, easy to theme to match your site |
| **Pannellum** | Free, open source | Similar, slightly older/less actively maintained than Photo Sphere Viewer |
| **Matterport** | Expensive (per-scan + monthly hosting fees) | Best-in-class for real estate (full 3D dollhouse view, measurements) but likely overkill on cost for land estates versus a photo-based tour |

**Recommendation: Photo Sphere Viewer.** It's free, works well on mobile (including gyroscope-based looking around by tilting the phone), and supports the multi-point hotspot navigation you'll want once you have more than one capture point per estate.

### Data model changes needed

Add to `Property` in `src/types/index.ts`:
```
tourImages?: { url: string; label: string; hotspots?: { yaw: number; pitch: number; targetId: string }[] }[];
```
Each entry is one 360° photo (e.g., "Entrance", "Field Center", "Water Source") with optional clickable hotspots that jump to another capture point — this is what makes it feel like a real walkthrough rather than one static panorama.

### Build steps

1. Add the `tourImages` field to the type definition and Supabase schema.
2. Install `photo-sphere-viewer` (+ its React wrapper).
3. Replace `VRTourModal.tsx`'s static image with a real Photo Sphere Viewer instance:
   - Drag to look around (desktop) / tilt to look around (mobile, via device gyroscope).
   - Hotspot markers to jump between capture points on the same estate, if more than one exists.
   - Graceful fallback: if an estate has no `tourImages` yet, show the existing photo gallery instead of a fake "VR" label — don't claim a 360° tour exists until it genuinely does.
4. Relabel the feature honestly per-estate: only show the "360° Tour" button on estates that actually have `tourImages`; other estates just get the regular photo gallery.
5. Add an upload flow to the admin panel for these images (or, simplest to start: manually upload to Supabase storage and paste URLs in for the first pilot batch).

### Effort estimate
Roughly 2–3 days of development once photos exist. The photography itself (equipment purchase or hiring a service, plus the actual site visits) is the longer lead time — plan that in parallel with development, not after it.


## Suggested Rollout Order

1. **Week 1:** Decide camera-purchase vs. hire-a-service for 360° photography; get coordinates for existing estates (you likely know these already or can pull them from Google Maps per address).
2. **Week 1–2 (parallel):** Build the real map (Part 1) — this has no external dependency once coordinates exist, so it can ship first.
3. **Week 2:** Shoot 360° photos for 2–3 flagship estates as a pilot (e.g., the Mahabalipuram Teak Estate, since it's your highest-value listing).
4. **Week 2–3:** Build the Photo Sphere Viewer integration (Part 2) against the pilot estate's photos.
5. **Week 3+:** Expand 360° photography to remaining estates as site visits happen naturally; each new estate just adds `tourImages` data, no further code changes needed.

This order gets the map live fastest (pure engineering, no photography dependency) while the 360° photography — the slower, non-code part — happens in parallel rather than blocking everything else.
