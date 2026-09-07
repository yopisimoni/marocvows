# MarocVows — Launch Checklist

## Public browsing — ready

- [x] Dedicated `yopisimoni/marocvows` production repository
- [x] Root production homepage
- [x] 25 pilot caterer listings across Khénifra, Fès and Meknès
- [x] English, Arabic RTL, French and Spanish UI
- [x] Search, city filter and rating-aware sorting
- [x] Direct phone and Google Maps actions
- [x] MarocVows branding and favicon
- [x] About, Privacy, Terms, Community Guidelines and Contact pages
- [x] Final-domain canonicals and sitemap
- [x] `robots.txt`
- [x] `CNAME` = `www.marocvows.com`
- [x] Custom 404 page
- [x] No advertising or behavioural tracking
- [x] Community collection gated until privacy/auth launch checks are complete

## Backend security — verified 7 Sep 2026

- [x] Supabase project `morocco-wedding-guide` is active and healthy
- [x] Production frontend uses the current Supabase publishable key, not a service-role secret
- [x] RLS enabled on `reviews`, `vendor_photos` and `reports`
- [x] Review/photo/report inserts restricted to authenticated owners
- [x] Approved-only public reads for reviews and vendor photos
- [x] One review per authenticated user/vendor enforced at database level
- [x] Review, report and photo metadata have database length/status/value constraints
- [x] `vendor-photos` bucket is private
- [x] Vendor photo uploads limited to JPEG/PNG/WebP and 8 MB
- [x] Supabase security advisor reports zero security lints
- [x] Community features remain disabled in `config.js` until production launch gates pass

## Domain publishing — remaining infrastructure

- [ ] GitHub Settings → Pages → Deploy from a branch → `main` / `(root)`
- [ ] GitHub Pages custom domain = `www.marocvows.com`
- [ ] DNS `CNAME` for `www` → `yopisimoni.github.io`
- [ ] Apex `@` A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- [ ] Wait for DNS/certificate validation, then enable Enforce HTTPS
- [ ] Confirm `https://marocvows.com` redirects to `https://www.marocvows.com`

Verification note, 7 Sep 2026: `www.marocvows.com` and apex `marocvows.com` did not resolve from the verification runtime, so domain/DNS/Pages/certificate setup is still treated as incomplete.

## Before community accounts/reviews are enabled

- [ ] Create a monitored MarocVows contact/privacy email
- [ ] Publish final operator/data-controller identity
- [ ] Complete applicable CNDP processing and cross-border formalities
- [ ] Set Supabase Auth Site URL to `https://www.marocvows.com/`
- [ ] Add `https://www.marocvows.com/**` or the required production redirect URL(s) to Supabase Auth Additional Redirect URLs
- [ ] Test magic-link signup on desktop and mobile
- [ ] Test review → pending → approved → stars
- [ ] Test JPEG/PNG/WebP upload ≤ 8 MB → moderation → display
- [ ] Test private report submission
- [ ] Verify anti-abuse and rate limits under real authenticated traffic before opening at scale
- [ ] Only then change `communityFeaturesEnabled` to `true`

## Tracking

- [x] GitHub issue #1 created as the single P0 production launch gate
- [x] Issue assigned to `yopisimoni` and labelled `launch` + `production`

## Expansion rule

Keep Khénifra, Fès and Meknès as the quality pilot. Expand only after the workflow is proven, then prioritize Casablanca, Rabat, Marrakech, Tanger, Agadir, Oujda, Tétouan, Kénitra and El Jadida.
