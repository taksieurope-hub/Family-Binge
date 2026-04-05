path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add proxy function after the imports
proxy_fn = """
const PROXY = 'https://family-binge-backend.onrender.com/api/proxy?url=';
const proxyUrl = (url) => url ? PROXY + encodeURIComponent(url) : url;
"""

# Insert after the last import line
import_end = content.rfind('\nimport ')
insert_pos = content.find('\n', import_end + 1) + 1
content = content[:insert_pos] + proxy_fn + content[insert_pos:]

# Wrap stream URLs - replace where hls loads the url
old = "const url = activeChannel.streams[streamIndex];"
new = "const url = proxyUrl(activeChannel.streams[streamIndex]);"

if old in content:
    content = content.replace(old, new)
    print("Patched stream URL with proxy")
else:
    print("WARNING: Could not find stream URL line - check manually")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
