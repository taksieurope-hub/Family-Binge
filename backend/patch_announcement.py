# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()
old = 'import NPSSurvey from "./components/NPSSurvey";'
new = 'import NPSSurvey from "./components/NPSSurvey";\nimport AnnouncementBanner from "./components/AnnouncementBanner";'
old2 = '<NPSSurvey />'
new2 = '<NPSSurvey />\n      <AnnouncementBanner />'
if old in c and old2 in c:
    c = c.replace(old, new).replace(old2, new2)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
