#!/usr/bin/env python3
"""Tiny static server for local development: like `python3 -m http.server` but with caching disabled,
so edited modules are never served stale. Usage (from this folder): python3 dev-server.py [port]"""
import http.server, os, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    http.server.ThreadingHTTPServer(('', port), NoCache).serve_forever()
