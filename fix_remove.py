import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Remove all channel entries with id >= 192
new_content = re.sub(
    r"\n  \{ id: (?:19[2-9]|[2-9]\d{2}|\d{4}),.*?\},",
    "",
    content,
    flags=re.DOTALL
)

src.write_text(new_content, encoding='utf-8')

remaining = len(re.findall(r'{\s*id:\s*\d+', new_content))
print(f'Done! {remaining} channels remaining.')
