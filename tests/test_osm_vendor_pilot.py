"""Run: python3 -m unittest discover -s tests -p 'test_osm_vendor_pilot.py'"""
import importlib.util
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "osm_vendor_pilot.py"

class PrivateVendorPilotTests(unittest.TestCase):
    def test_normalization_and_priorities(self):
        spec = importlib.util.spec_from_file_location("osm_vendor_pilot", SCRIPT)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        base = {"type":"node","id":1,"lat":33.9,"lon":-5.5,"tags":{"name":"Salle des fêtes exemple","amenity":"events_venue","phone":"not-for-storage"}}
        row = mod.normalize(base,"meknes")
        self.assertEqual(row[-1],"high")
        self.assertEqual(row[0],"node/1")
        self.assertNotIn("not-for-storage",str(row))
        self.assertIsNone(mod.normalize({"type":"node","id":2,"tags":{"shop":"photo"}},"meknes"))
        self.assertEqual(mod.priority("Hotel", "tourism:hotel", {}),"low")
        self.assertEqual(mod.priority("Photographe", "shop:photo", {}),"medium")

    def test_import_twice_into_new_database(self):
        with tempfile.TemporaryDirectory() as d:
            import json
            data=Path(d)/"sample.json"
            db=Path(d)/"test.sqlite3"
            data.write_text(json.dumps({"elements":[
                {"type":"node","id":3,"lat":34,"lon":-5,"tags":{"name":"Salle des fêtes Test","amenity":"events_venue","phone":"+000"}},
                {"type":"node","id":4,"lat":34,"lon":-5,"tags":{"shop":"florist"}}
            ]}),encoding="utf-8")
            for _ in range(2):
                subprocess.run([sys.executable,str(SCRIPT),"--city","fes","--input",str(data),"--db",str(db)],check=True,capture_output=True)
            con=sqlite3.connect(db)
            self.assertEqual(con.execute("SELECT COUNT(*) FROM candidates").fetchone()[0],1)
            self.assertEqual(con.execute("SELECT review_priority,status FROM candidates").fetchone(),("high","unverified"))
            self.assertNotIn("phone",[x[1] for x in con.execute("PRAGMA table_info(candidates)")])
            con.close()

if __name__=="__main__":
    unittest.main()
