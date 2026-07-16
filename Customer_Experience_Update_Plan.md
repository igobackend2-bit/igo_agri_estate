IGO Agri Estates — Customer (Cx) Experience Update Plan

Prepared: July 2026


## How this is organized

This plan walks the actual customer journey — Discover → Research & Trust → Contact → Book & Pay → After Purchase — and flags where the experience is solid, where it's broken or half-built, and where something is simply missing. Two genuinely broken features were found while preparing this (not previously flagged) — those are called out first since they're currently visible, clickable, and do nothing, which is a worse experience than not having the feature at all.


## Fix first — features that exist but don't work

**1. "Compare ROI" button does nothing**
On every property details page there's a "Compare ROI" button (next to "Request Drone Tour") with no click handler at all — customers tap it and nothing happens.

**2. The estate comparison feature has no destination**
On the Listings page, customers can tick up to 3 estates to compare (a "Comparing 2/3" badge appears), but there is no comparison view anywhere in the app — the only thing the badge lets you do is clear the selection. A customer can select estates to compare and then hit a dead end.

**Fix:** Build one real comparison table/page — side-by-side price, size, ROI, water source, soil type, features — and wire both the Listings page badge and the PropertyDetails "Compare ROI" button to it. This is pure frontend (all the data is already loaded client-side); no backend needed. This is a same-week fix and probably the single highest-value item in this plan, since it's a completely built customer intent (people are already clicking "compare") that currently leads nowhere.

**3. Brochure download isn't shown**
The data model already has a `brochureUrl` field per estate, but it's never rendered on the property details page — so even where a PDF brochure exists, customers can't get to it.

**Fix:** Add a "Download Brochure" button on PropertyDetails wherever `brochureUrl` is present.


## Discover — browsing & finding the right estate

**Already solid:** location + category filtering (recently fixed), full-text search, favorites, recently-added sections.

**4. Real map view**
The "View Map" toggle on Listings currently shows a decorative mockup with fake pins. Every estate now has real latitude/longitude in the data (added this session) — the next step is swapping that mockup for a real interactive map (Mapbox/Leaflet) with real pins. This was already scoped in detail in an earlier plan; the data prerequisite is now done.

**5. Price/size/ROI range filters + sorting**
The data already carries `priceValue`, `roiValue`, `sizeValue` — add range sliders and a sort dropdown to Listings. Currently customers can only filter by location/category/keyword, not by budget or return expectations, which are usually the first two things a land buyer filters by.

**6. Urgency/scarcity signals**
Estates carry `totalUnits`/`availableUnits` (e.g., "4 of 12 available") but this isn't surfaced anywhere customer-facing — showing "Only 4 units left" on a card is a well-established, honest way to help genuinely interested buyers act rather than browse indefinitely.


## Research & Trust — deciding whether to commit

**Already solid:** FAQs per estate, detailed revenue model / setup scope / IGO support sections, soil & infrastructure data.

**7. Real customer testimonials**
No reviews or verified case studies anywhere on the site currently — for land investment specifically, third-party trust signals matter more than almost any other content. Even 3–5 real, named customer quotes with their estate and outcome would meaningfully change how the site feels.

**8. Real 360° tours / photo depth**
Covered in detail in an earlier plan — the current "VR Tour" is a single stock photo. Even without full 360° photography, simply adding more real on-site photos per estate (multiple angles, water source, access road) would be a lower-effort trust improvement in the meantime.

**9. Transparent, real ROI/valuation calculator**
The Valuation Simulator currently runs a basic formula rather than anything grounded in comparable sales — worth being upfront with customers about what it is (an estimate tool) rather than implying deeper analysis than it does.


## Contact — reaching out

**Already solid:** WhatsApp click-to-chat is real and pre-fills a message with the specific estate name (`PropertyDetails.tsx`, `LeadCaptureForm.tsx`); phone/email fallback works.

**10. Site visit scheduling**
Right now, "request a site visit" happens informally through the WhatsApp message text — there's no actual calendar/date picker. A simple "Pick a date for your site visit" widget (even without backend calendar sync, just captures a preferred date into the lead) would remove friction and signal a more organized operation.

**11. Live chat is scripted**
Covered in the earlier plan — worth reiterating here specifically because live chat is a Discover/Contact-stage touchpoint that currently can only handle a handful of hardcoded topics.


## Book & Pay — committing to an estate

**12. Real payment gateway**
Already flagged as the top Critical item in the earlier full audit — the "Reserve Estate" flow currently shows a fake success screen. This is the biggest trust risk in the entire customer journey: a customer who reaches the point of paying deserves a real transaction, not a simulated one.


## After Purchase — the relationship that keeps them as customers

This stage doesn't exist at all yet on the site, and it's worth calling out specifically because IGO's model is managed farming — customers are often buying land they won't personally visit often, and trusting someone else to care for it. That makes ongoing visibility into "how is my land doing" unusually valuable for this specific business, more so than for a typical real-estate platform.

**13. Customer portfolio / "my estate" dashboard**
A simple logged-in view showing: which estate(s) a customer owns, current status, and a timeline of updates (even manually posted by IGO staff — photos from a site visit, a note on crop progress) would be a strong differentiator and a reason for customers to keep coming back to the site rather than only interacting over WhatsApp.

**14. Document access**
A place for a customer to see/download their own agreement, RERA documents, and receipts tied to their purchase.

**15. Referral program**
Land investment is a high-trust, word-of-mouth-driven category — a simple "refer a friend" mechanism (even just a shareable link + manual tracking initially) could meaningfully lower acquisition cost given the existing customer base.


## Suggested priority order

1. **Fix the two dead features** (#1, #2) — they're currently live and broken; this is reputational, not aspirational.
2. **Brochure download** (#3) — trivial fix, immediate value.
3. **Range filters/sorting + urgency signals** (#5, #6) — fast, high-impact, no dependencies.
4. **Real map** (#4) — data is ready, this is now a pure build task.
5. **Testimonials** (#7) — needs you to supply a few real quotes, otherwise fast to build.
6. **Site visit scheduling** (#10) — meaningful friction reducer.
7. **Real payment gateway** (#12) — bigger effort, but the most important trust item in the whole plan.
8. **Customer portfolio dashboard** (#13) — the most distinctive, retention-driving idea here, but also the largest build; good candidate for a dedicated phase once the above is done.
9. Everything else (360° tours, live chat depth, referral program, document access) — valuable, no urgency.
