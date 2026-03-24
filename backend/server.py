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
    return {"message": "? Backend is working now!", "status": "ok"}

@app.get("/live/channels")
async def live_channels():
    return {"channels": [], "message": "Live TV ready"}

print("Simple backend loaded - no routers")
