# MarocVows private vendor review

The existing OSM collector produces **unverified candidate records**, not public listings. This PR introduces a **local administrator CLI**, not an internet-accessible dashboard. Keeping it server-side prevents accidentally exposing the inventory through GitHub Pages.

## Preconditions
- Store SQLite **outside** GitHub Pages, served paths, shared mounts and public repositories.
- Restrict the directory to 0700 and database to 0600, on an operating-system account restricted to authorized administrators.
- Make an encrypted database backup with access limited to administrators.
- Import candidate data separately using `tools/osm_vendor_pilot.py`.
- No client-side service role keys, public API endpoints or automated publishing.

## Commands

```sh
python3 tools/private_vendor_review.py --db /secure/private/vendors.sqlite3 list --city khenifra
python3 tools/private_vendor_review.py --db /secure/private/vendors.sqlite3 list --priority high
python3 tools/private_vendor_review.py --db /secure/private/vendors.sqlite3 set-status --osm-key node/123 --status reviewing --reason "Checking whether this venue hosts weddings"
```

Mark `verified` only after real-world confirmation of business identity and suitability; it **does not publish** a public profile. A status change is recorded in the `review_audit` table.

## Production phase gate
1. Revalidate data source terms (OpenStreetMap ODbL) and operator privacy obligations.
2. Identify hosting environment and configure backup, admin account, network restrictions and monitoring.
3. Choose authenticated backend architecture for a future dashboard and apply least-privilege access controls.
4. Perform authorization tests proving unauthenticated visitors cannot read internal candidates.
5. Test wedding-help consent and RLS separately, without enabling portal flags by default.

This CLI is for internal proof-of-concept only. It is **not** a production authentication solution. Do not expose an HTTP endpoint for it.
