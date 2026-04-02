# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\OneTVPlaySection.jsx'
c = open(path, 'r', encoding='utf-8-sig', errors='replace').read()
c = c.replace('"1TVPLAY"', '"Movies, Series & Live TV"')
c = c.replace('"Georgian movies and series from 1TV"', '"Stream Georgian content directly in the app"')
open(path, 'w', encoding='utf-8').write(c)
print("Done!")
