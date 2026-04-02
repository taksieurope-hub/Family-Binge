# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()

old_import = 'import DeviceBlockedModal from "./components/DeviceBlockedModal";'
new_import = 'import DeviceBlockedModal from "./components/DeviceBlockedModal";\nimport NPSSurvey from "./components/NPSSurvey";'

old_place = '<div className="App min-h-screen bg-black">'
new_place = '<div className="App min-h-screen bg-black">\n      <NPSSurvey />'

if old_import in c and old_place in c:
    c = c.replace(old_import, new_import)
    c = c.replace(old_place, new_place)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
