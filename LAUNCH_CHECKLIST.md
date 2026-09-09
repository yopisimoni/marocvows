# MarocVows — Launch Checklist

## Public browsing — ready

- [x] Dedicated `yopisimoni/marocvows` production repository
- [x] Root production homepage
- [x] 25 pilot caterer listings across Khénifra, Fès and Meknès
- [x] English, Arabic RTL, French and Spanish UI for the public directory
- [x] Search, city filter and rating-aware sorting
- [x] Direct phone and Google Maps actions
- [x] MarocVows branding and favicon
- [x] About, Privacy, Terms, Community Guidelines and Contact pages
- [x] Final-domain canonicals and sitemap
- [x] `robots.txt`
- [x] `CNAME` = `www.marocvows.com`
- [x] Custom 404 page
- [x] No advertising or behavioural tracking
- [x] Wedding-help and provider-application entry points added to the homepage
- [x] `account.html`, `wedding-help.html` and `provider-submit.html` built as prelaunch/noindex pages
- [x] Community and portal data collection remain gated until privacy/auth launch checks are complete

## Backend security — verified 9 Sep 2026

- [x] Supabase project `morocco-wedding-guide` is active and healthy
- [x] Production frontend uses the current Supabase publishable key, not a service-role secret
- [x] RLS enabled on `reviews`, `vendor_photos` and `reports`
- [x] Review/photo/report inserts restricted to authenticated owners
- [x] Approved-only public reads for reviews and vendor photos
- [x] One review per authenticated user/vendor enforced at database level
- [x] Review, report and photo metadata have database length/status/value constraints
- [x] `vendor-photos` bucket is private
- [x] Vendor photo uploads limited to JPEG/PNG/WebP and 8 MB
- [x] Added `wedding_requests` with authenticated-owner RLS policies
- [x] Added `provider_applications` with authenticated-owner RLS policies and moderation status
- [x] Provider categories include caterer, venue, planner, cook, DJ, photo/video, decor, music, florist, beauty, henna, transport, cake/pastry, rentals and other
- [x] Supabase security advisor reports zero security lints after the new schema migration
- [x] Community features remain disabled in `config.js`
- [x] New account/submission portal remains disabled with `portalFeaturesEnabled:false` until production launch gates pass

## Domain publishing — current status

- [x] GitHub Settings → Pages → Deploy from a branch → `main` / `(root)`
- [x] GitHub Pages custom domain = `www.marocvows.com`
- [x] DNS `CNAME` for `www` → `yopisimoni.github.io`
- [x] Apex `@` A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- [x] DNS check successful in GitHub Pages
- [x] TLS certificate issued and Enforce HTTPS enabled
- [ ] Confirm `https://www.marocvows.com/` returns the live MarocVows homepage after propagation
- [ ] Confirm `https://marocvows.com` redirects to `https://www.marocvows.com/` after propagation

Verification note, 9 Sep 2026: GitHub Pages, DNS validation and HTTPS are configured. The apex domain briefly returned GitHub's generic 404 during propagation, so final live redirect verification is still required before Google submission.

## Before account/submission portal is enabled

- [ ] Create a monitored MarocVows contact/privacy email
- [ ] Publish final operator/data-controller identity
- [ ] Complete applicable privacy/CNDP and cross-border processing formalities
- [ ] Update the Privacy Policy and Terms for wedding-help requests and provider applications
- [ ] Set Supabase Auth Site URL to `https://www.marocvows.com/`
- [ ] Add the required production redirect URL(s), including `https://www.marocvows.com/account.html`
- [ ] Test email/password account creation and email confirmation on desktop and mobile
- [ ] Test email/password sign-in and sign-out
- [ ] Test wedding request → private database row → user history
- [ ] Test provider application → private pending row → user history
- [ ] Add anti-spam/rate-limit controls appropriate for launch traffic
- [ ] Only then change `portalFeaturesEnabled` to `true`

## Before community reviews/photos/reports are enabled

- [ ] Complete the same privacy/contact/auth launch gates above
- [ ] Test magic-link signup if retained for community contributions, or consolidate onto the password account flow
- [ ] Test review → pending → approved → stars
- [ ] Test JPEG/PNG/WebP upload ≤ 8 MB → moderation → display
- [ ] Test private report submission
- [ ] Verify anti-abuse and rate limits under real authenticated traffic before opening at scale
- [ ] Only then change `communityFeaturesEnabled` to `true`

## Before Google Search Console / sitemap submission

- [ ] Final live check: `www` homepage returns 200 over HTTPS
- [ ] Final redirect check: apex → canonical `www` HTTPS URL
- [ ] Crawl all indexable pages for 404s, broken internal links and accidental `noindex`
- [ ] Confirm `robots.txt` returns 200 and references the production sitemap
- [ ] Confirm `sitemap.xml` returns 200 and contains only canonical, indexable URLs
- [ ] Check title, description, canonical, mobile layout and structured data on the homepage
- [ ] Verify all 25 listed providers against current public information before asking Google to crawl
- [ ] Do not submit the account/provider prelaunch pages while they remain `noindex`

## Tracking

- [x] GitHub issue #1 created as the single P0 production launch gate
- [x] Issue assigned to `yopisimoni` and labelled `launch` + `production`

## Expansion rule

Keep Khénifra, Fès and Meknès as the quality pilot. Expand only after the workflow is proven, then prioritize Casablanca, Rabat, Marrakech, Tanger, Agadir, Oujda, Tétouan, Kénitra and El Jadida.
