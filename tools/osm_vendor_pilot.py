#!/usr/bin/env python3
"""Private OSM vendor research pilot. Python 3.10+, standard library only.

Fetch is OFF by default. Import supplied Overpass JSON using --input, or use
--fetch with a single named city and --contact-email identifying your operator.
No customer data, individual contact names or OSM contributor metadata are stored.
"""
import argparse
import json
import os
import re
import sqlite3
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CITIES = {
    "khenifra": (32.94, -5.67, 0.115),
    "fes": (34.06, -4.99, 0.135),
    "meknes": (33.89, -5.55, 0.130),
}
# Broad commercial categories are only candidate leads, not proof of wedding services.
FILTER = '["name"]["shop"~"^(photo|florist|jewelry|beauty)$"]'
OTHER = '["name"]["amenity"~"^(events_venue|restaurant|community_centre)$"]'
TOURISM = '["name"]["tourism"="hotel"]'
SCHEMA = """
CREATE TABLE IF NOT EXISTS candidates (
    osm_key TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    lat REAL, lon REAL,
    website TEXT,
    source TEXT NOT NULL DEFAULT 'OpenStreetMap contributors (ODbL)',
    review_priority TEXT NOT NULL DEFAULT 'low',
    status TEXT NOT NULL DEFAULT 'unverified'
       CHECK(status IN ('unverified','reviewing','verified','rejected')),
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS candidates_city_status ON candidates(city,status);
"""
def query(city):
    lat, lon, radius = CITIES[city]
    # A limited city bounding box; avoid municipal area-wide repeated crawling.
    bbox = f"({lat-radius:.4f},{lon-radius:.4f},{lat+radius:.4f},{lon+radius:.4f})"
    return "[out:json][timeout:40];(" + "".join(
        "nwr" + expr + bbox + ";" for expr in (FILTER,OTHER,TOURISM)
    ) + ");out center;"

def fetch(city, email):
    if not email or "@" not in email:
        raise ValueError("--contact-email is required for network requests")
    body = urllib.parse.urlencode({"data":query(city)}).encode()
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter", data=body,
        headers={"User-Agent":f"MarocVows-private-research/0.1 ({email})",
                 "Content-Type":"application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=65) as response:
        return json.load(response)

def priority(name, category, tags):
    """Heuristic review queue only: not proof of wedding capability."""
    text = " ".join((name, tags.get("description", ""), tags.get("name:fr", ""), tags.get("name:ar", ""))).lower()
    if category == "amenity:events_venue" or re.search(r"mariage|wedding|traiteur|salle des f[eê]tes|قاعة|أعراس|حفلات", text):
        return "high"
    if category in ("shop:photo","shop:florist","shop:jewelry","shop:beauty"):
        return "medium"
    return "low"

def normalize(record, city):
    tags = record.get("tags") or {}
    name = (tags.get("name") or "").strip()
    if not name or record.get("type") not in ("node","way","relation"):
        return None
    # Do not ingest phone, email, personal names, or free-text descriptions.
    center = record.get("center") or record
    category = next((f"{k}:{tags[k]}" for k in ("amenity","shop","tourism") if k in tags),"other")
    website = tags.get("website") or tags.get("contact:website") or ""
    if not website.startswith(("https://","http://")):
        website = ""
    return (f'{record["type"]}/{record["id"]}',city,name[:200],category,
            center.get("lat"),center.get("lon"),website[:300],priority(name,category,tags))

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--city", choices=CITIES, required=True)
    g=p.add_mutually_exclusive_group(required=True)
    g.add_argument("--input",help="Local Overpass JSON file")
    g.add_argument("--fetch", action="store_true",help="One explicit network request; never scheduled")
    p.add_argument("--contact-email",help="Operator email for identifiable User-Agent")
    p.add_argument("--db",default=os.environ.get("MAROCVOWS_OSM_DB","./private-data/vendors.sqlite3"))
    args=p.parse_args()
    data=fetch(args.city,args.contact_email) if args.fetch else json.loads(Path(args.input).read_text(encoding="utf-8"))
    if not isinstance(data.get("elements"),list):
        raise ValueError("Input must contain an Overpass elements array")
    db=Path(args.db).expanduser().resolve()
    db.parent.mkdir(parents=True,exist_ok=True)
    try: os.chmod(db.parent,0o700)
    except OSError: pass
    con=sqlite3.connect(db)
    con.executescript(SCHEMA)
    stamp=datetime.now(timezone.utc).isoformat()
    imported=0
    for element in data["elements"]:
        row=normalize(element,args.city)
        if not row: continue
        con.execute("""INSERT INTO candidates
            (osm_key,city,name,category,lat,lon,website,review_priority,first_seen,last_seen)
            VALUES(?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(osm_key) DO UPDATE SET
            last_seen=excluded.last_seen,
            review_priority=excluded.review_priority
            """,(*row,stamp,stamp))
        imported+=1
    con.commit()
    con.close()
    try: os.chmod(db,0o600)
    except OSError: pass
    print(json.dumps({"city":args.city,"processed_named_businesses":imported,
          "db":str(db),"published":False,"verified":False}))
if __name__=="__main__":
    try: main()
    except (ValueError,OSError,urllib.error.URLError) as exc:
        print(f"Error: {exc}",file=sys.stderr)
        sys.exit(1)
