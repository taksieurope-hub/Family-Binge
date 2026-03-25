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
    return {"message": "? Backend is working!", "status": "ok"}

@app.get("/live/channels")
async def get_live_channels():
    return {"message": "Live channels ready", "channels": []}

print("? Minimal backend loaded successfully")
