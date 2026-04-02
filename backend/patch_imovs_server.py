# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\backend\server.py'
c = open(path, 'r', encoding='utf-8').read()
old = 'from routers.content import router as content_router'
new = 'from routers.content import router as content_router\nfrom routers.imovs import router as imovs_router'
old2 = 'app.include_router(content_router, prefix="/api/content")'
new2 = 'app.include_router(content_router, prefix="/api/content")\napp.include_router(imovs_router, prefix="/api/content")'
if old in c:
    c = c.replace(old, new).replace(old2, new2)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
