from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Family Binge API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Family Binge Backend is running! ?"}

# Try to include routers (this is the most common structure)
try:
    from routers.live import router as live_router
    app.include_router(live_router, prefix="/live", tags=["live"])
except:
    pass

try:
    from routers.movies import router as movies_router
    app.include_router(movies_router, prefix="/movies", tags=["movies"])
except:
    pass

try:
    from routers.series import router as series_router
    app.include_router(series_router, prefix="/series", tags=["series"])
except:
    pass

# Alternative common names
try:
    from routers.iptv_service import router as iptv_router
    app.include_router(iptv_router, prefix="/live", tags=["live"])
except:
    pass
