import firebase_admin
from firebase_admin import credentials
import os

import json as _json
_cred_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if not firebase_admin._apps:
    if _cred_json:
        firebase_admin.initialize_app(credentials.Certificate(_json.loads(_cred_json)))
    else:
        _cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        firebase_admin.initialize_app(credentials.Certificate(_cred_path))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Family Binge API running"}

from routers.content import router as content_router
from routers.imovs import router as imovs_router
from routers.payment import router as payment_router
app.include_router(payment_router, prefix="/api")
app.include_router(content_router, prefix="/api")
app.include_router(content_router, prefix="/api/content")
app.include_router(content_router, prefix="")
app.include_router(imovs_router, prefix="/api/content")
app.include_router(imovs_router, prefix="")

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

import httpx
from fastapi import HTTPException
from fastapi.responses import StreamingResponse, Response

@app.get("/api/proxy")
async def proxy_stream(url: str):
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            resp = await client.get(url, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://eic.lgchhomeapp.lgtvcommon.com",
                "Origin": "https://eic.lgchhomeapp.lgtvcommon.com"
            })
            content_type = resp.headers.get("content-type", "")
            
            # If it's an m3u8 playlist, rewrite all URLs inside it
            if "mpegurl" in content_type or url.endswith(".m3u8"):
                text = resp.text
                base_url = url.rsplit("/", 1)[0]
                lines = []
                for line in text.splitlines():
                    if line and not line.startswith("#"):
                        if line.startswith("http"):
                            line = f"/api/proxy?url={line}"
                        else:
                            line = f"/api/proxy?url={base_url}/{line}"
                    lines.append(line)
                rewritten = "\n".join(lines)
                return Response(content=rewritten, media_type="application/vnd.apple.mpegurl",
                               headers={"Access-Control-Allow-Origin": "*"})
            
            return Response(content=resp.content, media_type=content_type,
                          headers={"Access-Control-Allow-Origin": "*"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == '__main__':
    import uvicorn
    uvicorn.run('server:app', host='0.0.0.0', port=5000, reload=True)
 
