# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()
old = 'import OneTVPlaySection from "./components/OneTVPlaySection";'
new = 'import OneTVPlaySection from "./components/OneTVPlaySection";\nimport IMovsSection from "./components/IMovsSection";'
old2 = '          <KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />'
new2 = '          <KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />\n          <IMovsSection />'
if old in c and old2 in c:
    c = c.replace(old, new).replace(old2, new2)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
