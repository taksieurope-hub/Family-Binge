from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Family Binge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://family-binge-9lws.onrender.com",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Family Binge API running"}

from routers.content import router as content_router
from routers.payment import router as payment_router
app.include_router(payment_router, prefix="/api")
app.include_router(content_router, prefix="/api/content")
