import firebase_admin
from firebase_admin import credentials
import os

_cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(credentials.Certificate(_cred_path))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://family-binge-9lws.onrender.com",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Family Binge API running"}

from routers.content import router as content_router
from routers.payment import router as payment_router
app.include_router(payment_router, prefix="/api")
app.include_router(content_router, prefix="/api/content")

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
