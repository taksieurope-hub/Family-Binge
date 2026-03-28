import pathlib, re

m3u_path = pathlib.Path(r'C:\Users\edahl\Desktop\channels.m3u8')
jsx_path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')

m3u = m3u_path.read_text(encoding='utf-8')
jsx = jsx_path.read_text(encoding='utf-8')

# Parse M3U
channels = []
lines = m3u.strip().split('\n')
i = 0
start_id = 200

while i < len(lines):
    line = lines[i].strip()
    if line.startswith('#EXTINF'):
        name_match = re.search(r',(.+)$', line)
        logo_match = re.search(r'tvg-logo="([^"]*)"', line)
        group_match = re.search(r'group-title="([^"]*)"', line)
        name = name_match.group(1).strip() if name_match else 'Unknown'
        logo = logo_match.group(1) if logo_match else ''
        group = group_match.group(1).split(';')[0].strip().capitalize() if group_match else 'General'
        
        # Collect all stream URLs until next #EXTINF or end
        streams = []
        i += 1
        while i < len(lines):
            next_line = lines[i].strip()
            if next_line.startswith('#EXTINF') or next_line == '#EXTM3U':
                break
            if next_line.startswith('http'):
                streams.append(next_line)
            i += 1
        
        if streams and name != 'Unknown':
            # Check for duplicate names
            existing_names = [c['name'] for c in channels]
            if name not in existing_names:
                channels.append({
                    'name': name.replace("'", ""),
                    'logo': logo,
                    'category': group,
                    'streams': streams
                })
    else:
        i += 1

# Add to JSX
new_lines = []
for idx, ch in enumerate(channels):
    ch_id = start_id + idx
    streams_str = ', '.join([f'"{s}"' for s in ch["streams"]])
    logo_str = ch["logo"] if ch["logo"] else ""
    new_lines.append(f'  {{ id: {ch_id}, name: "{ch["name"]}", category: "{ch["category"]}", logo: "{logo_str}", streams: [{streams_str}] }},')

new_js = '\n'.join(new_lines) + '\n'

# Insert before closing ];
jsx = jsx.rstrip()
if jsx.endswith('];'):
    jsx = jsx[:-2] + '\n' + new_js + '];'
elif jsx.endswith('}'):
    jsx = jsx + '\n' + new_js + '];'

jsx_path.write_text(jsx, encoding='utf-8')
print(f"Done! Added {len(channels)} channels starting from ID {start_id}.")
