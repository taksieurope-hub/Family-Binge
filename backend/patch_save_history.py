# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "    localStorage.setItem(getWatchHistoryKey(), JSON.stringify(history.slice(0, 20)));"
new = "    const key = getWatchHistoryKey();\n    if (!key) return;\n    localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));"

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: not found")
