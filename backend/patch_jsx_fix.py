# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = '''      {contentFilter === "georgian" && (
        <KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />
        <OneTVPlaySection onSelectContent={handleSelectContent} />
      )}'''

new = '''      {contentFilter === "georgian" && (
        <>
          <KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />
          <OneTVPlaySection onSelectContent={handleSelectContent} />
        </>
      )}'''

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: not found")
