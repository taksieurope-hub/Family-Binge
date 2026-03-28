import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Check if array is properly closed
if not '];\n' in content and not '];\r\n' in content:
    # Find the last channel entry and close the array properly
    content = content.rstrip()
    if content.endswith(','):
        content = content[:-1]
    content += '\n];\n'
    print('Fixed: added closing ];')
else:
    print('Array already closed - checking for other issues')

src.write_text(content, encoding='utf-8')
