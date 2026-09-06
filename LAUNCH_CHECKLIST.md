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

## Domain publishing — remaining manual infrastructure

- [ ] GitHub Settings → Pages → Deploy from a branch → `main` / `(root)`
- [ ] GitHub Pages custom domain = `www.marocvows.com`
- [ ] DNS `CNAME` for `www` → `yopisimoni.github.io`
- [ ] Apex `@` A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- [ ] Wait for DNS/certificate validation, then enable Enforce HTTPS
- [ ] Confirm `https://marocvows.com` redirects to `https://www.marocvows.com`

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
- [ ] Add/verify anti-abuse and rate limits before opening at scale
- [ ] Only then change `communityFeaturesEnabled` to `true`

## Expansion rule

Keep Khénifra, Fès and Meknès as the quality pilot. Expand only after the workflow is proven, then prioritize Casablanca, Rabat, Marrakech, Tanger, Agadir, Oujda, Tétouan, Kénitra and El Jadida.
