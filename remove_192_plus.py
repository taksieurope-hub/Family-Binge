import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

lines = content.split('\n')
new_lines = []
skip = False
for line in lines:
    match = re.match(r'\s*\{\s*id:\s*(\d+)\s*,', line)
    if match:
        ch_id = int(match.group(1))
        if ch_id >= 192:
            skip = True
    if skip:
        if line.rstrip().endswith('},'):
            continue
        continue
    new_lines.append(line)

new_content = '\n'.join(new_lines)
src.write_text(new_content, encoding='utf-8')

remaining = len(re.findall(r'{\s*id:\s*\d+', new_content))
print(f'Done! All channels from 192 onwards removed. {remaining} channels remaining.')
