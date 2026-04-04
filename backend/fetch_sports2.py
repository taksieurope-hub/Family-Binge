# -*- coding: utf-8 -*-
import urllib.request

urls = [
    "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/int.m3u",
    "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8",
    "https://raw.githubusercontent.com/jnk22/kodinerds-iptv/master/iptv/clean/kodi_international.m3u",
]

search_terms = ['sport', 'rugby', 'supersport', 'espn', 'eurosport', 'bein', 'sky sport', 'dazn', 'tennis', 'golf', 'cricket', 'nfl', 'nba', 'boxing', 'ufc', 'fight', 'formula', 'f1', 'motor']

found = []
for url in urls:
    print(f"Fetching {url}...")
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            content = r.read().decode('utf-8', errors='ignore')
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('#EXTINF'):
                name = line.split(',')[-1].strip()
                stream = lines[i+1].strip() if i+1 < len(lines) else ''
                if stream.startswith('http'):
                    for term in search_terms:
                        if term in name.lower():
                            found.append((name, stream))
                            break
    except Exception as e:
        print(f"ERROR: {e}")

print(f"\nFound {len(found)} sports channels:")
for name, stream in found:
    print(f"  {name}: {stream}")
