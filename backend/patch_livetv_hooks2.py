# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

old2 = "  }, [user, navigate]);\n  const [deletedIds, setDeletedIds] = useState([]);\n\n  useEffect(() => {"
new2 = "  }, [user, navigate]);\n\n  useEffect(() => {"

if old2 in c:
    c = c.replace(old2, new2)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: not found")
