# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "        const trialActive = data.trialEndsAt && trialEnd > now;\n        const subActive = status === 'active' && data.subscriptionEndsAt && subEnd > now;\n        if (!trialActive && !subActive) setAccessBlocked(true);"
new = "        const trialActive = data.trialEndsAt && trialEnd > now;\n        const subActive = status === 'active' && data.subscriptionEndsAt && subEnd > now;\n        const isFamilyRole = data.role === 'family';\n        if (!trialActive && !subActive && !isFamilyRole) setAccessBlocked(true);"

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
