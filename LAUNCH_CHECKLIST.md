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

## Backend security — verified 10 Sep 2026

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
- [x] Optimized new RLS policies to avoid per-row `auth.uid()` reevaluation warnings
- [x] Supabase security advisor reports zero security lints
- [x] Community features remain disabled in `config.js`
- [x] New account/submission portal remains disabled with `portalFeaturesEnabled:false` until production launch gates pass

## Domain publishing — current status

- [x] GitHub Settings → Pages → Deploy from a branch → `main` / `(root)`
- [x] GitHub Pages custom domain = `www.marocvows.com`
- [x] DNS `CNAME` for `www` → `yopisimoni.github.io`
- [x] Apex `@` A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- [x] DNS check successful in GitHub Pages
- [x] TLS certificate issued and Enforce HTTPS enabled
- [x] `https://www.marocvows.com/` is the live production homepage
- [x] `https://marocvows.com` redirects to `https://www.marocvows.com/`

Verification note: canonical production host is permanently `https://www.marocvows.com/`. GitHub Pages DNS validation and Enforce HTTPS are configured, and the apex redirects to the canonical www host. Do not reopen www-vs-apex as a launch question unless a future production regression is observed.

## Before account/submission portal is enabled

- [x] Create monitored MarocVows contact/privacy emails: `hello@marocvows.com` and `privacy@marocvows.com`
- [x] Publish those monitored addresses on the Contact and Privacy pages
- [x] Publish project identity: MarocVows is founded and managed by Simohamed Amara in Morocco
- [ ] Confirm final legal data-controller designation and complete any applicable Moroccan privacy/CNDP and cross-border processing formalities before public account collection at scale
- [x] Update Privacy Policy for account data, wedding-help requests, provider applications, service providers, sharing and retention
- [x] Update Terms for wedding guidance, provider applications, accounts, moderation, listings and current no-payment model
- [x] Add explicit Terms/Privacy acknowledgement to account creation, wedding-help requests and provider applications
- [x] Set Supabase Auth Site URL to `https://www.marocvows.com/`
- [x] Add production redirect URLs: `https://www.marocvows.com/account.html` and `https://www.marocvows.com/`
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

- [x] Canonical `www` homepage is live over HTTPS
- [x] Apex redirects to canonical `https://www.marocvows.com/`
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
