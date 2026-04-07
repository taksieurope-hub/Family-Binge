from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional, List
from pydantic import BaseModel
import httpx
import asyncio

from services.tmdb_service import (
    get_trending_movies, get_popular_movies, get_top_rated_movies,
    get_now_playing_movies, get_upcoming_movies,
    get_trending_series, get_popular_series, get_top_rated_series,
    get_movie_details, get_series_details,
    search_movies, search_series, search_multi,
    get_movie_genres, get_tv_genres,
    get_movies_by_genre, get_series_by_genre,
    get_bollywood_movies, get_bollywood_trending, get_hindi_series, get_hindi_series_trending,
    get_georgian_movies, get_georgian_series, get_russian_movies, get_russian_series, get_georgian_trending_movies
)

from services.iptv_service import (
    get_all_channels, get_channels_by_category, get_channel_by_id,
    get_categories, search_channels
)

router = APIRouter(tags=["content"])
# ============ GEORGIAN / KARTULI ENDPOINTS ============
@router.get("/movies/georgian/popular")
async def georgian_movies(page: int = Query(1, ge=1, le=500)):
    """Get popular Georgian movies"""
    movies, total_pages = await get_georgian_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/georgian/trending")
async def georgian_movies_trending(page: int = Query(1, ge=1, le=500)):
    """Get trending Georgian + Russian movies"""
    movies, total_pages = await get_georgian_trending_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/russian/popular")
async def russian_movies(page: int = Query(1, ge=1, le=500)):
    """Get popular Russian movies"""
    movies, total_pages = await get_russian_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/series/georgian/popular")
async def georgian_series(page: int = Query(1, ge=1, le=500)):
    """Get popular Georgian series"""
    series, total_pages = await get_georgian_series(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)

@router.get("/series/russian/popular")
async def russian_series(page: int = Query(1, ge=1, le=500)):
    """Get popular Russian series"""
    series, total_pages = await get_russian_series(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)



# Response Models
class ContentListResponse(BaseModel):
    items: list
    total_pages: int
    page: int

class ChannelListResponse(BaseModel):
    channels: list
    total: int

# ============ MOVIES ENDPOINTS ============

@router.get("/movies/trending")
async def trending_movies(page: int = Query(1, ge=1, le=500)):
    """Get trending movies this week"""
    movies, total_pages = await get_trending_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/popular")
async def popular_movies(page: int = Query(1, ge=1, le=500)):
    """Get popular movies"""
    movies, total_pages = await get_popular_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/top-rated")
async def top_rated_movies(page: int = Query(1, ge=1, le=500)):
    """Get top rated movies of all time"""
    movies, total_pages = await get_top_rated_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/now-playing")
async def now_playing_movies(page: int = Query(1, ge=1, le=500)):
    """Get movies currently in theaters"""
    movies, total_pages = await get_now_playing_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/upcoming")
async def upcoming_movies(page: int = Query(1, ge=1, le=500)):
    """Get upcoming movies"""
    movies, total_pages = await get_upcoming_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/genres")
async def movie_genres():
    """Get all movie genres"""
    genres = await get_movie_genres()
    return {"genres": genres}

@router.get("/movies/genre/{genre_id}")
async def movies_by_genre(genre_id: int, page: int = Query(1, ge=1, le=500)):
    """Get movies by genre"""
    movies, total_pages = await get_movies_by_genre(genre_id, page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)


@router.get("/movies/search/{query}")
async def search_movies_endpoint(query: str, page: int = Query(1, ge=1, le=500)):
    """Search for movies"""
    movies, total_pages = await search_movies(query, page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

# ============ SERIES ENDPOINTS ============

@router.get("/series/trending")
async def trending_series(page: int = Query(1, ge=1, le=500)):
    """Get trending TV series this week"""
    series, total_pages = await get_trending_series(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)

@router.get("/series/popular")
async def popular_series(page: int = Query(1, ge=1, le=500)):
    """Get popular TV series"""
    series, total_pages = await get_popular_series(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)

@router.get("/series/top-rated")
async def top_rated_series(page: int = Query(1, ge=1, le=500)):
    """Get top rated TV series of all time"""
    series, total_pages = await get_top_rated_series(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)

@router.get("/series/genres")
async def series_genres():
    """Get all TV series genres"""
    genres = await get_tv_genres()
    return {"genres": genres}

@router.get("/series/genre/{genre_id}")
async def series_by_genre(genre_id: int, page: int = Query(1, ge=1, le=500)):
    """Get TV series by genre"""
    series, total_pages = await get_series_by_genre(genre_id, page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)


@router.get("/series/search/{query}")
async def search_series_endpoint(query: str, page: int = Query(1, ge=1, le=500)):
    """Search for TV series"""
    series, total_pages = await search_series(query, page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)

# ============ UNIFIED SEARCH ============

@router.get("/search")
async def search_all(q: str = Query(..., min_length=1), page: int = Query(1, ge=1, le=500)):
    """Search for movies and TV series"""
    results, total_pages = await search_multi(q, page)
    return ContentListResponse(items=results, total_pages=total_pages, page=page)


# ============ BOLLYWOOD / HINDI ENDPOINTS ============

@router.get("/movies/bollywood/popular")
async def bollywood_popular(page: int = Query(1, ge=1, le=500)):
    """Get popular Bollywood/Hindi movies"""
    movies, total_pages = await get_bollywood_movies(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/movies/bollywood/trending")
async def bollywood_trending(page: int = Query(1, ge=1, le=500)):
    """Get trending Bollywood/Hindi movies"""
    movies, total_pages = await get_bollywood_trending(page)
    return ContentListResponse(items=movies, total_pages=total_pages, page=page)

@router.get("/series/hindi/popular")
async def hindi_series_popular(page: int = Query(1, ge=1, le=500)):
    """Get popular Hindi TV series"""
    series, total_pages = await get_hindi_series(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)

@router.get("/series/hindi/trending")
async def hindi_series_trending(page: int = Query(1, ge=1, le=500)):
    """Get trending Hindi TV series"""
    series, total_pages = await get_hindi_series_trending(page)
    return ContentListResponse(items=series, total_pages=total_pages, page=page)
# ============ LIVE TV ENDPOINTS ============

@router.get("/livetv/channels")
async def get_live_channels(category: str = Query("all")):
    """Get all live TV channels, optionally filtered by category"""
    channels = get_channels_by_category(category)
    return ChannelListResponse(channels=channels, total=len(channels))

@router.get("/livetv/categories")
async def get_channel_categories():
    """Get all channel categories"""
    categories = get_categories()
    return {"categories": categories}

@router.get("/livetv/channel/{channel_id}")
async def get_channel(channel_id: str):
    """Get a specific channel by ID"""
    channel = get_channel_by_id(channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    return channel

@router.get("/livetv/search")
async def search_live_channels(q: str = Query(..., min_length=1)):
    """Search for live TV channels"""
    channels = search_channels(q)
    return ChannelListResponse(channels=channels, total=len(channels))

# ============ HLS PROXY FOR LIVE TV ============

@router.get("/livetv/proxy")
async def proxy_hls_stream(url: str = Query(..., description="HLS stream URL to proxy")):
    """Proxy HLS streams to bypass CORS restrictions.
    Rewrites ALL segment and playlist URLs to also go through this proxy,
    so HLS.js never makes a direct cross-origin request.
    """
    from urllib.parse import urlencode, quote

    PROXY_BASE = "/api/content/livetv/proxy?url="

    def make_proxy_url(segment_url: str, base_url: str) -> str:
        """Resolve a potentially relative URL and wrap it in the proxy."""
        if not segment_url.startswith("http"):
            segment_url = base_url.rstrip("/") + "/" + segment_url.lstrip("/")
        return PROXY_BASE + quote(segment_url, safe="")

    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            response = await client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.9",
                "Origin": "https://www.google.com",
                "Referer": "https://www.google.com/",
            })

            content_type = response.headers.get("content-type", "application/vnd.apple.mpegurl")
            base_url = "/".join(url.rsplit("/", 1)[:-1])

            if "mpegurl" in content_type.lower() or url.endswith(".m3u8") or url.endswith(".m3u"):
                playlist = response.text
                lines = playlist.split("\n")
                rewritten = []
                for line in lines:
                    stripped = line.strip()
                    if not stripped:
                        rewritten.append(line)
                        continue
                    # Rewrite URI attributes inside EXT-X tags e.g. #EXT-X-MEDIA:URI="..."
                    if stripped.startswith("#") and 'URI="' in stripped:
                        import re
                        def replace_uri(m):
                            inner = m.group(1)
                            return f'URI="{make_proxy_url(inner, base_url)}"'
                        stripped = re.sub(r'URI="([^"]+)"', replace_uri, stripped)
                        rewritten.append(stripped)
                    elif stripped.startswith("#"):
                        rewritten.append(line)
                    else:
                        # Segment or sub-playlist URL
                        rewritten.append(make_proxy_url(stripped, base_url))
                rewritten_playlist = "\n".join(rewritten)
                return StreamingResponse(
                    iter([rewritten_playlist.encode()]),
                    media_type="application/vnd.apple.mpegurl",
                    headers={
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "no-cache",
                    }
                )
            else:
                # Binary segment (TS, AAC, etc.) â€” stream it directly
                return StreamingResponse(
                    iter([response.content]),
                    media_type=content_type,
                    headers={
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "no-cache",
                    }
                )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Stream timeout - channel may be unavailable")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch stream: {str(e)}")


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

# ============ NEW CATEGORY ENDPOINTS ============
from services.tmdb_service import (
    get_movies_action, get_movies_animation, get_movies_horror, get_movies_documentary, get_movies_romance,
    get_series_action, get_series_animation, get_series_horror, get_series_documentary, get_series_romance,
    get_movies_netflix, get_movies_hbo, get_movies_prime, get_movies_disney,
    get_series_netflix, get_series_hbo, get_series_prime, get_series_disney,
    get_movies_south_africa, get_movies_africa, get_movies_nollywood, get_movies_korea,
    get_movies_anime, get_movies_hollywood, get_movies_classics, get_movies_oscars,
    get_movies_tyler_perry, get_movies_newly_added, get_movies_franchise,
    get_series_africa, get_series_nollywood, get_series_korea, get_series_anime,
    get_series_hollywood, get_series_classics, get_series_tyler_perry,
    get_series_newly_added, get_series_franchise, get_series_south_africa
)

@router.get("/movies/action")
async def movies_action(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_action(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/animation")
async def movies_animation(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_animation(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/horror")
async def movies_horror(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_horror(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/documentary")
async def movies_documentary(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_documentary(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/romance")
async def movies_romance(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_romance(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/netflix")
async def movies_netflix(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_netflix(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/hbo")
async def movies_hbo(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_hbo(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/prime")
async def movies_prime(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_prime(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/disney")
async def movies_disney(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_disney(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/south-africa")
async def movies_south_africa(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_south_africa(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/africa")
async def movies_africa(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_africa(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/nollywood")
async def movies_nollywood(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_nollywood(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/korea")
async def movies_korea(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_korea(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/anime")
async def movies_anime(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_anime(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/hollywood")
async def movies_hollywood(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_hollywood(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/classics")
async def movies_classics(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_classics(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/oscars")
async def movies_oscars(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_oscars(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/tyler-perry")
async def movies_tyler_perry(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_tyler_perry(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/newly-added")
async def movies_newly_added(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_newly_added(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/movies/franchise")
async def movies_franchise(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_movies_franchise(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/action")
async def series_action(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_action(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/animation")
async def series_animation(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_animation(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/horror")
async def series_horror(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_horror(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/documentary")
async def series_documentary(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_documentary(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/romance")
async def series_romance(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_romance(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/netflix")
async def series_netflix(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_netflix(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/hbo")
async def series_hbo(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_hbo(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/prime")
async def series_prime(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_prime(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/disney")
async def series_disney(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_disney(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/south-africa")
async def series_south_africa(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_south_africa(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/africa")
async def series_africa(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_africa(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/nollywood")
async def series_nollywood(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_nollywood(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/korea")
async def series_korea(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_korea(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/anime")
async def series_anime(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_anime(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/hollywood")
async def series_hollywood(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_hollywood(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/classics")
async def series_classics(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_classics(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/tyler-perry")
async def series_tyler_perry(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_tyler_perry(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/newly-added")
async def series_newly_added(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_newly_added(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)

@router.get("/series/franchise")
async def series_franchise(page: int = Query(1, ge=1, le=500)):
    items, total_pages = await get_series_franchise(page)
    return ContentListResponse(items=items, total_pages=total_pages, page=page)
