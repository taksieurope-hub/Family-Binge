from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import httpx
from pymongo import MongoClient
import bcrypt
from datetime import datetime

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client["familybinge"]
users = db["users"]

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

@app.get("/")
async def root():
    return {"status": "ok", "users_collection": "ready"}

# Register
@app.post("/api/auth/register")
async def register(data: dict):
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    # Check if user exists
    if users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    user = {
        "email": email,
        "password": hashed,
        "name": name,
        "created_at": datetime.utcnow(),
        "subscription": None,           # will be added later when they pay
        "role": "user"
    }

    users.insert_one(user)
    return {"message": "Account created successfully", "email": email}

# Login
@app.post("/api/auth/login")
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not bcrypt.checkpw(password.encode(), user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "name": user.get("name", ""),
            "subscription": user.get("subscription")
        }
    }
