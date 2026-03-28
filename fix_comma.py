import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

content = content.replace(
    "'https://cdn.vegasplus.us/vegas/ftv/playlist.m3u8'] }\n  { id: 200",
    "'https://cdn.vegasplus.us/vegas/ftv/playlist.m3u8'] },\n  { id: 200"
)

src.write_text(content, encoding='utf-8')
print('Done!')
