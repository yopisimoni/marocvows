# MarocVows — Operational Handoff
**Last verified:** 2026-10-19
**Status:** Active pilot; do not confuse infrastructure readiness with customer-ready service.

## Verified completed
- Public site repository: `yopisimoni/marocvows`, canonical site `https://www.marocvows.com/`.
- PR [#20](https://github.com/yopisimoni/marocvows/pull/20) merged: OpenStreetMap candidate importer, SQLite deduplication, source tagging, internal-only research.
- PR [#21](https://github.com/yopisimoni/marocvows/pull/21) merged: private review CLI, status audit, associated tests.
- PR [#22](https://github.com/yopisimoni/marocvows/pull/22) merged: experimental SSH-tunnel/loopback-only review dashboard.
- SSH access to the Contabo host using restricted `deploy` account tested successfully.
- Private SQLite candidate database placed outside public web paths on VPS; integrity check `ok`; directory and database permissions restricted.
- 1 on-host database backup verified (integrity `ok`), **not** an established automated/off-site backup policy.
- CLI list query on VPS succeeded.
- Dashboard listener restricted to `127.0.0.1`; unauthenticated request returned HTTP 401. Authenticated end-to-end web review **not verified**.
- As of 2026-10-19 audit: **16 OSM candidates, all Khénifra, all `low` priority, all `unverified`**. Records are primarily hotels/restaurants, **not verified wedding providers**.

## Unfinished / not verified
- OSM candidate discovery and wedding-specific taxonomy/quality improvements; avoid generic hotel/restaurant collection as a proxy for wedding supply.
- Import and qualify Fès and Meknès leads, with source attribution, deduplication and human checks.
- Verify real providers: category, suitability, public business presence and wedding service relevance; never auto-publish.
- Dashboard authenticated GET/POST, CSRF, permission, session/security and recovery testing; do not expose it publicly.
- Automated and off-host encrypted backup/recovery procedure; rotation, monitoring and operational hardening.
- End-to-end Supabase Auth and wedding-help workflow, operator contact/legal/CNDP readiness, privacy consent and abuse controls. Keep `portalFeaturesEnabled:false` and `communityFeaturesEnabled:false` pending launch gates.
- Google Search Console / GA4 real traffic and conversion baseline: not verified in this handoff.
- First genuine help request, vendor match, and revenue: no confirmed results.

## Priority queue
1. **MV-OSM-04 — Quality first.** Review queries and existing records, design wedding-specific categories, test with small OSM samples, prevent duplication; never scrape indiscriminately.
2. Complete authenticated dashboard security QA, repair and redeploy only if justified.
3. Expand vetted candidates in Fès / Meknès; keep source provenance and verification status private.
4. Harden backup/recovery on VPS without impacting other services.
5. Test a small privacy-compliant wedding-help request funnel after readiness gates; then measure organic/search/social traffic and requests.
6. Evaluate monetization only after genuine demand is evidenced.

## Guardrails for next session
- Read `AGENTS.md` and `.chatgpt/PROJECT_CONTROL.md` first.
- Keep MarocVows separate from MyFastOffer4U and other portfolio brands.
- Treat all OSM candidates as private, unverified and unsuitable for public display until approved.
- Do not upload database backups, credentials, SSH tokens or client data to GitHub.
- Avoid enabling authentication, publishing, outreach, or web dashboard exposure without specific QA and readiness.
- This file is a status record, not a claim that all functionality is production-ready.
