from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import httpx

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMDB_KEY = os.getenv("TMDB_API_KEY")

@app.get("/")
async def root():
    return {"message": "Backend running", "tmdb_key_set": bool(TMDB_KEY)}

@app.get("/api/content/movies/popular")
@app.get("/api/content/movies/now-playing")
async def movies(page: int = 1):
    if not TMDB_KEY:
        return {"results": []}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://api.themoviedb.org/3/movie/popular", params={"api_key": TMDB_KEY, "page": page})
        return r.json()

@app.get("/api/content/series/popular")
async def series(page: int = 1):
    if not TMDB_KEY:
        return {"results": []}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://api.themoviedb.org/3/tv/popular", params={"api_key": TMDB_KEY, "page": page})
        return r.json()

@app.get("/api/content/livetv/channels")
async def channels():
    return {"channels": []}
