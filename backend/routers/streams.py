from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["streams"])

@router.get("/stream/{type}/{id}")
async def get_stream(type: str, id: str, season: int = 1, episode: int = 1):
    if type == "series":
        sources = [
            {"name": "VidSrc.me", "url": f"https://vidsrc.me/embed/tv?tmdb={id}&season={season}&episode={episode}"},
            {"name": "VidSrc.to", "url": f"https://vidsrc.to/embed/tv/{id}/{season}/{episode}"},
        ]
    else:
        sources = [
            {"name": "VidSrc.me", "url": f"https://vidsrc.me/embed/movie?tmdb={id}"},
            {"name": "VidSrc.to", "url": f"https://vidsrc.to/embed/movie/{id}"},
        ]
    
    return {"streams": sources, "best": sources[0]["url"]}
