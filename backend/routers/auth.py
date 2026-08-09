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

class SecurityQuestionsRequest(BaseModel):
    uid: str
    moms_name: str
    dads_name: str
    birth_year: str

class ForgotPasswordRequest(BaseModel):
    email: str
    moms_name: str
    dads_name: str
    birth_year: str

@auth_router.post("/security-questions")
async def save_security_questions(req: SecurityQuestionsRequest):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    db["users"].update_one(
        {"uid": req.uid},
        {"$set": {
            "security_moms_name": req.moms_name.strip().lower(),
            "security_dads_name": req.dads_name.strip().lower(),
            "security_birth_year": req.birth_year.strip()
        }}
    )
    return {"success": True}

@auth_router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"email": req.email.lower().strip()})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with that email")
    if (user.get("security_moms_name") != req.moms_name.strip().lower() or
        user.get("security_dads_name") != req.dads_name.strip().lower() or
        user.get("security_birth_year") != req.birth_year.strip()):
        raise HTTPException(status_code=400, detail="Answers do not match our records")
    return {"password": user.get("password")}

class SubProfile(BaseModel):
    uid: str
    profile_id: str
    name: str
    avatar: str = "default"

class DeleteSubProfile(BaseModel):
    uid: str
    profile_id: str

@auth_router.get("/profiles/{uid}")
async def get_profiles(uid: str):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": uid}, {"profiles": 1, "name": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profiles = user.get("profiles", [])
    return {"profiles": profiles}

@auth_router.post("/profiles")
async def save_profile(req: SubProfile):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": req.uid}, {"profiles": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profiles = user.get("profiles", [])
    if len(profiles) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 profiles allowed")
    profiles.append({"id": req.profile_id, "name": req.name, "avatar": req.avatar})
    db["users"].update_one({"uid": req.uid}, {"$set": {"profiles": profiles}})
    return {"success": True}

@auth_router.delete("/profiles")
async def delete_profile(req: DeleteSubProfile):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    db["users"].update_one(
        {"uid": req.uid},
        {"$pull": {"profiles": {"id": req.profile_id}}}
    )
    return {"success": True}

@auth_router.post("/profile-watch-history/{uid}/{profile_id}")
async def save_profile_watch_history(uid: str, profile_id: str, item: WatchHistoryItem):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    key = f"watchHistory_{profile_id}"
    item_dict = item.dict()
    db["users"].update_one({"uid": uid}, {"$pull": {key: {"id": item.id, "type": item.type}}})
    db["users"].update_one({"uid": uid}, {"$push": {key: {"$each": [item_dict], "$position": 0, "$slice": 20}}})
    return {"success": True}

@auth_router.get("/profile-watch-history/{uid}/{profile_id}")
async def get_profile_watch_history(uid: str, profile_id: str):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    key = f"watchHistory_{profile_id}"
    user = db["users"].find_one({"uid": uid}, {key: 1})
    if not user:
        return {"history": []}
    return {"history": user.get(key, [])}

class VisitEvent(BaseModel):
    session_id: str
    path: str = None

class PlayEvent(BaseModel):
    session_id: str
    content_id: str
    content_type: str
    title: str = None

@auth_router.post("/analytics/visit")
async def track_visit(event: VisitEvent):
    db = get_mongo_db()
    if db is None:
        return {"success": False}
    db["analytics_visits"].insert_one({
        "session_id": event.session_id,
        "path": event.path,
        "timestamp": datetime.utcnow().isoformat()
    })
    return {"success": True}

@auth_router.post("/analytics/play")
async def track_play(event: PlayEvent):
    db = get_mongo_db()
    if db is None:
        return {"success": False}
    db["analytics_plays"].insert_one({
        "session_id": event.session_id,
        "content_id": event.content_id,
        "content_type": event.content_type,
        "title": event.title,
        "timestamp": datetime.utcnow().isoformat()
    })
    return {"success": True}

@auth_router.get("/analytics/summary")
async def analytics_summary(days: int = 7):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    since = (datetime.utcnow() - timedelta(days=days)).isoformat()
    visits = list(db["analytics_visits"].find({"timestamp": {"$gte": since}}))
    plays = list(db["analytics_plays"].find({"timestamp": {"$gte": since}}))
    unique_visitors = len(set(v["session_id"] for v in visits))
    unique_viewers = len(set(p["session_id"] for p in plays))
    from collections import Counter
    top_titles = Counter(p.get("title") or p.get("content_id") for p in plays).most_common(10)
    return {
        "days": days,
        "total_visits": len(visits),
        "unique_visitors": unique_visitors,
        "total_plays": len(plays),
        "unique_viewers": unique_viewers,
        "top_titles": [{"title": t, "plays": c} for t, c in top_titles]
    }

@auth_router.get("/analytics/recent")
async def analytics_recent(limit: int = 30):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    visits = list(db["analytics_visits"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
    plays = list(db["analytics_plays"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
    events = []
    for v in visits:
        events.append({"type": "visit", "timestamp": v["timestamp"], "detail": v.get("path") or "/"})
    for p in plays:
        events.append({"type": "play", "timestamp": p["timestamp"], "detail": p.get("title") or p.get("content_id")})
    events.sort(key=lambda e: e["timestamp"], reverse=True)
    return {"events": events[:limit]}

class SearchEvent(BaseModel):
    session_id: str
    query: str
    result_count: int = 0

@auth_router.post("/analytics/search")
async def track_search(event: SearchEvent):
    db = get_mongo_db()
    if db is None:
        return {"success": False}
    db["analytics_searches"].insert_one({
        "session_id": event.session_id,
        "query": event.query.strip().lower(),
        "result_count": event.result_count,
        "timestamp": datetime.utcnow().isoformat()
    })
    return {"success": True}

@auth_router.get("/analytics/top-searches")
async def top_searches(days: int = 7, limit: int = 20):
    db = get_mongo_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    since = (datetime.utcnow() - timedelta(days=days)).isoformat()
    searches = list(db["analytics_searches"].find({"timestamp": {"$gte": since}}))
    from collections import Counter
    counts = Counter(s["query"] for s in searches if s.get("query"))
    zero_result = Counter(s["query"] for s in searches if s.get("query") and s.get("result_count", 0) == 0)
    return {
        "days": days,
        "total_searches": len(searches),
        "top_searches": [{"query": q, "count": c} for q, c in counts.most_common(limit)],
        "zero_result_searches": [{"query": q, "count": c} for q, c in zero_result.most_common(limit)]
    }
