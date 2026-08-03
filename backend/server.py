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
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/api/health", methods=["GET", "HEAD"])
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Family Binge API running"}

from routers.content import router as content_router
from routers.streams import router as streams_router
from routers.imovs import router as imovs_router
from routers.payment import router as payment_router
from routers.auth import auth_router

# --- Mount Frontend Static Assets ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_BUILD_DIR = os.path.abspath(os.path.join(BASE_DIR, "../frontend/build"))

if os.path.exists(FRONTEND_BUILD_DIR):
    # Mount main static assets folder (js, css, media)
    static_dir = os.path.join(FRONTEND_BUILD_DIR, "static")
    if os.path.exists(static_dir):
        app.mount("/static", StaticFiles(directory=static_dir), name="static")
        
    # Mount the rest of the build directory at root for general assets (manifest, favicon, sw.js)
    app.mount("/assets_root", StaticFiles(directory=FRONTEND_BUILD_DIR), name="frontend_root")

app.include_router(payment_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(content_router, prefix="/api")
app.include_router(streams_router, prefix="/api")
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
@app.get("/api/{catchall:path}.m3u8", include_in_schema=False)
async def catch_bad_m3u8(catchall: str):
    if catchall.endswith(".m3u8"):
        return Response(content="#EXTM3U\n", media_type="application/vnd.apple.mpegurl", headers={"Access-Control-Allow-Origin": "*"})
    raise HTTPException(status_code=404, detail="Not found")


from fastapi.responses import HTMLResponse

@app.get("/{catchall:path}", include_in_schema=False)
async def spa_fallback(catchall: str):
    if catchall.startswith("api") or "." in catchall.split("/")[-1]:
        raise HTTPException(status_code=404, detail="Not Found")
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/build/index.html"))
    if os.path.exists(index_path):
        return HTMLResponse(content=open(index_path, "r", encoding="utf-8").read(), status_code=200)
    alt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist/index.html"))
    if os.path.exists(alt_path):
        return HTMLResponse(content=open(alt_path, "r", encoding="utf-8").read(), status_code=200)
    return HTMLResponse(content="<h1>Frontend build folder not found</h1>", status_code=500)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('server:app', host='0.0.0.0', port=5000, reload=True)
 

