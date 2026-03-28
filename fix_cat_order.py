import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Remove the broken categories line wherever it is
content = re.sub(
    r"\s*const categories = \['All'[^;]+;\n",
    '\n',
    content
)

# Insert categories AFTER the visibleChannels line
old = "const visibleChannels = channels.filter(c => !deletedIds.includes(c.id));"
new = """const visibleChannels = channels.filter(c => !deletedIds.includes(c.id));
  const categories = ['All', ...Array.from(new Set(visibleChannels.map(c => c.category))).sort()];"""

if old in content:
    content = content.replace(old, new)
    print('Fixed! categories now defined after visibleChannels.')
else:
    print('ERROR: could not find visibleChannels line - paste your file structure')

src.write_text(content, encoding='utf-8')
