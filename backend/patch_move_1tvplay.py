# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = '''      {contentFilter === "georgian" && (
        <>
          <KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />
          <OneTVPlaySection onSelectContent={handleSelectContent} />
        </>
      )}
      {contentFilter === "russian" && (
        <KartuliSection onSelectContent={handleSelectContent} filterMode="russian" />
      )}'''

new = '''      {contentFilter === "georgian" && (
        <>
          <OneTVPlaySection onSelectContent={handleSelectContent} />
          <KartuliSection onSelectContent={handleSelectContent} filterMode="georgian" />
        </>
      )}
      {contentFilter === "russian" && (
        <>
          <OneTVPlaySection onSelectContent={handleSelectContent} />
          <KartuliSection onSelectContent={handleSelectContent} filterMode="russian" />
        </>
      )}'''

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
