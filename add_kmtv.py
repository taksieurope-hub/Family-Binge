import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')
new_line = '  { id: 204, name: "KMTV-DT1 (ABC Omaha)", category: "General", url: "https://content.uplynk.com/4a09fbea28ef4f32bce095e9eae04bd8.m3u8", logo: "https://i.imgur.com/E4PkyqN.png" },\n'
idx = content.index('];')
content = content[:idx] + new_line + content[idx:]
src.write_text(content, encoding='utf-8')
print('KMTV-DT1 added as id 204!')
