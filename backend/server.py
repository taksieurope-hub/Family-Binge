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

# Import the actual router you have
try:
    from routers.content import router as content_router
    app.include_router(content_router, prefix="/api/content", tags=["content"])
    print("? Loaded content router")
except Exception as e:
    print("Content router failed:", e)

@app.get("/")
async def root():
    return {"message": "? Backend is running!", "status": "ok"}

@app.get("/live/channels")
async def get_live_channels():
    return {"message": "Live channels endpoint ready", "channels": []}

print("? Server started successfully")
