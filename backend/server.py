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

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

@app.get("/")
async def root():
    return {"status": "ok", "tmdb_key": bool(TMDB_API_KEY)}

@app.get("/api/content/movies/popular")
async def get_popular_movies(page: int = 1):
    if not TMDB_API_KEY:
        return {"results": []}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{TMDB_BASE_URL}/movie/popular", params={"api_key": TMDB_API_KEY, "page": page})
        return r.json()

@app.get("/api/content/movies")
async def get_movies(with_genres: str = None, page: int = 1):
    if not TMDB_API_KEY:
        return {"results": []}
    params = {"api_key": TMDB_API_KEY, "page": page}
    if with_genres:
        params["with_genres"] = with_genres
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{TMDB_BASE_URL}/discover/movie", params=params)
        return r.json()

@app.get("/api/content/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    if not TMDB_API_KEY:
        return {}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{TMDB_BASE_URL}/movie/{movie_id}", params={"api_key": TMDB_API_KEY})
        return r.json()

@app.get("/api/content/series/popular")
async def get_popular_series(page: int = 1):
    if not TMDB_API_KEY:
        return {"results": []}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{TMDB_BASE_URL}/tv/popular", params={"api_key": TMDB_API_KEY, "page": page})
        return r.json()

@app.get("/api/content/search")
async def search(q: str):
    if not TMDB_API_KEY:
        return {"results": []}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{TMDB_BASE_URL}/search/multi", params={"api_key": TMDB_API_KEY, "query": q})
        return r.json()

print("Backend with genre support started")
