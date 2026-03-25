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
    return {"message": "? Backend is running!", "has_tmdb_key": bool(TMDB_API_KEY)}

@app.get("/api/content/movies/popular")
@app.get("/api/content/movies/now-playing")
async def get_movies(page: int = 1):
    if not TMDB_API_KEY:
        return {"results": [], "error": "No TMDB API key set"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE_URL}/movie/popular", 
            params={"api_key": TMDB_API_KEY, "page": page}
        )
        return resp.json()

@app.get("/api/content/series/popular")
async def get_series(page: int = 1):
    if not TMDB_API_KEY:
        return {"results": [], "error": "No TMDB API key set"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TMDB_BASE_URL}/tv/popular", 
            params={"api_key": TMDB_API_KEY, "page": page}
        )
        return resp.json()

@app.get("/api/content/livetv/channels")
async def get_live_channels():
    return {"channels": []}

print("? Backend with real TMDB integration loaded")
