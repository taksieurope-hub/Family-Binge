# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()
c = c.replace('import IMovsSection from "./components/IMovsSection";\n', '')
c = c.replace('\n          <IMovsSection />', '')
open(path, 'w', encoding='utf-8').write(c)
print("Done!")
