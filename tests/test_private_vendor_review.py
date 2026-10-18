import importlib.util
import os
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"tools"/"private_vendor_review.py"

class ReviewTests(unittest.TestCase):
    def test_local_review_and_audit(self):
        with tempfile.TemporaryDirectory() as d:
            db=Path(d)/"vendors.sqlite3"
            con=sqlite3.connect(db)
            con.execute("""CREATE TABLE candidates
                (osm_key TEXT PRIMARY KEY,city TEXT,name TEXT,category TEXT,website TEXT,
                review_priority TEXT,status TEXT)""")
            con.execute("INSERT INTO candidates VALUES (?,?,?,?,?,?,?)",
                        ("node/1","khenifra","Synthetic Test Venue","amenity:events_venue","","high","unverified"))
            con.commit();con.close()
            os.chmod(db,0o600)
            a=subprocess.run([sys.executable,str(SCRIPT),"--db",str(db),"list","--city","khenifra"],
                               capture_output=True,text=True)
            self.assertEqual(a.returncode,0,a.stderr)
            self.assertIn("Synthetic Test Venue",a.stdout)
            b=subprocess.run([sys.executable,str(SCRIPT),"--db",str(db),"set-status",
                             "--osm-key","node/1","--status","reviewing","--reason","Test workflow"],
                              capture_output=True,text=True)
            self.assertEqual(b.returncode,0,b.stderr)
            con=sqlite3.connect(db)
            self.assertEqual(con.execute("SELECT status FROM candidates").fetchone()[0],"reviewing")
            self.assertEqual(con.execute("SELECT COUNT(*) FROM review_audit").fetchone()[0],1)
            con.close()

    def test_world_readable_database_is_rejected(self):
        if os.name!="posix":self.skipTest("POSIX only")
        with tempfile.TemporaryDirectory() as d:
            db=Path(d)/"vendors.sqlite3"; sqlite3.connect(db).close();os.chmod(db,0o644)
            r=subprocess.run([sys.executable,str(SCRIPT),"--db",str(db),"list"],
                              capture_output=True,text=True)
            self.assertNotEqual(r.returncode,0)
            self.assertIn("0600",r.stderr)

if __name__=="__main__": unittest.main()
