import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

@app.get("/")
async def root():
    return {"message": "? Backend is running with TMDB!", "status": "ok"}

@app.get("/api/content/movies/popular")
async def get_popular_movies(page: int = 1):
    if not TMDB_API_KEY:
        return {"results": [], "error": "No TMDB API key"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{TMDB_BASE_URL}/movie/popular", params={"api_key": TMDB_API_KEY, "page": page})
        return resp.json()

@app.get("/api/content/livetv/channels")
async def get_live_channels():
    return {"channels": []}  # keep simple for now

print("? Backend ready with TMDB support")
