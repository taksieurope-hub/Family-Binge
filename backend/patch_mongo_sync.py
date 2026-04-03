# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\backend\routers\payment.py'
c = open(path, 'r', encoding='utf-8').read()

old = 'from fastapi import APIRouter'
new = 'from fastapi import APIRouter\nfrom routers.mongo_sync import sync_user'

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
