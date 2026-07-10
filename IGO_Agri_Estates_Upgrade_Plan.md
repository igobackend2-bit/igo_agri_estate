IGO Agri Estates — Website Upgrade Plan
Full Audit & Roadmap to a Production-Grade, Professional Platform

Prepared: July 2026


## How to read this

The site already looks professional and the SEO/performance/accessibility groundwork is solid (recent work brought Accessibility, SEO metadata, image/video compression, and Core Web Vitals fixes into place — pending redeployment). This plan goes one level deeper: it looks at what happens *behind* the polished UI, and several core flows currently simulate real functionality rather than perform it. That distinction matters because customers are currently shown "success" screens for things that haven't actually happened yet (a payment, a document review, a 360° tour). Closing that gap is the single biggest thing that will make this feel like a real institutional platform rather than a demo.

Items are grouped by priority: **Critical** (money, data, and trust — fix before more customers rely on this), **High** (core feature depth expected of a serious real-estate platform), **Medium** (compliance and growth), and **Polish** (nice-to-have refinement). A suggested phased rollout is at the end.


## Critical Priority — Fix Before Scaling

### 1. Payment flow is not real
The "Reserve Estate" flow (booking token payment) collects card details in plain form fields and, on clicking Pay, jumps straight to a "Payment Successful" screen with a hardcoded transaction ID. No payment gateway is actually called — nothing is charged, and no real transaction record is created. If any real customer has gone through this flow believing they'd paid a reservation token, that needs to be checked manually right away, since the system has no record of it either way.

**Fix:** Integrate a real payment gateway (Razorpay is the natural fit for an India-based platform — supports UPI, cards, netbanking; Stripe is the alternative if international customers are expected). This requires a small backend/serverless function to create orders and verify payment signatures — card details should never touch your own frontend code directly.

### 2. Data is not durable — it lives in the visitor's browser
Right now, user accounts, leads, saved favorites, admin-entered properties (when Supabase isn't reachable), and notifications are stored in the browser's localStorage rather than a real database. This means: a customer who signs up on their phone won't see their account on their laptop; clearing browser cache deletes their history entirely; and nothing survives a device change. Supabase is already wired into the project (real credentials are configured), but the code still has a "fall back to localStorage" path everywhere as a safety net — meaning if the Supabase connection ever hiccups, the app quietly starts operating on fake, non-synced local data without telling anyone.

**Fix:** Confirm Supabase is the sole source of truth in production (remove or clearly flag the localStorage fallback so it's only ever a dev-mode convenience), and audit that every write path (signup, leads, property CRUD, favorites) is actually hitting the database, not silently degrading to local storage.

### 3. Admin panel security is thin
The admin dashboard is protected by a single password stored in local settings — there's no per-admin account, no role separation (owner vs. editor vs. viewer), and no audit trail of who changed or deleted a listing. For a platform handling property listings and lead data, this is a meaningful exposure if that password ever leaks.

**Fix:** Move admin auth onto Supabase Auth with real admin user accounts and role-based permissions, and log admin actions (who edited/deleted what, and when).


## High Priority — Core Feature Depth

### 4. "AI" features don't call an AI
The Document Assistant, the AI Investment Report, and parts of the Valuation Simulator all currently show a loading spinner for a couple of seconds and then return a pre-written canned response — there's no actual language model or computation behind the "AI" framing. This is fine as a placeholder, but the moment a customer asks something that doesn't match the canned script, the illusion breaks.

**Fix:** Wire these into a real LLM API (Claude or another provider) for the Document Assistant's Q&A, and use the Valuation Simulator's existing formula-based logic openly rather than as "AI" — or enrich it with real comparable-sales data if that's available. This also meaningfully helps your GEO (AI-search-engine visibility) story, since a real, well-grounded assistant is more citable than a scripted one.

### 5. Live chat is a scripted bot, not real support
The chat widget matches keywords like "roi" or "human agent" against a small hardcoded list and returns fixed text — there's no real handoff to a human agent, no ticketing, and no persistence of the conversation.

**Fix:** At minimum, connect the "talk to a human" path to a real channel (WhatsApp Business API click-to-chat is a very natural fit for an India-based real estate business and is low-effort to wire in). For a fuller solution, a proper live-chat provider (Intercom, Tawk.to, Crisp) or a real support inbox would replace the scripted bot entirely.

### 6. "360° VR Tour" is a static photo, not a tour
The VR Tour modal shows one still image with a hover-zoom effect and the label "Live 360° Immersive Mode" — there's no actual panorama, no drag-to-look-around interaction. This is the kind of gap that damages trust quickly if a serious buyer expects what the label promises.

**Fix:** Either integrate real 360° photography (a service like Pannellum or a simple 360-photo viewer is inexpensive to add once you have actual panoramic images shot on-site) or relabel the feature honestly (e.g., "Photo Gallery" / "Drone Flyover") until real 360° capture is available for a given estate.

### 7. Map search is a static SVG grid, not a real map
"View Map" currently renders a stylized grid graphic, not an actual interactive map. Serious land buyers expect to see real geographic location, satellite/terrain view, and distance to roads/market/water sources.

**Fix:** Integrate Google Maps or Mapbox with real pins per estate (lat/long), ideally with satellite view toggle given this is agricultural land where terrain matters.

### 8. Search is solid but could go further
Location and category filtering now works correctly (recently fixed), and full-text search exists. What's missing for a platform at this stage: price-range and size-range sliders, sort by price/ROI/size, and a saved-search/alert feature ("notify me when a new estate matches X").

**Fix:** Add range filters and sorting to the Listings page; saved searches can be a Phase 2 item once accounts are on real backend storage (see #2).


## Medium Priority — Trust, Compliance & Growth

### 9. No customer reviews or social proof
There's no testimonial/review system anywhere — no AggregateRating schema, no real customer quotes tied to actual transactions. For a platform asking people to invest in land, third-party trust signals (verified buyer reviews, case studies with real numbers) matter more than most other content on the site.

**Fix:** Add a lightweight reviews/testimonials feature (even a simple admin-curated set of verified case studies to start), and mark it up with Review/AggregateRating schema — this also directly helps SEO rich results and GEO citability.

### 10. No cookie consent / limited legal compliance
There's a Policy page but no cookie consent banner, no RERA registration number surfaced anywhere (relevant for Indian real estate marketing), and the legal terms are fairly generic marketing-style copy rather than binding terms of service.

**Fix:** Add a cookie consent banner (especially once analytics is added — see #11), get the actual RERA number(s) for listed projects onto the Policy/Contact pages, and have terms of service reviewed by legal counsel rather than treated as marketing copy — I can't give legal advice here, just flagging the gap.

### 11. No analytics currently live
Google Analytics/GA4 and Search Console were intentionally skipped in earlier work at your direction. Without this, you have no visibility into how visitors actually use the site (which estates get views, where people drop off in the funnel, which channels bring traffic).

**Fix:** When ready, wire up GA4 + Search Console (I can do this in under an hour once you provide a GA4 measurement ID / verification code) — this is a prerequisite for measuring whether any of the other upgrades in this plan actually move the needle.

### 12. Notifications don't reach people off-site
Notifications are in-app/localStorage only — no email confirmations (e.g., "your reservation is confirmed", "new estate matches your search"), no SMS, no WhatsApp updates.

**Fix:** Add transactional email at minimum (Resend, Postmark, or Supabase's built-in email) for signup confirmation, lead submission acknowledgment, and reservation confirmation. WhatsApp Business API notifications would be a strong differentiator for an India-focused audience.


## Polish — Worth Doing, Lower Urgency

### 13. No PWA / installability
`index.html` references a `site.webmanifest` file that doesn't actually exist in the project, so that reference currently 404s quietly. There's no service worker, so the site can't be "installed" to a phone home screen or work offline even partially.

**Fix:** Add a real web manifest + icons and a basic service worker (Vite has a PWA plugin that makes this straightforward) — useful for returning visitors and mobile engagement.

### 14. Mobile experience should get a dedicated pass
The design is responsive, but a platform at this stage benefits from a deliberate mobile-only review pass (not just "does it not break," but "is this delightful on a phone") — particularly the property gallery, filters, and reservation flow, since a large share of Indian real-estate browsing happens on mobile.

### 15. Dark mode / accessibility refinement
Now that the accessibility basics (aria-labels, form linkage, contrast) are fixed, a further pass on color contrast ratios site-wide and optional dark mode would round out a "professional and advanced" feel, though this is cosmetic rather than functional.

### 16. Continue the SEO/performance work already in motion
Once the current fixes are redeployed, re-run PageSpeed Insights to confirm the real scores (last measured: Performance 69, Accessibility 65, Best Practices 96, SEO 92, pre-fix). Image formats could go further (WebP/AVIF instead of compressed JPEG/PNG) for another meaningful Performance bump.


## Suggested Phased Rollout

**Phase 1 (protect money & trust — do first):**
Real payment gateway (#1) → confirm Supabase as sole data store (#2) → admin security hardening (#3).

**Phase 2 (make the "advanced" features actually work):**
Real map integration (#7) → real 360°/photo tour or honest relabeling (#6) → WhatsApp/human chat handoff (#5) → transactional email (#12).

**Phase 3 (credibility & growth):**
Reviews/testimonials + schema (#9) → GA4 + Search Console (#11) → cookie consent + RERA/legal review (#10) → real AI integration for Document Assistant (#4).

**Phase 4 (polish):**
Range filters/sorting/saved searches (#8) → PWA/manifest (#13) → dedicated mobile pass (#14) → WebP/AVIF images + dark mode (#15, #16).


## Bottom line

The visual design, SEO foundation, and core browsing/search experience are already in good shape. The gap between "looks professional" and "is professional" is almost entirely in the backend: payments, data durability, and a few features (VR tour, AI assistant, live chat, maps) that currently perform a convincing simulation rather than the real thing. Closing the Critical and High priority items above is what will make this feel like an institutional-grade platform rather than a well-designed demo.
