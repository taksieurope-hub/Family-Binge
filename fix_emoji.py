import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

replacements = {
    'âœ• Hide Delete Buttons': 'Hide Delete Buttons',
    'ðŸ—\u0091 Manage Channels': 'Manage Channels',
    'ðŸ—': 'Manage Channels',
    'â†©': 'Restore',
    'âœ•': 'X',
    'Click âœ• on any channel to permanently hide it': 'Click X on any channel to permanently hide it',
}

for old, new in replacements.items():
    content = content.replace(old, new)

src.write_text(content, encoding='utf-8')
print('Done! Corrupted emoji characters replaced.')
