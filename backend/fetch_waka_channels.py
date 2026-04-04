# -*- coding: utf-8 -*-
import urllib.request
import json

urls_to_try = [
    "https://www.wakatv.app/api/channels",
    "https://api.wakatv.app/channels",
    "https://wakatv.app/api/v1/channels",
    "https://www.wakatv.app/playlist.m3u",
    "https://wakatv.app/channels.m3u",
    "https://wakatv.app/playlist.m3u8",
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*',
}

for url in urls_to_try:
    print(f"\nTrying: {url}")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            content = r.read().decode('utf-8', errors='ignore')
            print(f"SUCCESS! Got {len(content)} bytes")
            print(content[:2000])
            break
    except Exception as e:
        print(f"Failed: {e}")
