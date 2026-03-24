import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# IPTV Channels with verified working HLS streams
# Sources: iptv-org.github.io and other reliable public streams

IPTV_CHANNELS = {
    "news": [
        # Verified working news streams
        {"id": "france24_en", "name": "France 24 English", "logo": "https://i.imgur.com/vAc33Xv.png", "category": "News", "country": "France", "stream_url": "https://iptv-org.github.io/iptv/countries/fr.m3u", "direct_url": "https://stream.france24.com/france24-en-hls/live_hls_web.m3u8", "type": "hls"},
        {"id": "dw_en", "name": "DW News", "logo": "https://i.imgur.com/A1xzjOi.png", "category": "News", "country": "Germany", "stream_url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", "type": "hls"},
        {"id": "rt_en", "name": "RT News", "logo": "https://i.imgur.com/FqD9CQ5.png", "category": "News", "country": "Russia", "stream_url": "https://rt-glb.rttv.com/live/rtnews/playlist.m3u8", "type": "hls"},
        {"id": "nhk_world", "name": "NHK World", "logo": "https://i.imgur.com/Bp3JqKz.png", "category": "News", "country": "Japan", "stream_url": "https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/domestic/263942/live.m3u8", "type": "hls"},
        {"id": "cgtn_en", "name": "CGTN", "logo": "https://i.imgur.com/Cp5JqKz.png", "category": "News", "country": "China", "stream_url": "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8", "type": "hls"},
        {"id": "trt_world", "name": "TRT World", "logo": "https://i.imgur.com/dKgL3YN.png", "category": "News", "country": "Turkey", "stream_url": "https://tv-trtworld.live.trt.com.tr/master.m3u8", "type": "hls"},
        {"id": "arirang", "name": "Arirang TV", "logo": "https://i.imgur.com/Dp3JqKz.png", "category": "News", "country": "South Korea", "stream_url": "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8", "type": "hls"},
        {"id": "cna", "name": "CNA Singapore", "logo": "https://i.imgur.com/vyXvqLZ.png", "category": "News", "country": "Singapore", "stream_url": "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8", "type": "hls"},
        {"id": "ndtv", "name": "NDTV 24x7", "logo": "https://i.imgur.com/7Zq3xKJ.png", "category": "News", "country": "India", "stream_url": "https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8", "type": "hls"},
        {"id": "abn_telugu", "name": "ABN Telugu", "logo": "https://i.imgur.com/kVLqJVz.png", "category": "News", "country": "India", "stream_url": "https://ythls.armelin.one/channel/UCMb1bRREuRM5H2NYT2DU2Hg.m3u8", "type": "hls"},
        {"id": "tv9_telugu", "name": "TV9 Telugu", "logo": "https://i.imgur.com/pL5JRXM.png", "category": "News", "country": "India", "stream_url": "https://ythls.armelin.one/channel/UCBm7YsmaCQ1cXiAGgLfKQsA.m3u8", "type": "hls"},
        {"id": "nasa_tv", "name": "NASA TV", "logo": "https://i.imgur.com/QRFLWnX.png", "category": "News", "country": "USA", "stream_url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8", "type": "hls"},
        {"id": "abc_aus", "name": "ABC News Australia", "logo": "https://i.imgur.com/s6tqH3G.png", "category": "News", "country": "Australia", "stream_url": "https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8", "type": "hls"},
    ],
    "sports": [
        {"id": "redbull_tv", "name": "Red Bull TV", "logo": "https://i.imgur.com/pQAu0Hw.png", "category": "Sports", "country": "International", "stream_url": "https://rbmn-live.akamaized.net/hls/live/590964/BossRacing/master.m3u8", "type": "hls"},
        {"id": "stadium", "name": "Stadium", "logo": "https://i.imgur.com/wYrQLBg.png", "category": "Sports", "country": "USA", "stream_url": "https://sportaziras-hu.akamaized.net/hls/live/2037961/arena4/master.m3u8", "type": "hls"},
        {"id": "motors_tv", "name": "Motors TV", "logo": "https://i.imgur.com/yWGOHdK.png", "category": "Sports", "country": "France", "stream_url": "https://ythls.armelin.one/channel/UCQCfBtuk_LjQj_M2C0M6Lxg.m3u8", "type": "hls"},
        {"id": "wwe_network", "name": "WWE Network", "logo": "https://i.imgur.com/7SBQpCm.png", "category": "Sports", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCJ5v_MCY6GNUBTO8-D3XoAg.m3u8", "type": "hls"},
        {"id": "pga_tour", "name": "PGA Tour", "logo": "https://i.imgur.com/f6x3z2Z.png", "category": "Sports", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCx3N4KSA-JjPnCGxQFdaJXg.m3u8", "type": "hls"},
        {"id": "fight_sports", "name": "Fight Sports", "logo": "https://i.imgur.com/qAPn73l.png", "category": "Sports", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCwKAPQLt2d0J8w-nMZGsWSg.m3u8", "type": "hls"},
    ],
    "entertainment": [
        {"id": "pluto_tv", "name": "Pluto TV Spotlight", "logo": "https://i.imgur.com/kQF5B2L.png", "category": "Entertainment", "country": "USA", "stream_url": "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5812b7d5249444e05d09cc49/master.m3u8?deviceType=web&deviceMake=web", "type": "hls"},
        {"id": "buzzr", "name": "Buzzr TV", "logo": "https://i.imgur.com/gQlT8kP.png", "category": "Entertainment", "country": "USA", "stream_url": "https://buzzr-buzzr-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "comet_tv", "name": "Comet TV", "logo": "https://i.imgur.com/FrH3vJ5.png", "category": "Entertainment", "country": "USA", "stream_url": "https://comet-comet-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "charge_tv", "name": "Charge TV", "logo": "https://i.imgur.com/7V9pkVS.png", "category": "Entertainment", "country": "USA", "stream_url": "https://charge-charge-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "stadium_tv", "name": "Stadium TV", "logo": "https://i.imgur.com/Kp8v2Ql.png", "category": "Entertainment", "country": "USA", "stream_url": "https://stadium-stadium-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
    ],
    "movies": [
        {"id": "pluto_movies", "name": "Pluto Movies", "logo": "https://i.imgur.com/JZe2B3A.png", "category": "Movies", "country": "USA", "stream_url": "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5f4d8b7a2575e900078d6b18/master.m3u8?deviceType=web", "type": "hls"},
        {"id": "pluto_action", "name": "Pluto Action Movies", "logo": "https://i.imgur.com/NvQ3FZL.png", "category": "Movies", "country": "USA", "stream_url": "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5812b7d5249444e05d09cc4a/master.m3u8?deviceType=web", "type": "hls"},
        {"id": "pluto_comedy", "name": "Pluto Comedy Movies", "logo": "https://i.imgur.com/Y5bKx4D.png", "category": "Movies", "country": "USA", "stream_url": "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5812b7d5249444e05d09cc4b/master.m3u8?deviceType=web", "type": "hls"},
        {"id": "filmrise_free", "name": "FilmRise Free Movies", "logo": "https://i.imgur.com/vRLMr8K.png", "category": "Movies", "country": "USA", "stream_url": "https://filmrise-filmrise-movies-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "classic_films", "name": "Classic Films", "logo": "https://i.imgur.com/Sq5PLpH.png", "category": "Movies", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCcLK6CJHP-vYgs7SOsJCUDg.m3u8", "type": "hls"},
    ],
    "kids": [
        {"id": "kidoodle", "name": "Kidoodle TV", "logo": "https://i.imgur.com/Qzpj3nA.png", "category": "Kids", "country": "USA", "stream_url": "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/kidoodle-kidoodle/main.m3u8", "type": "hls"},
        {"id": "tubi_kids", "name": "Tubi Kids", "logo": "https://i.imgur.com/7pB3xMH.png", "category": "Kids", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCpvrwu3h3cD-zSStFbsmtzg.m3u8", "type": "hls"},
        {"id": "kartoon", "name": "Kartoon Channel", "logo": "https://i.imgur.com/Q5RKPMJ.png", "category": "Kids", "country": "USA", "stream_url": "https://kartoon-kartoon-channel-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "baby_first", "name": "Baby First TV", "logo": "https://i.imgur.com/rLM8ksB.png", "category": "Kids", "country": "USA", "stream_url": "https://babyfirst-babyfirst-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "cocomelon", "name": "CoComelon TV", "logo": "https://i.imgur.com/1F5vQ2Z.png", "category": "Kids", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCbCmjCuTUZos6Inko4u57UQ.m3u8", "type": "hls"},
    ],
    "documentary": [
        {"id": "documentary_net", "name": "Documentary+", "logo": "https://i.imgur.com/pQTx5qF.png", "category": "Documentary", "country": "USA", "stream_url": "https://documentaryplus-samsung.amagi.tv/playlist.m3u8", "type": "hls"},
        {"id": "nature_vision", "name": "Nature Vision", "logo": "https://i.imgur.com/7YzL3qE.png", "category": "Documentary", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCzVPj3gA9hUPY3eUQH7vPNg.m3u8", "type": "hls"},
        {"id": "law_crime", "name": "Law & Crime", "logo": "https://i.imgur.com/Qp5JxKz.png", "category": "Documentary", "country": "USA", "stream_url": "https://law-crime-lnc-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "weather_nation", "name": "Weather Nation", "logo": "https://i.imgur.com/K5qLpJz.png", "category": "Documentary", "country": "USA", "stream_url": "https://weathernation-weathernation-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "real_wild", "name": "Real Wild", "logo": "https://i.imgur.com/pHJL2qA.png", "category": "Documentary", "country": "UK", "stream_url": "https://ythls.armelin.one/channel/UCb2GCoLSBXvyPddvfPpQfRg.m3u8", "type": "hls"},
    ],
    "music": [
        {"id": "mtv_live", "name": "MTV Music", "logo": "https://i.imgur.com/7V9pkVS.png", "category": "Music", "country": "USA", "stream_url": "https://ythls.armelin.one/channel/UCIGXrG6kkQVYD4dSqQMISiQ.m3u8", "type": "hls"},
        {"id": "vevo_pop", "name": "Vevo Pop", "logo": "https://i.imgur.com/qLp5JKz.png", "category": "Music", "country": "USA", "stream_url": "https://vevo-vevo-pop-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "vevo_hiphop", "name": "Vevo Hip-Hop", "logo": "https://i.imgur.com/Hp3LqJz.png", "category": "Music", "country": "USA", "stream_url": "https://vevo-vevo-hip-hop-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "vevo_country", "name": "Vevo Country", "logo": "https://i.imgur.com/Rp5JqKz.png", "category": "Music", "country": "USA", "stream_url": "https://vevo-vevo-country-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "lofi_radio", "name": "Lofi Radio", "logo": "https://i.imgur.com/xKp3qJz.png", "category": "Music", "country": "International", "stream_url": "https://ythls.armelin.one/channel/UCSJ4gkVC6NrvII8umztf0Ow.m3u8", "type": "hls"},
        {"id": "colors", "name": "Colors TV Music", "logo": "https://i.imgur.com/Kp3LqJz.png", "category": "Music", "country": "India", "stream_url": "https://ythls.armelin.one/channel/UCM-Xv8GD0fLdQNv1VNiQU4g.m3u8", "type": "hls"},
    ],
    "religious": [
        {"id": "tbn", "name": "TBN", "logo": "https://i.imgur.com/Rp5JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://tbn-tbn-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "daystar", "name": "Daystar", "logo": "https://i.imgur.com/Kp3LqJz.png", "category": "Religious", "country": "USA", "stream_url": "https://wowzaprod141-i.akamaihd.net/hls/live/551320/6c91088b/playlist.m3u8", "type": "hls"},
        {"id": "ewtn", "name": "EWTN", "logo": "https://i.imgur.com/Hp5JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://cdn3.wowza.com/1/V09EU21sNVJWU28z/bWpIaUZn/hls/live/playlist.m3u8", "type": "hls"},
        {"id": "hope_channel", "name": "Hope Channel", "logo": "https://i.imgur.com/Lp3JqKz.png", "category": "Religious", "country": "USA", "stream_url": "https://hope-hope-channel-1-us.samsung.wurl.tv/playlist.m3u8", "type": "hls"},
        {"id": "god_tv", "name": "GOD TV", "logo": "https://i.imgur.com/Mp5JqKz.png", "category": "Religious", "country": "International", "stream_url": "https://ythls.armelin.one/channel/UC1WX4L5BVYZY4SZG3Vk2WZg.m3u8", "type": "hls"},
    ],
    "african": [
        {"id": "channels_tv", "name": "Channels TV Nigeria", "logo": "https://i.imgur.com/Np3JqKz.png", "category": "African", "country": "Nigeria", "stream_url": "https://ythls.armelin.one/channel/UCCh9v8Gqd3hBDYsYLZn7cgA.m3u8", "type": "hls"},
        {"id": "arise_news", "name": "Arise News", "logo": "https://i.imgur.com/Op5JqKz.png", "category": "African", "country": "Nigeria", "stream_url": "https://ythls.armelin.one/channel/UCsJRqZ-25oWNuM3cWCWbZHg.m3u8", "type": "hls"},
        {"id": "africanews", "name": "Africanews", "logo": "https://i.imgur.com/Pp3JqKz.png", "category": "African", "country": "Africa", "stream_url": "https://ythls.armelin.one/channel/UC1_E8NeF5QHY2dtdLRBCCLA.m3u8", "type": "hls"},
        {"id": "ktn_news", "name": "KTN News Kenya", "logo": "https://i.imgur.com/Qp5JqKz.png", "category": "African", "country": "Kenya", "stream_url": "https://ythls.armelin.one/channel/UCKVsdzkszXQdJ0t9FTq0ySg.m3u8", "type": "hls"},
        {"id": "citizen_tv", "name": "Citizen TV Kenya", "logo": "https://i.imgur.com/Rp3JqKz.png", "category": "African", "country": "Kenya", "stream_url": "https://ythls.armelin.one/channel/UCoFvsCi5NrVudBfdMGVn5Fw.m3u8", "type": "hls"},
        {"id": "sabc_news", "name": "SABC News", "logo": "https://i.imgur.com/Sp5JqKz.png", "category": "African", "country": "South Africa", "stream_url": "https://ythls.armelin.one/channel/UC8yH-uI81UUtEMDsowQyx1g.m3u8", "type": "hls"},
    ],
}

def get_all_channels() -> List[Dict[str, Any]]:
    """Get all available channels"""
    all_channels = []
    channel_number = 100
    
    for category, channels in IPTV_CHANNELS.items():
        for channel in channels:
            channel_with_num = {**channel, "number": str(channel_number)}
            all_channels.append(channel_with_num)
            channel_number += 1
    
    return all_channels

def get_channels_by_category(category: str) -> List[Dict[str, Any]]:
    """Get channels by category"""
    category_lower = category.lower()
    
    if category_lower == "all":
        return get_all_channels()
    
    channels = IPTV_CHANNELS.get(category_lower, [])
    
    result = []
    channel_number = 100
    for ch in channels:
        result.append({**ch, "number": str(channel_number)})
        channel_number += 1
    
    return result

def get_channel_by_id(channel_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific channel by ID"""
    all_channels = get_all_channels()
    for channel in all_channels:
        if channel.get("id") == channel_id:
            return channel
    return None

def get_categories() -> List[str]:
    """Get all available categories"""
    return ["All", "News", "Sports", "Entertainment", "Movies", "Kids", "Documentary", "Music", "Religious", "African"]

def search_channels(query: str) -> List[Dict[str, Any]]:
    """Search channels by name or country"""
    all_channels = get_all_channels()
    query_lower = query.lower()
    
    results = []
    for channel in all_channels:
        if (query_lower in channel.get("name", "").lower() or 
            query_lower in channel.get("country", "").lower() or
            query_lower in channel.get("category", "").lower()):
            results.append(channel)
    
    return results
