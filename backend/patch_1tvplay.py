# -*- coding: utf-8 -*-
import re

path = r'C:\Users\edahl\Desktop\Family Binge\backend\routers\content.py'
c = open(path, 'r', encoding='utf-8').read()

new_routes = '''
# ============ 1TVPLAY ENDPOINTS ============
@router.get("/1tvplay/movies")
async def get_1tvplay_movies(page: int = Query(1, ge=1)):
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"https://1tvplay.ge/api/movies?page={page}", headers={"Accept": "application/json"})
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="1tvplay API error")
        return r.json()

@router.get("/1tvplay/movie/{slug}")
async def get_1tvplay_movie(slug: str):
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"https://1tvplay.ge/api/movie/{slug}", headers={"Accept": "application/json"})
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="Movie not found")
        data = r.json()
        urls = data.get("video_urls_json", {}).get("ge", {})
        return {
            "slug": slug,
            "title": data.get("title", ""),
            "poster": data.get("poster", ""),
            "cover": data.get("cover", ""),
            "year": data.get("release_year", ""),
            "imdb": data.get("imdb", ""),
            "description": data.get("body", ""),
            "stream_480p": urls.get("resolution_480p_url"),
            "stream_720p": urls.get("resolution_720p_url"),
            "stream_1080p": urls.get("resolution_1080p_url"),
        }

@router.get("/1tvplay/homepage")
async def get_1tvplay_homepage():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get("https://1tvplay.ge/api/homepage", headers={"Accept": "application/json"})
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="1tvplay API error")
        data = r.json()
        movies = []
        for section in data.get("sections", []):
            for item in section.get("data", []):
                if item.get("type") == "movie":
                    urls = item.get("video_urls_json", {}).get("ge", {})
                    movies.append({
                        "slug": item.get("slug"),
                        "title": item.get("title"),
                        "poster": item.get("poster"),
                        "cover": item.get("cover"),
                        "year": item.get("release_year"),
                        "imdb": item.get("imdb"),
                        "stream_480p": urls.get("resolution_480p_url"),
                        "stream_720p": urls.get("resolution_720p_url"),
                        "stream_1080p": urls.get("resolution_1080p_url"),
                    })
        return {"movies": movies}
'''

# Insert before the last line or after the last route
c = c + new_routes
open(path, 'w', encoding='utf-8').write(c)
print("Done!")
