from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "? Backend is running!", "status": "ok"}

# Routes the frontend is actually calling
@app.get("/api/content/movies/popular")
@app.get("/api/content/movies/now-playing")
async def get_movies(page: int = 1):
    return {"results": [], "page": page, "total_pages": 10}

@app.get("/api/content/series/popular")
async def get_series(page: int = 1):
    return {"results": [], "page": page, "total_pages": 10}

@app.get("/api/content/livetv/channels")
async def get_live_channels(category: str = "all"):
    return {"channels": [], "category": category}

@app.get("/api/content/livetv/categories")
async def get_live_categories():
    return {"categories": ["all", "news", "sports", "entertainment"]}

print("? All frontend-expected routes added")
