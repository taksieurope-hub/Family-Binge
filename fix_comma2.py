import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Fix missing comma after FilAmTV entry
content = re.sub(
    r"(playlist\.m3u8'\])\s*\}\s*\n(\s*\{ id: 200)",
    r"\1 },\n\2",
    content
)

src.write_text(content, encoding='utf-8')
print('Done!')
