#!/usr/bin/env python3
"""Private server-side vendor review CLI (never expose this script over HTTP).
Python 3.10+ standard library only. Always use a DB path outside the web root.
"""
import argparse
import json
import os
import sqlite3
import sys
from pathlib import Path

STATUSES = ("unverified", "reviewing", "verified", "rejected")
PRIORITIES = ("high", "medium", "low")

def database(path):
    p = Path(path).expanduser().resolve(strict=True)
    if not p.is_file() or p.suffix not in (".sqlite3", ".db"):
        raise ValueError("Provide an existing private SQLite database (.sqlite3 or .db)")
    if any(part in p.parts for part in ("public_html", "www", "htdocs", "site", "docs")):
        raise ValueError("Database may not be served by a web directory")
    if os.name == "posix" and p.stat().st_mode & 0o077:
        raise ValueError("Private database permissions must be 0600")
    uri = f"file:{p}?mode=rw"
    conn = sqlite3.connect(uri, uri=True, timeout=5)
    conn.row_factory = sqlite3.Row
    return conn

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--db", required=True, help="Existing private SQLite database")
    sub=p.add_subparsers(dest="action",required=True)
    listings=sub.add_parser("list",help="Review queue, local terminal only")
    listings.add_argument("--city",choices=("khenifra","fes","meknes"))
    listings.add_argument("--status",choices=STATUSES,default="unverified")
    listings.add_argument("--priority",choices=PRIORITIES)
    listings.add_argument("--limit",type=int,default=30)
    update=sub.add_parser("set-status",help="Explicit human review decision")
    update.add_argument("--osm-key",required=True)
    update.add_argument("--status",required=True,choices=STATUSES)
    update.add_argument("--reason",required=True,help="Non-personal reason for audit log")
    args=p.parse_args()
    if args.action=="list" and not 1<=args.limit<=100:
        p.error("--limit must be between 1 and 100")
    with database(args.db) as conn:
        if args.action=="list":
            clauses=["status=?"]; params=[args.status]
            if args.city: clauses.append("city=?"); params.append(args.city)
            if args.priority: clauses.append("review_priority=?"); params.append(args.priority)
            rows=conn.execute(
                "SELECT osm_key,city,name,category,website,review_priority,status "
                "FROM candidates WHERE "+" AND ".join(clauses)
                +" ORDER BY CASE review_priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, name LIMIT ?",
                (*params,args.limit)).fetchall()
            print(json.dumps([dict(row) for row in rows],ensure_ascii=False,indent=2))
        else:
            if not args.reason.strip() or len(args.reason)>300:
                p.error("--reason must contain 1–300 characters")
            conn.execute("""CREATE TABLE IF NOT EXISTS review_audit (
                id INTEGER PRIMARY KEY AUTOINCREMENT, osm_key TEXT NOT NULL,
                previous_status TEXT NOT NULL, new_status TEXT NOT NULL,
                reason TEXT NOT NULL, reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)""")
            row=conn.execute("SELECT status FROM candidates WHERE osm_key=?",(args.osm_key,)).fetchone()
            if row is None: raise ValueError("Unknown candidate")
            conn.execute("UPDATE candidates SET status=? WHERE osm_key=?",(args.status,args.osm_key))
            conn.execute("INSERT INTO review_audit (osm_key,previous_status,new_status,reason) VALUES (?,?,?,?)",
                         (args.osm_key,row["status"],args.status,args.reason.strip()))
            print(json.dumps({"updated":args.osm_key,"status":args.status,"published":False}))
if __name__=="__main__":
    try:main()
    except (ValueError,sqlite3.Error,OSError) as e:
        print("Error: "+str(e),file=sys.stderr)
        sys.exit(1)
