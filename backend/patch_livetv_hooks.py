# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "  const [accessBlocked, setAccessBlocked] = useState(false);\n\n  useEffect(() => {\n    if (!user) { navigate('/login'); return; }"
new = "  const [accessBlocked, setAccessBlocked] = useState(false);\n  const [deletedIds, setDeletedIds] = useState([]);\n\n  useEffect(() => {\n    if (!user) { navigate('/login'); return; }"

old2 = "  }, [user, navigate]);\n  const [deletedIds, setDeletedIds] = useState([]);\n  useEffect(() => {"
new2 = "  }, [user, navigate]);\n  useEffect(() => {"

if old in c:
    c = c.replace(old, new)
    print("old1 replaced")
else:
    print("ERROR: old1 not found")

if old2 in c:
    c = c.replace(old2, new2)
    print("old2 replaced")
else:
    print("ERROR: old2 not found - checking raw:")
    idx = c.find('[user, navigate]')
    print(repr(c[idx:idx+100]))

open(path, 'w', encoding='utf-8').write(c)
print("Done!")
