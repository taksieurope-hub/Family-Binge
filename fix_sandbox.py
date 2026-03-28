import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx')
c = f.read_text(encoding='utf-8')

old = 'sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"'
new = 'sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"'

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
