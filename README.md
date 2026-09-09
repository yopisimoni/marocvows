# MarocVows

Production repository for **https://www.marocvows.com/** — a multilingual Morocco wedding discovery platform.

## Launch scope

The public directory pilot starts with wedding/event caterers in:

- Khénifra
- Fès
- Meknès

Languages: English, Arabic (RTL), French and Spanish.

The product also includes two prelaunch service flows:

- **Wedding help** — couples/families can eventually sign in and send their city, date, guest count, budget range and requested services so MarocVows can help them build a shortlist.
- **Provider applications** — caterers, venues, planners, cooks, DJs, photographers, videographers, decorators, musicians, florists, beauty/henna professionals, transport, cake/pastry businesses, rentals and other wedding services can apply for review.

Those account/submission pages are currently `noindex` and gated until privacy/contact and production authentication checks are complete.

## Product rules

- Guests can browse, search, sort and contact listed providers without an account.
- Community ratings are based only on approved MarocVows reviews.
- Providers start as `New`; no fake or imported star scores.
- Provider applications never publish automatically; they remain private until reviewed.
- Wedding-help requests remain private to the submitting account and MarocVows moderation/operations.
- Reviews, photos and reports require an authenticated account when community features are enabled.
- New community submissions are moderated before publication.
- Paid placement must never silently alter the community star score.

## Account and submission portal

`account.html` supports an email + password account flow through Supabase Auth.

`wedding-help.html` writes authenticated requests to `wedding_requests`.

`provider-submit.html` writes authenticated applications to `provider_applications`.

Both tables use Row Level Security so authenticated users can submit and read only their own records. Provider applications start as `pending`; wedding-help requests start as `new`.

`portalFeaturesEnabled` remains `false` until launch gates pass.

## Review UX

The community contribution flow is designed to take about 30 seconds:

1. choose 1–5 stars;
2. tap quick experience tags such as food, staff, timing, communication and value;
3. optionally add a short note;
4. submit for moderation.

Users can also upload a permitted photo or privately report incorrect information once community features are enabled.

## Backend

Dedicated Supabase project: `morocco-wedding-guide`, region `eu-west-3` (Paris).

RLS is enabled for reviews, photo metadata, reports, wedding-help requests and provider applications. The photo bucket is private. Only the public Supabase URL/publishable key belongs in frontend code; never expose a secret or service-role key.

`communityFeaturesEnabled` and `portalFeaturesEnabled` remain `false` until the final privacy/CNDP and Supabase Auth production steps are complete.

## Domain

Production domain: `www.marocvows.com`.

This repository contains a `CNAME` file for that hostname. GitHub Pages is configured from `main` / `(root)`, DNS validation has passed and Enforce HTTPS is enabled. The apex `marocvows.com` should redirect to the `www` production site after DNS/Pages propagation is complete.

## Before enabling account submissions

- publish a monitored MarocVows privacy/contact email;
- publish the final operator/data-controller identity;
- complete applicable privacy/CNDP and cross-border data formalities;
- update Privacy/Terms for wedding-help requests and provider applications;
- configure Supabase Auth Site URL and production redirect URLs;
- test email/password signup, confirmation, sign-in, sign-out and both submission flows end to end;
- add abuse/rate-limit controls before opening at scale;
- then set `portalFeaturesEnabled:true`.

## Before enabling community submissions

- complete the same privacy/contact/auth launch gates;
- test the chosen community authentication flow;
- test review moderation, star aggregation, photo moderation and reports end to end;
- add abuse/rate-limit controls before opening at scale;
- then set `communityFeaturesEnabled:true`.

## Expansion

Do not create empty city pages for SEO. Prove the three-city pilot first, then expand with researched local coverage to Casablanca, Rabat, Marrakech, Tanger, Agadir, Oujda, Tétouan, Kénitra and El Jadida.
