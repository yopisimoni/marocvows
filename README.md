# MarocVows

Production repository for **https://www.marocvows.com/** — a multilingual Morocco wedding discovery platform.

## Launch scope

The public pilot starts with wedding/event caterers in:

- Khénifra
- Fès
- Meknès

Languages: English, Arabic (RTL), French and Spanish.

## Product rules

- Guests can browse, search, sort and contact providers without an account.
- Community ratings are based only on approved MarocVows reviews.
- Providers start as `New`; no fake or imported star scores.
- Reviews, photos and reports require an authenticated account when community features are enabled.
- New community submissions are moderated before publication.
- Paid placement must never silently alter the community star score.

## Review UX

The contribution flow is designed to take about 30 seconds:

1. choose 1–5 stars;
2. tap quick experience tags such as food, staff, timing, communication and value;
3. optionally add a short note;
4. submit for moderation.

Users can also upload a permitted photo or privately report incorrect information once accounts are enabled.

## Backend

Dedicated Supabase project: `morocco-wedding-guide`, region `eu-west-3` (Paris).

RLS is enabled for reviews, photo metadata and reports. The photo bucket is private. Only the public Supabase URL/publishable key belongs in frontend code; never expose a secret or service-role key.

`communityFeaturesEnabled` remains `false` until the final privacy/CNDP and Supabase Auth redirect steps are complete.

## Domain

Production domain: `www.marocvows.com`.

This repository contains a `CNAME` file for that hostname. The apex `marocvows.com` should redirect/resolve to the `www` production site through the domain DNS/provider configuration.

## Before enabling community submissions

- publish a monitored MarocVows privacy/contact email;
- publish the final operator/data-controller identity;
- complete applicable CNDP processing and cross-border data formalities;
- configure Supabase Auth Site URL and redirect URLs for `https://www.marocvows.com/`;
- test magic-link sign-in, review moderation, star aggregation, photo moderation and reports end to end;
- add abuse/rate-limit controls before opening at scale.

## Expansion

Do not create empty city pages for SEO. Prove the three-city pilot first, then expand with researched local coverage to Casablanca, Rabat, Marrakech, Tanger, Agadir, Oujda, Tétouan, Kénitra and El Jadida.
