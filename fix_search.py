import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

old = "const [search, setSearch] = useState('All');"
new = "const [search, setSearch] = useState('');"

if old in content:
    content = content.replace(old, new)
    print('Fixed! search now initializes to empty string.')
else:
    print('ERROR: could not find the line')

src.write_text(content, encoding='utf-8')
