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
    get_movies_by_genre, get_series_by_genre
)

from services.iptv_service import (
    get_all_channels, get_channels_by_category, get_channel_by_id,
    get_categories, search_channels
)

router = APIRouter(tags=["content"])

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

@router.get("/movies/{movie_id}")
async def movie_details(movie_id: int):
    """Get detailed movie information including trailer"""
    details = await get_movie_details(movie_id)
    if not details:
        raise HTTPException(status_code=404, detail="Movie not found")
    return details

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

@router.get("/series/{series_id}")
async def series_details(series_id: int):
    """Get detailed series information including trailer"""
    details = await get_series_details(series_id)
    if not details:
        raise HTTPException(status_code=404, detail="Series not found")
    return details

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
                # Binary segment (TS, AAC, etc.) — stream it directly
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