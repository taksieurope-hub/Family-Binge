import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\backend\server.py')
content = src.read_text(encoding='utf-8')

new_routes = '''
from fastapi import Request
from firebase_admin import firestore

@app.get("/api/hidden-channels/{user_id}")
async def get_hidden_channels(user_id: str):
    try:
        db = firestore.client()
        doc = db.collection("hidden_channels").document(user_id).get()
        if doc.exists:
            return {"hidden": doc.to_dict().get("ids", [])}
        return {"hidden": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/hidden-channels/{user_id}")
async def save_hidden_channels(user_id: str, request: Request):
    try:
        body = await request.json()
        ids = body.get("ids", [])
        db = firestore.client()
        db.collection("hidden_channels").document(user_id).set({"ids": ids})
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
'''

from fastapi import HTTPException
content += new_routes
src.write_text(content, encoding='utf-8')
print('Done! Hidden channels endpoints added.')
