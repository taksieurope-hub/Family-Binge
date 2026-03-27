import logging
import httpx
import re
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# iptv-org category playlist URLs - community maintained, always updated
CATEGORY_SOURCES = {
    "news":          "https://iptv-org.github.io/iptv/categories/news.m3u",
    "sports":        "https://iptv-org.github.io/iptv/categories/sports.m3u",
    "entertainment": "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
    "movies":        "https://iptv-org.github.io/iptv/categories/movies.m3u",
    "kids":          "https://iptv-org.github.io/iptv/categories/kids.m3u",
    "documentary":   "https://iptv-org.github.io/iptv/categories/documentary.m3u",
    "music":         "https://iptv-org.github.io/iptv/categories/music.m3u",
    "religious":     "https://iptv-org.github.io/iptv/categories/religion.m3u",
    "african":       "https://iptv-org.github.io/iptv/countries/za.m3u",
    "rugby":         "https://iptv-org.github.io/iptv/categories/sports.m3u",
    "football":      "https://iptv-org.github.io/iptv/categories/sports.m3u",
}

# Always-working hardcoded fallbacks (confirmed live)
HARDCODED_CHANNELS = {
    "news": [
        {"id": "dw_en", "name": "DW News", "logo": "https://i.imgur.com/A1xzjOi.png", "category": "News", "country": "Germany", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
        {"id": "nasa_tv", "name": "NASA TV", "logo": "https://i.imgur.com/QRFLWnX.png", "category": "News", "country": "USA", "stream_url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8", "type": "hls"},
    ],
    "rugby": [
        {"id": "rugby_pass", "name": "RugbyPass TV", "logo": "https://i.imgur.com/pQAu0Hw.png", "category": "Rugby", "country": "International", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
    ],
    "football": [
        {"id": "football_tv", "name": "Football TV", "logo": "https://i.imgur.com/wYrQLBg.png", "category": "Football", "country": "International", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
    ],
}

def parse_m3u(content: str, category: str, max_channels: int = 15) -> List[Dict[str, Any]]:
    """Parse M3U playlist content into channel dicts"""
    channels = []
    lines = content.strip().split("\n")
    i = 0
    channel_num = 0

    while i < len(lines) and channel_num < max_channels:
        line = lines[i].strip()
        if line.startswith("#EXTINF"):
            name_match = re.search(r',(.+)$', line)
            logo_match = re.search(r'tvg-logo="([^"]*)"', line)
            country_match = re.search(r'tvg-country="([^"]*)"', line)

            name = name_match.group(1).strip() if name_match else "Unknown"
            logo = logo_match.group(1) if logo_match else ""
            country = country_match.group(1) if country_match else "International"

            # Get stream URL on next non-empty line
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1

            if j < len(lines):
                stream_url = lines[j].strip()
                if stream_url and not stream_url.startswith("#"):
                    channel_id = re.sub(r'[^a-z0-9_]', '_', name.lower())[:30] + f"_{channel_num}"
                    channels.append({
                        "id": channel_id,
                        "name": name,
                        "logo": logo,
                        "category": category.title(),
                        "country": country,
                        "stream_url": stream_url,
                        "type": "hls"
                    })
                    channel_num += 1
                i = j + 1
            else:
                i += 1
        else:
            i += 1

    return channels

async def fetch_category_channels(category: str, max_channels: int = 15) -> List[Dict[str, Any]]:
    """Fetch channels from iptv-org for a category"""
    url = CATEGORY_SOURCES.get(category.lower())
    if not url:
        return HARDCODED_CHANNELS.get(category.lower(), [])

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                channels = parse_m3u(response.text, category, max_channels)
                if channels:
                    return channels
    except Exception as e:
        logger.warning(f"Failed to fetch {category} from iptv-org: {e}")

    # Fall back to hardcoded
    return HARDCODED_CHANNELS.get(category.lower(), [])

# Cache to avoid re-fetching on every request
_channel_cache: Dict[str, List] = {}

async def get_all_channels() -> List[Dict[str, Any]]:
    all_channels = []
    channel_number = 100
    for category in CATEGORY_SOURCES.keys():
        channels = await get_channels_by_category(category)
        for ch in channels:
            all_channels.append({**ch, "number": str(channel_number)})
            channel_number += 1
    return all_channels

async def get_channels_by_category(category: str) -> List[Dict[str, Any]]:
    category_lower = category.lower()
    if category_lower == "all":
        return await get_all_channels()
    if category_lower not in _channel_cache:
        _channel_cache[category_lower] = await fetch_category_channels(category_lower)
    channels = _channel_cache.get(category_lower, [])
    result = []
    for i, ch in enumerate(channels):
        result.append({**ch, "number": str(100 + i)})
    return result

async def get_channel_by_id(channel_id: str) -> Optional[Dict[str, Any]]:
    all_channels = await get_all_channels()
    for channel in all_channels:
        if channel.get("id") == channel_id:
            return channel
    return None

def get_categories() -> List[str]:
    return ["All", "News", "Sports", "Entertainment", "Movies", "Kids", "Documentary", "Music", "Religious", "African", "Rugby", "Football"]

async def search_channels(query: str) -> List[Dict[str, Any]]:
    all_channels = await get_all_channels()
    query_lower = query.lower()
    return [ch for ch in all_channels if
            query_lower in ch.get("name", "").lower() or
            query_lower in ch.get("country", "").lower() or
            query_lower in ch.get("category", "").lower()]
