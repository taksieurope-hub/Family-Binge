import os
import httpx
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger(__name__)

# TMDB API Configuration
TMDB_API_KEYS = [os.getenv("TMDB_API_KEY", "c83d3380bc5b34c940a447a375581533")]
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

current_key_index = 0

def get_api_key() -> str:
    """Rotate API keys if rate limited"""
    global current_key_index
    return TMDB_API_KEYS[current_key_index % len(TMDB_API_KEYS)]

def rotate_key():
    """Switch to next API key"""
    global current_key_index
    current_key_index += 1

async def tmdb_request(endpoint: str, params: dict = None) -> Optional[dict]:
    """Make request to TMDB API with key rotation"""
    if params is None:
        params = {}
    
    params["api_key"] = get_api_key()
    url = f"{TMDB_BASE_URL}{endpoint}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(url, params=params)
            if response.status_code == 429:  # Rate limited
                rotate_key()
                params["api_key"] = get_api_key()
                response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"TMDB API error: {e}")
            return None

async def get_trending_movies(page: int = 1) -> List[Dict[str, Any]]:
    """Get trending movies"""
    data = await tmdb_request("/trending/movie/week", {"page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_popular_movies(page: int = 1) -> List[Dict[str, Any]]:
    """Get popular movies"""
    data = await tmdb_request("/movie/popular", {"page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_top_rated_movies(page: int = 1) -> List[Dict[str, Any]]:
    """Get top rated movies"""
    data = await tmdb_request("/movie/top_rated", {"page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_now_playing_movies(page: int = 1) -> List[Dict[str, Any]]:
    """Get now playing movies"""
    data = await tmdb_request("/movie/now_playing", {"page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_upcoming_movies(page: int = 1) -> List[Dict[str, Any]]:
    """Get upcoming movies"""
    data = await tmdb_request("/movie/upcoming", {"page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_trending_series(page: int = 1) -> List[Dict[str, Any]]:
    """Get trending TV series"""
    data = await tmdb_request("/trending/tv/week", {"page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_popular_series(page: int = 1) -> List[Dict[str, Any]]:
    """Get popular TV series"""
    data = await tmdb_request("/tv/popular", {"page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_top_rated_series(page: int = 1) -> List[Dict[str, Any]]:
    """Get top rated TV series"""
    data = await tmdb_request("/tv/top_rated", {"page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_movie_details(movie_id: int) -> Optional[Dict[str, Any]]:
    """Get detailed movie info including videos"""
    data = await tmdb_request(f"/movie/{movie_id}", {"append_to_response": "videos,credits,similar"})
    if data:
        return format_movie_details(data)
    return None

async def get_series_details(series_id: int) -> Optional[Dict[str, Any]]:
    """Get detailed series info including videos"""
    data = await tmdb_request(f"/tv/{series_id}", {"append_to_response": "videos,credits,similar"})
    if data:
        return format_series_details(data)
    return None

async def search_movies(query: str, page: int = 1) -> List[Dict[str, Any]]:
    """Search for movies"""
    data = await tmdb_request("/search/movie", {"query": query, "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def search_series(query: str, page: int = 1) -> List[Dict[str, Any]]:
    """Search for TV series"""
    data = await tmdb_request("/search/tv", {"query": query, "page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def search_multi(query: str, page: int = 1) -> List[Dict[str, Any]]:
    """Search for movies and TV series"""
    data = await tmdb_request("/search/multi", {"query": query, "page": page})
    if data and "results" in data:
        results = []
        for item in data["results"]:
            if item.get("media_type") == "movie":
                results.append(format_movie(item))
            elif item.get("media_type") == "tv":
                results.append(format_series_item(item))
        return results, data.get("total_pages", 1)
    return [], 1

async def get_movie_genres() -> List[Dict[str, Any]]:
    """Get all movie genres"""
    data = await tmdb_request("/genre/movie/list")
    if data and "genres" in data:
        return data["genres"]
    return []

async def get_tv_genres() -> List[Dict[str, Any]]:
    """Get all TV genres"""
    data = await tmdb_request("/genre/tv/list")
    if data and "genres" in data:
        return data["genres"]
    return []

async def get_movies_by_genre(genre_id: int, page: int = 1) -> List[Dict[str, Any]]:
    """Get movies by genre"""
    data = await tmdb_request("/discover/movie", {"with_genres": genre_id, "page": page, "sort_by": "popularity.desc"})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_series_by_genre(genre_id: int, page: int = 1) -> List[Dict[str, Any]]:
    """Get TV series by genre"""
    data = await tmdb_request("/discover/tv", {"with_genres": genre_id, "page": page, "sort_by": "popularity.desc"})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

def format_movie(movie: dict) -> dict:
    """Format a single movie"""
    return {
        "id": movie.get("id"),
        "title": movie.get("title", "Unknown"),
        "poster": f"{TMDB_IMAGE_BASE}/w500{movie.get('poster_path')}" if movie.get("poster_path") else None,
        "backdrop": f"{TMDB_IMAGE_BASE}/original{movie.get('backdrop_path')}" if movie.get("backdrop_path") else None,
        "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "N/A",
        "rating": round(movie.get("vote_average", 0), 1),
        "overview": movie.get("overview", ""),
        "genre_ids": movie.get("genre_ids", []),
        "popularity": movie.get("popularity", 0),
        "type": "movie"
    }

def format_movies(movies: list) -> list:
    """Format list of movies"""
    return [format_movie(m) for m in movies if m.get("poster_path")]

def format_series_item(series: dict) -> dict:
    """Format a single TV series"""
    return {
        "id": series.get("id"),
        "title": series.get("name", "Unknown"),
        "poster": f"{TMDB_IMAGE_BASE}/w500{series.get('poster_path')}" if series.get("poster_path") else None,
        "backdrop": f"{TMDB_IMAGE_BASE}/original{series.get('backdrop_path')}" if series.get("backdrop_path") else None,
        "year": series.get("first_air_date", "")[:4] if series.get("first_air_date") else "N/A",
        "rating": round(series.get("vote_average", 0), 1),
        "overview": series.get("overview", ""),
        "genre_ids": series.get("genre_ids", []),
        "popularity": series.get("popularity", 0),
        "type": "series"
    }

def format_series(series_list: list) -> list:
    """Format list of TV series"""
    return [format_series_item(s) for s in series_list if s.get("poster_path")]

def format_movie_details(movie: dict) -> dict:
    """Format detailed movie info"""
    # Get YouTube trailer
    youtube_id = None
    if "videos" in movie and "results" in movie["videos"]:
        for video in movie["videos"]["results"]:
            if video.get("site") == "YouTube" and video.get("type") in ["Trailer", "Teaser"]:
                youtube_id = video.get("key")
                break
    
    # Get cast
    cast = []
    if "credits" in movie and "cast" in movie["credits"]:
        cast = [{
            "name": c.get("name"),
            "character": c.get("character"),
            "profile": f"{TMDB_IMAGE_BASE}/w185{c.get('profile_path')}" if c.get("profile_path") else None
        } for c in movie["credits"]["cast"][:10]]
    
    # Get similar movies
    similar = []
    if "similar" in movie and "results" in movie["similar"]:
        similar = format_movies(movie["similar"]["results"][:6])
    
    return {
        "id": movie.get("id"),
        "title": movie.get("title", "Unknown"),
        "poster": f"{TMDB_IMAGE_BASE}/w500{movie.get('poster_path')}" if movie.get("poster_path") else None,
        "backdrop": f"{TMDB_IMAGE_BASE}/original{movie.get('backdrop_path')}" if movie.get("backdrop_path") else None,
        "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "N/A",
        "release_date": movie.get("release_date"),
        "rating": round(movie.get("vote_average", 0), 1),
        "vote_count": movie.get("vote_count", 0),
        "overview": movie.get("overview", ""),
        "genres": [g.get("name") for g in movie.get("genres", [])],
        "runtime": movie.get("runtime", 0),
        "tagline": movie.get("tagline", ""),
        "youtube_id": youtube_id,
        "cast": cast,
        "similar": similar,
        "type": "movie"
    }

def format_series_details(series: dict) -> dict:
    """Format detailed series info"""
    # Get YouTube trailer
    youtube_id = None
    if "videos" in series and "results" in series["videos"]:
        for video in series["videos"]["results"]:
            if video.get("site") == "YouTube" and video.get("type") in ["Trailer", "Teaser", "Opening Credits"]:
                youtube_id = video.get("key")
                break
    
    # Get cast
    cast = []
    if "credits" in series and "cast" in series["credits"]:
        cast = [{
            "name": c.get("name"),
            "character": c.get("character"),
            "profile": f"{TMDB_IMAGE_BASE}/w185{c.get('profile_path')}" if c.get("profile_path") else None
        } for c in series["credits"]["cast"][:10]]
    
    # Get similar series
    similar = []
    if "similar" in series and "results" in series["similar"]:
        similar = format_series(series["similar"]["results"][:6])
    
    return {
        "id": series.get("id"),
        "title": series.get("name", "Unknown"),
        "poster": f"{TMDB_IMAGE_BASE}/w500{series.get('poster_path')}" if series.get("poster_path") else None,
        "backdrop": f"{TMDB_IMAGE_BASE}/original{series.get('backdrop_path')}" if series.get("backdrop_path") else None,
        "year": series.get("first_air_date", "")[:4] if series.get("first_air_date") else "N/A",
        "first_air_date": series.get("first_air_date"),
        "rating": round(series.get("vote_average", 0), 1),
        "vote_count": series.get("vote_count", 0),
        "overview": series.get("overview", ""),
        "genres": [g.get("name") for g in series.get("genres", [])],
        "seasons": series.get("number_of_seasons", 0),
        "episodes": series.get("number_of_episodes", 0),
        "status": series.get("status", ""),
        "tagline": series.get("tagline", ""),
        "youtube_id": youtube_id,
        "cast": cast,
        "similar": similar,
        "type": "series"
    }


async def get_bollywood_movies(page: int = 1):
    """Get popular Hindi/Bollywood movies"""
    data = await tmdb_request("/discover/movie", {"with_original_language": "hi", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_bollywood_trending(page: int = 1):
    """Get trending Hindi movies"""
    data = await tmdb_request("/discover/movie", {"with_original_language": "hi", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_hindi_series(page: int = 1):
    """Get popular Hindi TV series"""
    data = await tmdb_request("/discover/tv", {"with_original_language": "hi", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_hindi_series_trending(page: int = 1):
    """Get trending Hindi TV series"""
    data = await tmdb_request("/trending/tv/week", {"with_original_language": "hi", "page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1


async def get_georgian_movies(page: int = 1):
    """Get popular Georgian movies"""
    data = await tmdb_request("/discover/movie", {"with_original_language": "ka", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_georgian_series(page: int = 1):
    """Get popular Georgian TV series"""
    data = await tmdb_request("/discover/tv", {"with_original_language": "ka", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_russian_movies(page: int = 1):
    """Get popular Russian movies"""
    data = await tmdb_request("/discover/movie", {"with_original_language": "ru", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_russian_series(page: int = 1):
    """Get popular Russian TV series"""
    data = await tmdb_request("/discover/tv", {"with_original_language": "ru", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_series(data["results"]), data.get("total_pages", 1)
    return [], 1

async def get_georgian_trending_movies(page: int = 1):
    """Get trending Georgian + Russian movies combined"""
    ka = await tmdb_request("/discover/movie", {"with_original_language": "ka", "sort_by": "vote_count.desc", "page": page})
    ru = await tmdb_request("/discover/movie", {"with_original_language": "ru", "sort_by": "popularity.desc", "page": page})
    results = []
    if ka and "results" in ka:
        results += ka["results"]
    if ru and "results" in ru:
        results += ru["results"]
    results.sort(key=lambda x: x.get("popularity", 0), reverse=True)
    return format_movies(results[:20]), 1
