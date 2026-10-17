# Private OSM candidate research (pilot)

This tool creates an **internal, unverified candidate list** for Khénifra, Fès and Meknès. It does not modify the public website, publish profiles, send messages, validate a business, or ingest wedding-help customer data.

## Run (Python 3.10+, no dependencies)
Export a **small** Overpass JSON test, then run:

```sh
python3 tools/osm_vendor_pilot.py --city khenifra --input /path/to/sample.json --db /private/path/vendors.sqlite3
```

An explicitly authorized one-off fetch can be run with:

```sh
python3 tools/osm_vendor_pilot.py --city khenifra --fetch --contact-email operator@example.com --db /private/path/vendors.sqlite3
```

Use this sparingly: public Overpass has limited shared capacity. Never run a scheduled bulk scrape against the public endpoint; use regional OSM extracts or dedicated infrastructure for recurring/broad research. This is **not a production crawler**.

The importer takes only OSM element ID/type, commercial name, category, approximate coordinates, public business website and provenance. It intentionally does not ingest telephone numbers, person names, emails, reviews, or customer data. Candidate statuses remain `unverified`, and there is **no auto-publish**.

## Security
- Store the SQLite file **outside GitHub Pages and outside the repository** on a private server. Never commit it or upload it to a publicly served directory.
- The default `private-data/` path is only for local development; the entire directory is gitignored.
- No admin HTTP route or unauthenticated browser UI is included; all review is local/server-side pending production authentication and RBAC.
- Check candidate records with human review and confirm suitability before any public listing; don't claim that all OSM businesses offer weddings.
- Keep OSM-sourced data separately identifiable. Public use of an OSM-derived database may impose ODbL share-alike obligations even if original source is not visible; **private admin storage does not override the license**. Attribute © OpenStreetMap contributors, ODbL where applicable.
- If operating in Morocco, review data protection obligations before importing personal information or contacting providers.

## Validation
```sh
python3 -m py_compile tools/osm_vendor_pilot.py
python3 tools/osm_vendor_pilot.py --help
```

Next phase: a *separate* server-authenticated review dashboard and a manually approved public publishing process. No connection to live Supabase or accounts is made by this pilot.
