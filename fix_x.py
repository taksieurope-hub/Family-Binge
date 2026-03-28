import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Fix all corrupted characters by replacing with plain ASCII
content = content.replace('\u00e2\u009c\u0095', 'X')
content = content.replace('\u00c3\u00a2\u00c2\u009c\u00c2\u0095', 'X')
content = content.replace('âœ•', 'X')
content = content.replace('â€¢', 'X')

# Make absolutely sure the delete button text is clean
import re
content = re.sub(r'title="Hide this channel">\s*[^\w<]+\s*</button>', 
                 'title="Hide this channel">X</button>', content)

src.write_text(content, encoding='utf-8')
print('Done')
