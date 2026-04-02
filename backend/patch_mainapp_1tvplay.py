# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()

old_import = 'import KartuliSection from "./components/KartuliSection";'
new_import = 'import KartuliSection from "./components/KartuliSection";\nimport OneTVPlaySection from "./components/OneTVPlaySection";'

old_place = '<KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />'
new_place = '<KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />\n        <OneTVPlaySection onSelectContent={handleSelectContent} />'

if old_import in c and old_place in c:
    c = c.replace(old_import, new_import)
    c = c.replace(old_place, new_place)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
