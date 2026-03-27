import httpx, asyncio

async def test(name, url):
    try:
        r = await asyncio.wait_for(httpx.AsyncClient().get(url, follow_redirects=True), timeout=5)
        print(f'{name}: {r.status_code}')
    except Exception as e:
        print(f'{name}: FAILED - {type(e).__name__}')

async def main():
    tests = [
        ('RT News', 'https://rt-glb.rttv.com/live/rtnews/playlist.m3u8'),
        ('NHK World', 'https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/domestic/263942/live.m3u8'),
        ('CGTN', 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8'),
        ('CNA', 'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8'),
        ('Red Bull TV', 'https://rbmn-live.akamaized.net/hls/live/590964/BossRacing/master.m3u8'),
        ('Pluto Movies', 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5f4d8b7a2575e900078d6b18/master.m3u8?deviceType=web'),
        ('Buzzr', 'https://buzzr-buzzr-1-us.samsung.wurl.tv/playlist.m3u8'),
        ('Comet TV', 'https://comet-comet-1-us.samsung.wurl.tv/playlist.m3u8'),
        ('Kidoodle', 'https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/kidoodle-kidoodle/main.m3u8'),
        ('Vevo Pop', 'https://vevo-vevo-pop-1-us.samsung.wurl.tv/playlist.m3u8'),
        ('TBN', 'https://tbn-tbn-1-us.samsung.wurl.tv/playlist.m3u8'),
        ('Daystar', 'https://wowzaprod141-i.akamaihd.net/hls/live/551320/6c91088b/playlist.m3u8'),
        ('Documentary+', 'https://documentaryplus-samsung.amagi.tv/playlist.m3u8'),
        ('Law Crime', 'https://law-crime-lnc-1-us.samsung.wurl.tv/playlist.m3u8'),
        ('Kartoon', 'https://kartoon-kartoon-channel-1-us.samsung.wurl.tv/playlist.m3u8'),
    ]
    await asyncio.gather(*[test(n, u) for n, u in tests])

asyncio.run(main())
