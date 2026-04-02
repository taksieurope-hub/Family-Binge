# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx'
c = open(path, 'r', encoding='utf-8').read()
# Find the accessBlocked line and print surrounding chars with repr
idx = c.find('accessBlocked, setAccessBlocked')
print(repr(c[idx-5:idx+200]))
