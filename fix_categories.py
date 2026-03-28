import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Fix 1: Make sure activeCategory defaults to 'All'
content = re.sub(
    r"useState\(['\"](?!All)[^'\"]*['\"]\)\s*;(\s*//.*category.*)?",
    "useState('All');",
    content
)

# Fix 2: Replace the entire categories const + button block with a clean version
# that always has 'All' first and derives categories from actual channel data
old_pattern = re.compile(
    r"const categories = \[.*?\];",
    re.DOTALL
)
new_categories = (
    "const categories = ['All', ...Array.from(new Set(visibleChannels.map(c => c.category))).sort()];"
)
content = old_pattern.sub(new_categories, content)

src.write_text(content, encoding='utf-8')
print('Done! categories now auto-derived from channel data, All is always first.')
