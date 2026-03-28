import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

ids_to_remove = [3,4,12,26,38,43,44,53,55,56,57,58,59,60,61,62,63,65,66,88,90,91,92,93,94,95,96,97,98,99,100,137,141,155,159,168,174,176,178,179,180,181,182,183,184,185,186,187,188,189,190,191]

import re
lines = content.split('\n')
new_lines = []
skip = False
for line in lines:
    match = re.match(r'\s*\{\s*id:\s*(\d+)\s*,', line)
    if match:
        ch_id = int(match.group(1))
        if ch_id in ids_to_remove:
            skip = True
    if skip:
        if line.rstrip().endswith('},'):
            skip = False
            continue
        continue
    new_lines.append(line)

new_content = '\n'.join(new_lines)
src.write_text(new_content, encoding='utf-8')

remaining = len(re.findall(r'{\s*id:\s*\d+', new_content))
print(f'Done! Removed {len(ids_to_remove)} channels. {remaining} channels remaining.')
