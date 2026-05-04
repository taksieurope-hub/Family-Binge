from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(tags=["streams"])

SCRAPERS = [
    "https://vidsrc.me/embed/{type}/{id}",
    "https://vidsrc.to/embed/{type}/{id}",
]

async def check_stream(url: str) -> bool:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.head(url, follow_redirects=True)
            return r.status_code == 200
    except:
        return False

@router.get("/stream/{type}/{id}")
async def get_stream(type: str, id: str, season: int = 1, episode: int = 1):
    sources = []
    for scraper in SCRAPERS:
        if type == "series":
            url = scraper.format(type="tv", id=f"{id}/{season}/{episode}")
        else:
            url = scraper.format(type="movie", id=id)
        sources.append({"url": url, "working": await check_stream(url)})
    
    working = [s for s in sources if s["working"]]
    if not working:
        raise HTTPException(status_code=404, detail="No working streams found")
    
    return {"streams": working, "best": working[0]["url"]}
