# -*- coding: utf-8 -*-
import urllib.request

urls = [
    "https://iptv-org.github.io/iptv/countries/za.m3u",
    "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/za.m3u",
]

for url in urls:
    print(f"\nFetching: {url}")
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            content = r.read().decode('utf-8')
        lines = content.split('\n')
        channels = []
        for i, line in enumerate(lines):
            if line.startswith('#EXTINF'):
                name = line.split(',')[-1].strip()
                stream = lines[i+1].strip() if i+1 < len(lines) else ''
                if stream.startswith('http'):
                    channels.append((name, stream))
        print(f"Found {len(channels)} channels:")
        for name, stream in channels:
            print(f"  {name}: {stream}")
    except Exception as e:
        print(f"ERROR: {e}")
