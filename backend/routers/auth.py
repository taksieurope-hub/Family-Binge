from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from routers.mongo_sync import get_mongo_db

auth_router = APIRouter(prefix="/auth", tags=["auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "familybinge_secret_key_2026")

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

def create_token(uid: str):
    payload = {"uid": uid, "exp": datetime.utcnow() + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@auth_router.post("/signup")
async def signup(request: SignupRequest):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    existing = db["users"].find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hashpw(request.password.encode(), bcrypt.gensalt()).decode()
    now = datetime.utcnow()
    trialEnds = now + timedelta(days=7)
    import random, string
    referralCode = "FAM-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    user = {
        "email": request.email,
        "name": request.name,
        "password": hashed,
        "plan": "free_trial",
        "trialEnds": trialEnds.isoformat(),
        "createdAt": now.isoformat(),
        "referralCode": referralCode,
        "subscriptionExpires": None,
        "maxTVs": 1,
        "maxPhones": 1,
    }
    result = db["users"].insert_one(user)
    uid = str(result.inserted_id)
    db["users"].update_one({"_id": result.inserted_id}, {"$set": {"uid": uid}})
    token = create_token(uid)
    return {"token": token, "uid": uid, "name": request.name, "email": request.email, "trialEnds": trialEnds.isoformat()}

@auth_router.post("/login")
async def login(request: LoginRequest):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not bcrypt.checkpw(request.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    uid = user.get("uid", str(user["_id"]))
    token = create_token(uid)
    return {
        "token": token,
        "uid": uid,
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "plan": user.get("plan", "free_trial"),
        "trialEnds": user.get("trialEnds"),
        "subscriptionExpires": user.get("subscriptionExpires"),
        "role": user.get("role", "user"),
        "maxTVs": user.get("maxTVs", 1),
        "maxPhones": user.get("maxPhones", 1),
    }

@auth_router.get("/me/{uid}")
async def get_me(uid: str):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": uid}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

class WatchHistoryItem(BaseModel):
    id: int
    title: str
    poster: str = None
    backdrop: str = None
    type: str
    year: str = None
    rating: float = None
    season: int = 1
    episode: int = 1
    progress: float = 0
    lastWatched: float = 0

@auth_router.post("/watch-history/{uid}")
async def save_watch_history(uid: str, item: WatchHistoryItem):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    item_dict = item.dict()
    db["users"].update_one(
        {"uid": uid},
        {"$pull": {"watchHistory": {"id": item.id, "type": item.type}}}
    )
    db["users"].update_one(
        {"uid": uid},
        {"$push": {"watchHistory": {"$each": [item_dict], "$position": 0, "$slice": 20}}}
    )
    return {"success": True}

@auth_router.get("/watch-history/{uid}")
async def get_watch_history(uid: str):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": uid}, {"watchHistory": 1})
    if not user:
        return {"history": []}
    return {"history": user.get("watchHistory", [])}

@auth_router.delete("/watch-history/{uid}/{content_id}/{content_type}")
async def remove_watch_history(uid: str, content_id: int, content_type: str):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    db["users"].update_one(
        {"uid": uid},
        {"$pull": {"watchHistory": {"id": content_id, "type": content_type}}}
    )
    return {"success": True}
