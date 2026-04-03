# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\backend\routers\payment.py'
c = open(path, 'r', encoding='utf-8').read()

# Fix the bad import
c = c.replace(
    'from routers.mongo_sync import sync_user, HTTPException',
    'from routers.mongo_sync import sync_user\nfrom fastapi import HTTPException'
)

# Add sync call after register-device success
c = c.replace(
    '        user_ref.update({"registeredDevices": registered})\n        return {"success": True, "status": "registered"}',
    '        user_ref.update({"registeredDevices": registered})\n        sync_user({"uid": request.user_id, "registeredDevices": registered})\n        return {"success": True, "status": "registered"}'
)

# Add sync call after activate-plan
c = c.replace(
    '    return {"success": True, "expires": expires.isoformat(), "maxTVs": plan["maxTVs"], "maxPhones": plan["maxPhones"]}',
    '    sync_user({"uid": request.user_id, "plan": request.plan, "subscriptionExpires": expires.isoformat(), "maxTVs": plan["maxTVs"], "maxPhones": plan["maxPhones"]})\n    return {"success": True, "expires": expires.isoformat(), "maxTVs": plan["maxTVs"], "maxPhones": plan["maxPhones"]}'
)

open(path, 'w', encoding='utf-8').write(c)
print("Done!")
