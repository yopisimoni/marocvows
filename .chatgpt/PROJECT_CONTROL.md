# Project Control — MarocVows

## Canonical identity
- Project: MarocVows
- Repository: yopisimoni/marocvows
- Default branch: main
- Production URL: https://www.marocvows.com/
- Domain project: marocvows.com
- Purpose: multilingual Morocco wedding discovery platform.
- Current CNAME: www.marocvows.com

## Scope boundaries
- MarocVows is completely separate from MyFastOffer4U and all of its subdomains.
- Do NOT reuse MyFastOffer4U analytics IDs, content, DNS assumptions, forms, SEO settings, or branding.
- Do NOT mix this repo with unrelated social-content projects.

## Product protections
- Preserve multilingual behavior (English, Arabic/RTL, French, Spanish).
- Preserve moderation/account/privacy gates unless explicitly changed.
- Do not invent provider ratings or silently change review integrity rules.
- Treat authentication, Supabase configuration, user submissions, and privacy-sensitive flows as protected.

## Deployment protocol
1. Read this file.
2. Inspect the current repo and CNAME.
3. Check production when the task concerns the live site.
4. Make the smallest safe change.
5. Commit.
6. Verify GitHub Pages/deployment status when applicable.
7. Check https://www.marocvows.com/ after deployment-related changes.

## Definition of done
- correct repo used;
- change committed;
- deployment/live site verified when applicable;
- multilingual behavior preserved;
- no unrelated project identifiers introduced;
- no obvious regression.


## Account launch state
- Public directory remains independent from account/community features.
- `portalFeaturesEnabled` controls account access and authenticated wedding-help/provider flows.
- `communityFeaturesEnabled` separately controls reviews, photos, reports and other community submissions.
- Account UI must use `data-portal-only`; community UI must use `data-community-only`.
- Passwordless auth is the intended production model: email magic link as baseline, optional Google/Facebook OAuth, and optional WhatsApp OTP through Supabase + Twilio/Twilio Verify.
- Quick sign-in/sign-up should open in a lightweight modal/popup from the public site; account creation and sign-in share the same passwordless flows.
- Never show an auth provider as active unless its backend provider configuration is complete and tested.
- Keep `portalFeaturesEnabled:false` until applicable CNDP processing/transfer formalities and Supabase Auth production redirect configuration are complete.
- Keep `communityFeaturesEnabled:false` until moderation, abuse controls and community-specific launch gates pass.


## Localization architecture
- Shared public-site language layer: `/i18n.js`.
- Supported languages: English, Arabic, French and Spanish.
- Shared preference key: `marocvows-lang`.
- Arabic must set `document.documentElement.dir = "rtl"`; all other languages use LTR.
- New public marketplace pages must load `/i18n.js`.
- Provider names, addresses, phone numbers, URLs and other proper/business identifiers are not translated.
- Dynamic marketplace controls must either use the shared layer or call `MarocVowsI18n.apply(...)` after rendering.
- Existing legal/auth dictionaries may coexist during migration, but shared language state must remain synchronized through `marocvows-lang`.
- Do not claim multilingual live QA complete until EN → AR → FR → ES switching is checked on the deployed site.


## Service taxonomy
- Canonical service source: `/service-catalog.js`.
- The shared catalog currently contains 19 service categories: venue, caterer, planner, negafa, cook, DJ, band/traditional music, photographer, videographer, decorator, florist, beauty, henna, cake/pastry, transport, rentals, invitations/gifts, entertainment and other.
- Directory filters, planner, member onboarding, wedding-help requests and provider applications must use this catalog instead of maintaining independent category lists.
- Provider names and existing provider records remain unchanged; adding a new provider category should use one of the canonical service IDs.
- Planner event types are also defined in `/service-catalog.js`; the legacy onboarding value `party` is preserved for compatibility.
- Planner recommendations must be filtered by actual provider supply in the selected city and remain user-editable.
