#!/usr/bin/env python3
"""
Local server for the application tracker.

  python3 serve.py            # serves on http://localhost:8000
  python3 serve.py 9000       # serves on a custom port

Serves the static files in this folder and writes data.json on POST /save,
so edits made in the browser persist straight to the JSON file on disk.
"""
import http.server
import socketserver
import json
import os
import sys
import hashlib

DIR = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(DIR, "data.json")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def _version(self):
        # content fingerprint of data.json; changes whenever the file changes (incl. external edits)
        try:
            with open(DATA, "rb") as f:
                return hashlib.sha1(f.read()).hexdigest()
        except FileNotFoundError:
            return "0"

    def do_GET(self):
        path = self.path.split("?", 1)[0].rstrip("/")
        if path == "/load":
            # data + its fingerprint together, so the client knows exactly what version it has
            try:
                with open(DATA, "r", encoding="utf-8") as f:
                    data = json.load(f)
                self._json(200, {"version": self._version(), "data": data})
            except Exception as e:
                self._json(500, {"ok": False, "error": str(e)})
            return
        if path == "/version":
            self._json(200, {"version": self._version()})
            return
        return super().do_GET()

    def do_POST(self):
        if self.path.rstrip("/") != "/save":
            self.send_error(404, "Not found")
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            payload = json.loads(body)
            # Accept either {version, data, force} (the app) or a raw array (manual/legacy).
            if isinstance(payload, list):
                data, expected, force = payload, None, True
            else:
                data = payload.get("data")
                expected = payload.get("version")
                force = bool(payload.get("force"))
            if not isinstance(data, list):
                raise ValueError("payload.data must be a JSON array")

            current = self._version()
            if not force and expected is not None and expected != current:
                # the file changed on disk since the client loaded it -> refuse, let client reconcile
                self._json(409, {"ok": False, "conflict": True, "version": current})
                print(f"conflict: client had {expected[:8] if expected else None}, disk is {current[:8]}")
                return

            tmp = DATA + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=1, ensure_ascii=False)
                f.write("\n")
            os.replace(tmp, DATA)  # atomic swap so a crash can't truncate data.json
            self._json(200, {"ok": True, "count": len(data), "version": self._version()})
            print(f"saved {len(data)} entries -> data.json")
        except Exception as e:
            self._json(400, {"ok": False, "error": str(e)})

    def _json(self, code, obj):
        payload = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def end_headers(self):
        # never cache, so a reload always shows the latest data.json
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet; we print our own save lines


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("127.0.0.1", PORT), Handler) as httpd:
        print(f"Tracker running at http://localhost:{PORT}   (Ctrl-C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")
