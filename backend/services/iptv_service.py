import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

IPTV_CHANNELS = {
    "news": [
        {"id": "dw_en", "name": "DW News", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/DW_Logo_2012.svg/320px-DW_Logo_2012.svg.png", "category": "News", "country": "Germany", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
        {"id": "nasa_tv", "name": "NASA TV", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png", "category": "News", "country": "USA", "stream_url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8", "type": "hls"},
        {"id": "trt_world", "name": "TRT World", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/TRT_World_logo.svg/320px-TRT_World_logo.svg.png", "category": "News", "country": "Turkey", "stream_url": "https://tv-trtworld.live.trt.com.tr/master.m3u8", "type": "hls"},
        {"id": "al_jazeera", "name": "Al Jazeera English", "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English.svg/320px-Al_Jazeera_English.svg.png", "category": "News", "country": "Qatar", "stream_url": "https://live-hls-web-aje.getaj.net/AJE/index.m3u8", "type": "hls"},
        {"id": "france24_en", "name": "France 24 English", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/France_24_logo.svg/320px-France_24_logo.svg.png", "category": "News", "country": "France", "stream_url": "https://stream.france24.com/france24_en/live_hls/live_hls_web.m3u8", "type": "hls"},
        {"id": "euronews", "name": "Euronews English", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Euronews_logo.svg/320px-Euronews_logo.svg.png", "category": "News", "country": "Europe", "stream_url": "https://rakuten-euronews-1-gb.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "bloomberg", "name": "Bloomberg TV", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/New_Bloomberg_Logo.svg/320px-New_Bloomberg_Logo.svg.png", "category": "News", "country": "USA", "stream_url": "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01127-bloombergmedia-bloombergtv-samsungtv/playlist.m3u8", "type": "hls"},
        {"id": "ndtv", "name": "NDTV 24x7", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NDTV_logo.svg/320px-NDTV_logo.svg.png", "category": "News", "country": "India", "stream_url": "https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8", "type": "hls"},
        {"id": "cgtn", "name": "CGTN", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/CGTN_logo.svg/320px-CGTN_logo.svg.png", "category": "News", "country": "China", "stream_url": "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8", "type": "hls"},
        {"id": "arirang", "name": "Arirang TV", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Arirang_TV_logo.svg/320px-Arirang_TV_logo.svg.png", "category": "News", "country": "South Korea", "stream_url": "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8", "type": "hls"},
    ],
    "sports": [
        {"id": "redbull_tv", "name": "Red Bull TV", "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Red_Bull_Racing_logo.svg/240px-Red_Bull_Racing_logo.svg.png", "category": "Sports", "country": "International", "stream_url": "https://rbmn-live.akamaized.net/hls/live/590964/BossRacing/master.m3u8", "type": "hls"},
        {"id": "accdn", "name": "ACC Digital Network", "logo": "https://i.imgur.com/pQAu0Hw.png", "category": "Sports", "country": "USA", "stream_url": "https://raycom-accdn-firetv.amagi.tv/playlist.m3u8", "type": "hls"},
        {"id": "golf_kingdom", "name": "Golf Kingdom", "logo": "https://i.imgur.com/f6x3z2Z.png", "category": "Sports", "country": "USA", "stream_url": "https://30a-tv.com/feeds/vidaa/golf.m3u8", "type": "hls"},
        {"id": "fight_sports", "name": "Fight Sports", "logo": "https://i.imgur.com/qAPn73l.png", "category": "Sports", "country": "USA", "stream_url": "https://fighting-fightingsports-1-de.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "outdoor_america", "name": "Outdoor America", "logo": "https://i.imgur.com/wYrQLBg.png", "category": "Sports", "country": "USA", "stream_url": "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01290-outdooramerica-outdooramerica-samsungtv/playlist.m3u8", "type": "hls"},
    ],
    "rugby": [
        {"id": "dw_rugby", "name": "DW (Rugby Coverage)", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/DW_Logo_2012.svg/320px-DW_Logo_2012.svg.png", "category": "Rugby", "country": "International", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
        {"id": "redbull_rugby", "name": "Red Bull TV (Rugby)", "logo": "https://i.imgur.com/pQAu0Hw.png", "category": "Rugby", "country": "International", "stream_url": "https://rbmn-live.akamaized.net/hls/live/590964/BossRacing/master.m3u8", "type": "hls"},
        {"id": "trt_rugby", "name": "TRT World (Rugby)", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/TRT_World_logo.svg/320px-TRT_World_logo.svg.png", "category": "Rugby", "country": "International", "stream_url": "https://tv-trtworld.live.trt.com.tr/master.m3u8", "type": "hls"},
    ],
    "football": [
        {"id": "al_jazeera_football", "name": "Al Jazeera (Football)", "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English.svg/320px-Al_Jazeera_English.svg.png", "category": "Football", "country": "International", "stream_url": "https://live-hls-web-aje.getaj.net/AJE/index.m3u8", "type": "hls"},
        {"id": "dw_football", "name": "DW (Football)", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/DW_Logo_2012.svg/320px-DW_Logo_2012.svg.png", "category": "Football", "country": "International", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
        {"id": "redbull_football", "name": "Red Bull TV (Football)", "logo": "https://i.imgur.com/pQAu0Hw.png", "category": "Football", "country": "International", "stream_url": "https://rbmn-live.akamaized.net/hls/live/590964/BossRacing/master.m3u8", "type": "hls"},
    ],
    "entertainment": [
        {"id": "comet_tv", "name": "Comet TV", "logo": "https://i.imgur.com/FrH3vJ5.png", "category": "Entertainment", "country": "USA", "stream_url": "https://comet-comet-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "charge_tv", "name": "Charge TV", "logo": "https://i.imgur.com/7V9pkVS.png", "category": "Entertainment", "country": "USA", "stream_url": "https://charge-charge-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "loomed_tv", "name": "Loomed TV", "logo": "https://i.imgur.com/kQF5B2L.png", "category": "Entertainment", "country": "USA", "stream_url": "https://30a-tv.com/loomer.m3u8", "type": "hls"},
        {"id": "dove_channel", "name": "Dove Channel", "logo": "https://i.imgur.com/gQlT8kP.png", "category": "Entertainment", "country": "USA", "stream_url": "https://dove-dovechannel-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "people_tv", "name": "People TV", "logo": "https://i.imgur.com/Kp8v2Ql.png", "category": "Entertainment", "country": "USA", "stream_url": "https://people-peopletv-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
    ],
    "movies": [
        {"id": "adventure_earth", "name": "Adventure Earth", "logo": "https://i.imgur.com/JZe2B3A.png", "category": "Movies", "country": "USA", "stream_url": "https://a57e9c69976649b582a8d7604c00e69a.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/RlaxxTV-eu_AdventureEarth/playlist.m3u8", "type": "hls"},
        {"id": "filmrise_movies", "name": "FilmRise Movies", "logo": "https://i.imgur.com/vRLMr8K.png", "category": "Movies", "country": "USA", "stream_url": "https://filmrise-filmrise-movies-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "maverick_movies", "name": "Maverick Movies", "logo": "https://i.imgur.com/NvQ3FZL.png", "category": "Movies", "country": "USA", "stream_url": "https://mav-maverickmovies-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "westerns_tv", "name": "Westerns TV", "logo": "https://i.imgur.com/Y5bKx4D.png", "category": "Movies", "country": "USA", "stream_url": "https://westerns-westernstv-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "horror_tv", "name": "Horror TV", "logo": "https://i.imgur.com/Sq5PLpH.png", "category": "Movies", "country": "USA", "stream_url": "https://horror-horrortv-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
    ],
    "kids": [
        {"id": "3abn_kids", "name": "3ABN Kids", "logo": "https://i.imgur.com/Qzpj3nA.png", "category": "Kids", "country": "USA", "stream_url": "https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8", "type": "hls"},
        {"id": "baby_first", "name": "Baby First TV", "logo": "https://i.imgur.com/rLM8ksB.png", "category": "Kids", "country": "USA", "stream_url": "https://babyfirst-babyfirst-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "kartoon", "name": "Kartoon Channel", "logo": "https://i.imgur.com/Q5RKPMJ.png", "category": "Kids", "country": "USA", "stream_url": "https://kartoon-kartoon-channel-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "kidoodle", "name": "Kidoodle TV", "logo": "https://i.imgur.com/1F5vQ2Z.png", "category": "Kids", "country": "USA", "stream_url": "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/kidoodle-kidoodle/main.m3u8", "type": "hls"},
        {"id": "toongoober", "name": "Toon Goober", "logo": "https://i.imgur.com/7pB3xMH.png", "category": "Kids", "country": "USA", "stream_url": "https://toongoober-toongoober-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
    ],
    "documentary": [
        {"id": "adventure_earth_doc", "name": "Adventure Earth", "logo": "https://i.imgur.com/pQTx5qF.png", "category": "Documentary", "country": "USA", "stream_url": "https://a57e9c69976649b582a8d7604c00e69a.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/RlaxxTV-eu_AdventureEarth/playlist.m3u8", "type": "hls"},
        {"id": "law_crime", "name": "Law & Crime", "logo": "https://i.imgur.com/Qp5JxKz.png", "category": "Documentary", "country": "USA", "stream_url": "https://law-crime-lnc-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "weather_nation", "name": "Weather Nation", "logo": "https://i.imgur.com/K5qLpJz.png", "category": "Documentary", "country": "USA", "stream_url": "https://weathernation-weathernation-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "al_jazeera_doc", "name": "Al Jazeera Documentary", "logo": "https://i.imgur.com/pHJL2qA.png", "category": "Documentary", "country": "Qatar", "stream_url": "https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8", "type": "hls"},
        {"id": "nasa_doc", "name": "NASA TV", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png", "category": "Documentary", "country": "USA", "stream_url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8", "type": "hls"},
    ],
    "music": [
        {"id": "vevo_pop", "name": "Vevo Pop", "logo": "https://i.imgur.com/qLp5JKz.png", "category": "Music", "country": "USA", "stream_url": "https://vevo-vevo-pop-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "vevo_hiphop", "name": "Vevo Hip-Hop", "logo": "https://i.imgur.com/Hp3LqJz.png", "category": "Music", "country": "USA", "stream_url": "https://vevo-vevo-hip-hop-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "vevo_country", "name": "Vevo Country", "logo": "https://i.imgur.com/Rp5JqKz.png", "category": "Music", "country": "USA", "stream_url": "https://vevo-vevo-country-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "hits_tv", "name": "Hits TV", "logo": "https://i.imgur.com/xKp3qJz.png", "category": "Music", "country": "UK", "stream_url": "https://hits-hitstv-1-gb.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "country_music", "name": "Country Music TV", "logo": "https://i.imgur.com/Kp3LqJz.png", "category": "Music", "country": "USA", "stream_url": "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01290-countrymusictvusa-countrymusictvusa-samsungtv/playlist.m3u8", "type": "hls"},
    ],
    "religious": [
        {"id": "tbn", "name": "TBN", "logo": "https://i.imgur.com/Rp5JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://tbn-tbn-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "hope_channel", "name": "Hope Channel", "logo": "https://i.imgur.com/Lp3JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://hope-hope-channel-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "ewtn", "name": "EWTN", "logo": "https://i.imgur.com/Hp5JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://cdn3.wowza.com/1/V09EU21sNVJWU28z/bWpIaUZn/hls/live/playlist.m3u8", "type": "hls"},
        {"id": "daystar", "name": "Daystar", "logo": "https://i.imgur.com/Kp3LqJz.png", "category": "Religious", "country": "USA", "stream_url": "https://wowzaprod141-i.akamaihd.net/hls/live/551320/6c91088b/playlist.m3u8", "type": "hls"},
        {"id": "3abn", "name": "3ABN", "logo": "https://i.imgur.com/Mp5JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://3abn.bozztv.com/3abn/live/smil:live.smil/playlist.m3u8", "type": "hls"},
    ],
    "african": [
        {"id": "sabc_news", "name": "SABC News", "logo": "https://i.imgur.com/Sp5JqKz.png", "category": "African", "country": "South Africa", "stream_url": "https://sabc-news-live.akamaized.net/hls/live/2038305/sabcnewslive/master.m3u8", "type": "hls"},
        {"id": "dstv_403", "name": "eNCA South Africa", "logo": "https://i.imgur.com/Np3JqKz.png", "category": "African", "country": "South Africa", "stream_url": "https://enca-live.ssl.cdn.cra.cz/stream/enca/playlist.m3u8", "type": "hls"},
        {"id": "channels_tv", "name": "Channels TV Nigeria", "logo": "https://i.imgur.com/Np3JqKz.png", "category": "African", "country": "Nigeria", "stream_url": "https://ythls.armelin.one/channel/UCCh9v8Gqd3hBDYsYLZn7cgA.m3u8", "type": "hls"},
        {"id": "africanews", "name": "Africanews", "logo": "https://i.imgur.com/Pp3JqKz.png", "category": "African", "country": "Africa", "stream_url": "https://ythls.armelin.one/channel/UC1_E8NeF5QHY2dtdLRBCCLA.m3u8", "type": "hls"},
        {"id": "ktn_kenya", "name": "KTN News Kenya", "logo": "https://i.imgur.com/Qp5JqKz.png", "category": "African", "country": "Kenya", "stream_url": "https://ythls.armelin.one/channel/UCKVsdzkszXQdJ0t9FTq0ySg.m3u8", "type": "hls"},
    ],
}

def get_all_channels() -> List[Dict[str, Any]]:
    all_channels = []
    channel_number = 100
    for category, channels in IPTV_CHANNELS.items():
        for channel in channels:
            all_channels.append({**channel, "number": str(channel_number)})
            channel_number += 1
    return all_channels

def get_channels_by_category(category: str) -> List[Dict[str, Any]]:
    category_lower = category.lower()
    if category_lower == "all":
        return get_all_channels()
    channels = IPTV_CHANNELS.get(category_lower, [])
    return [{**ch, "number": str(100 + i)} for i, ch in enumerate(channels)]

def get_channel_by_id(channel_id: str) -> Optional[Dict[str, Any]]:
    for channel in get_all_channels():
        if channel.get("id") == channel_id:
            return channel
    return None

def get_categories() -> List[str]:
    return ["All", "News", "Sports", "Rugby", "Football", "Entertainment", "Movies", "Kids", "Documentary", "Music", "Religious", "African"]

def search_channels(query: str) -> List[Dict[str, Any]]:
    query_lower = query.lower()
    return [ch for ch in get_all_channels() if
            query_lower in ch.get("name", "").lower() or
            query_lower in ch.get("country", "").lower() or
            query_lower in ch.get("category", "").lower()]
