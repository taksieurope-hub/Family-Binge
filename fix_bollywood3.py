import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\backend\services\tmdb_service.py')
c = f.read_text(encoding='utf-8')

old = """async def get_bollywood_trending(page: int = 1):
    """Get trending Hindi movies"""
    data = await tmdb_request("/trending/movie/week", {"with_original_language": "hi", "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1"""

new = """async def get_bollywood_trending(page: int = 1):
    \"\"\"Get trending Hindi movies\"\"\"
    data = await tmdb_request("/discover/movie", {"with_original_language": "hi", "sort_by": "popularity.desc", "page": page})
    if data and "results" in data:
        return format_movies(data["results"]), data.get("total_pages", 1)
    return [], 1"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
