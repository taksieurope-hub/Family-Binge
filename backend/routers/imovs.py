# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException
import httpx
from bs4 import BeautifulSoup

router = APIRouter(tags=["imovs"])

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "ka,en;q=0.9",
}

@router.get("/imovs/movies")
async def get_imovs_movies(page: int = 1):
    url = f"https://www.imovs.ge/filmebi-qartulad/page/{page}/"
    async with httpx.AsyncClient(timeout=15, headers=HEADERS, follow_redirects=True) as client:
        r = await client.get(url)
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail=f"imovs returned {r.status_code}")
    soup = BeautifulSoup(r.text, "html.parser")
    movies = []
    seen = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if ".html" not in href:
            continue
        full_url = href if href.startswith("http") else f"https://www.imovs.ge{href}"
        if full_url in seen:
            continue
        seen.add(full_url)
        img = a.find("img")
        title = ""
        if img:
            title = img.get("alt", "").strip()
        if not title:
            title = a.get_text(strip=True)
        if not title or len(title) < 3:
            continue
        poster = ""
        if img:
            poster = img.get("src", "") or img.get("data-src", "") or img.get("data-lazy-src", "")
            if poster and not poster.startswith("http"):
                poster = "https://www.imovs.ge" + poster
        movies.append({
            "title": title,
            "url": full_url,
            "poster": poster,
        })
    return {"movies": movies, "page": page}

@router.get("/imovs/stream")
async def get_imovs_stream(url: str):
    async with httpx.AsyncClient(timeout=15, headers=HEADERS, follow_redirects=True) as client:
        r = await client.get(url)
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail=f"imovs returned {r.status_code}")
    soup = BeautifulSoup(r.text, "html.parser")
    embed = None
    for iframe in soup.select("iframe"):
        src = iframe.get("src", "")
        if "adjaraneti" in src or "mondostudio" in src:
            embed = src
            break
    if not embed:
        raise HTTPException(status_code=404, detail="No embed found")
    title_el = soup.select_one("h1, .short-title")
    poster_el = soup.select_one(".full-poster img, .poster img, img[src*='uploads']")
    return {
        "embed_url": embed,
        "title": title_el.get_text(strip=True) if title_el else "",
        "poster": poster_el.get("src", "") if poster_el else "",
    }
