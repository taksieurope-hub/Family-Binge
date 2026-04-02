# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\backend\server.py'
c = open(path, 'r', encoding='utf-8').read()

old = '''_cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(credentials.Certificate(_cred_path))'''

new = '''import json as _json
_cred_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if not firebase_admin._apps:
    if _cred_json:
        firebase_admin.initialize_app(credentials.Certificate(_json.loads(_cred_json)))
    else:
        _cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        firebase_admin.initialize_app(credentials.Certificate(_cred_path))'''

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found - showing current server.py top:")
    print(c[:500])
