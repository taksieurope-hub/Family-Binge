# -*- coding: utf-8 -*-
import urllib.request

url = "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u"
search_terms = ['comedy central', 'mtv', 'vh1', 'discovery', 'national geographic', 'natgeo', 'cnn', 'fox', 'nick', 'cartoon', 'disney', 'syfy', 'history', 'animal', 'travel', 'food network', 'hgtv', 'tlc', 'bravo', 'e!', 'lifetime', 'hallmark', 'amc', 'fx', 'espn', 'nbc', 'abc', 'cbs', 'bbc']

print("Fetching...")
try:
    with urllib.request.urlopen(url, timeout=20) as r:
        content = r.read().decode('utf-8')
    lines = content.split('\n')
    found = []
    for i, line in enumerate(lines):
        if line.startswith('#EXTINF'):
            name = line.split(',')[-1].strip().lower()
            stream = lines[i+1].strip() if i+1 < len(lines) else ''
            if stream.startswith('http'):
                for term in search_terms:
                    if term in name:
                        found.append((lines[i].split(',')[-1].strip(), stream))
                        break
    print(f"Found {len(found)} matching channels:")
    for name, stream in found:
        print(f"  {name}: {stream}")
except Exception as e:
    print(f"ERROR: {e}")
