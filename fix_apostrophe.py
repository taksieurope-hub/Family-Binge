import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

content = content.replace(
    "{ id: 175, name: \"Gordon Ramsay's Hell's Kitchen\"",
    '{ id: 175, name: "Gordon Ramsay Hell Kitchen"'
)

src.write_text(content, encoding='utf-8')
print('Done!')
