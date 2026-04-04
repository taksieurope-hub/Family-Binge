# -*- coding: utf-8 -*-
import urllib.request

urls = [
    "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u",
    "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/gb.m3u",
    "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/za.m3u",
]

search_terms = ['sport', 'rugby', 'supersport', 'super sport', 'espn', 'fox sport', 'sky sport', 'bt sport', 'eurosport', 'beinsport', 'bein', 'dazn', 'tennis', 'golf', 'cricket', 'nfl', 'nba', 'nhl', 'mlb', 'racing', 'motor', 'formula', 'f1', 'boxing', 'ufc', 'fight', 'wrestling']

found = []
for url in urls:
    print(f"Fetching {url}...")
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            content = r.read().decode('utf-8')
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
