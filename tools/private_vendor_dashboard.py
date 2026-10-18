#!/usr/bin/env python3
"""MarocVows private loopback dashboard. Access only via SSH tunnel + Basic token.
No public listener, no customer data, no auto-publishing. Python stdlib.
"""
import base64
import html
import hmac
import os
import secrets
import sqlite3
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

ROOT = os.path.expanduser("~/marocvows-private")
DB = os.path.join(ROOT,"data","vendors.sqlite3")
TOKEN_FILE = os.path.join(ROOT,"admin-token")
HOST="127.0.0.1"
PORT=int(os.environ.get("MAROCVOWS_ADMIN_PORT","8767"))

def get_token():
    with open(TOKEN_FILE, encoding="ascii") as f:
        return f.read().strip()

def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)

def dbconn():
    db=sqlite3.connect(f"file:{DB}?mode=rw",uri=True, timeout=5)
    db.row_factory=sqlite3.Row
    return db

class Handler(BaseHTTPRequestHandler):
    server_version="MarocVowsPrivate/0.1"
    def log_message(self, fmt, *args):
        # No tokens, URLs, or vendor names in stdout logs.
        pass
    def sendpage(self, status, body, content_type="text/html; charset=utf-8"):
        out=body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type",content_type)
        self.send_header("Content-Length",str(len(out)))
        self.send_header("Cache-Control","no-store")
        self.send_header("X-Content-Type-Options","nosniff")
        self.send_header("X-Frame-Options","DENY")
        self.send_header("Content-Security-Policy","default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")
        self.end_headers()
        self.wfile.write(out)
    def authorized(self):
        auth=self.headers.get("Authorization","")
        prefix="Basic "
        if not auth.startswith(prefix):return False
        try:
            raw=base64.b64decode(auth[len(prefix):], validate=True).decode()
            username, token=raw.split(":",1)
            return username=="admin" and hmac.compare_digest(token,get_token())
        except (ValueError,UnicodeDecodeError, OSError):return False
    def access(self):
        if not self.authorized():
            self.send_response(401)
            self.send_header("WWW-Authenticate",'Basic realm="MarocVows Private"')
            self.send_header("Cache-Control","no-store")
            self.send_header("Content-Length","0")
            self.end_headers()
            return False
        return True
    def do_GET(self):
        if not self.access():return
        parsed=urlsplit(self.path)
        if parsed.path!="/":return self.sendpage(404,"Not found","text/plain")
        query=parse_qs(parsed.query)
        city=query.get("city",[""])[0]
        status=query.get("status",["unverified"])[0]
        if city not in ("","khenifra","fes","meknes"):city=""
        if status not in ("unverified","reviewing","verified","rejected"):status="unverified"
        filters=["status=?"];values=[status]
        if city: filters.append("city=?");values.append(city)
        with dbconn() as c:
            rows=c.execute("SELECT osm_key,name,city,category,review_priority,status,website FROM candidates WHERE "+" AND ".join(filters)+" ORDER BY CASE review_priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,name LIMIT 100",values).fetchall()
            total=c.execute("SELECT COUNT(*) FROM candidates").fetchone()[0]
        options="".join(f'<option value="{x}" {"selected" if city==x else ""}>{esc(x or "all")}</option>' for x in ("","khenifra","fes","meknes"))
        statuses="".join(f'<option value="{x}" {"selected" if status==x else ""}>{x}</option>' for x in ("unverified","reviewing","verified","rejected"))
        body=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MarocVows Private Review</title><style>body{font:16px system-ui;max-width:1080px;margin:32px auto;padding:16px;background:#f5f7f5;color:#18352c}main{background:white;border-radius:14px;padding:24px}table{border-collapse:collapse;width:100%}th,td{text-align:left;border-bottom:1px solid #ddd;padding:12px;vertical-align:top}input,select,button{font:inherit;padding:7px;max-width:100%}button{cursor:pointer}small{color:#52645e}</style><main><h1>MarocVows · Private candidates</h1>',
              f'<p><strong>{total}</strong> candidate records · private review only · no public publishing.</p>',
              f'<form method="get"><label>City <select name="city">{options}</select></label> <label>Status <select name="status">{statuses}</select></label> <button>Filter</button></form><table><thead><tr><th>Name</th><th>Category</th><th>City</th><th>Review</th></tr></thead><tbody>']
        for r in rows:
            key=esc(r["osm_key"])
            body.append(f'<tr><td><strong>{esc(r["name"])}</strong><br><small>{key}</small></td><td>{esc(r["category"])}<br><small>Priority: {esc(r["review_priority"])}</small></td><td>{esc(r["city"])}</td><td><form method="post" action="/review"><input type="hidden" name="osm_key" value="{key}"><select name="status"><option value="reviewing">Reviewing</option><option value="verified">Verified</option><option value="rejected">Rejected</option><option value="unverified">Unverified</option></select><input name="reason" required maxlength="300" placeholder="Reason for decision"><button>Save</button></form></td></tr>')
        body.append('</tbody></table><p><small>Verification is an internal review status, never an automatic listing approval.</small></p></main></html>')
        self.sendpage(200,"".join(body))
    def do_POST(self):
        if not self.access():return
        if urlsplit(self.path).path!="/review":return self.sendpage(404,"Not found","text/plain")
        origin=self.headers.get("Origin","")
        expected=f"http://localhost:{PORT}"
        allowed=(expected,f"http://127.0.0.1:{PORT}")
        if origin not in allowed:
            return self.sendpage(403,"Invalid origin","text/plain")
        try: size=int(self.headers.get("Content-Length","0"))
        except ValueError: size=0
        if not 0<size<=2048:return self.sendpage(400,"Invalid form size","text/plain")
        p=parse_qs(self.rfile.read(size).decode("utf-8"),keep_blank_values=True)
        key=p.get("osm_key",[""])[0];status=p.get("status",[""])[0];reason=p.get("reason",[""])[0].strip()
        if status not in ("unverified","reviewing","verified","rejected") or not 1<=len(reason)<=300 or len(key)>100:
            return self.sendpage(400,"Invalid review","text/plain")
        with dbconn() as c:
            row=c.execute("SELECT status FROM candidates WHERE osm_key=?",(key,)).fetchone()
            if row is None:return self.sendpage(404,"Unknown candidate","text/plain")
            c.execute("CREATE TABLE IF NOT EXISTS review_audit (id INTEGER PRIMARY KEY AUTOINCREMENT,osm_key TEXT NOT NULL,previous_status TEXT NOT NULL,new_status TEXT NOT NULL,reason TEXT NOT NULL,reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)")
            c.execute("UPDATE candidates SET status=? WHERE osm_key=?",(status,key))
            c.execute("INSERT INTO review_audit(osm_key,previous_status,new_status,reason) VALUES(?,?,?,?)",(key,row["status"],status,reason))
        self.send_response(303)
        self.send_header("Location","/")
        self.send_header("Content-Length","0")
        self.end_headers()

if __name__=="__main__":
    # Refuse non-loopback bind; force SSH tunnel; no public service exposed.
    if not os.path.exists(TOKEN_FILE):
        print("Missing admin token; initialize it outside the repository",file=sys.stderr)
        sys.exit(1)
    if os.stat(TOKEN_FILE).st_mode & 0o077:
        print("Unsafe token permissions",file=sys.stderr)
        sys.exit(1)
    print(f"Private dashboard listening only on {HOST}:{PORT}",flush=True)
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
