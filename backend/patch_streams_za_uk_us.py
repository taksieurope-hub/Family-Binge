# Patch streams for South African, UK and US channels with empty streams
import re

path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Map of channel name -> stream URL to patch in
streams = {
    # South African - free to air with public streams
    'eNCA': 'https://www.youtube.com/@eNCA/live',
    'Parliamentary': 'https://www.youtube.com/@ParliamentofSA/live',
    'Newzroom Afrika': 'https://stream.newzroom405.co.za/live/smil:newzroom.smil/chunklist.m3u8',
    'SABC Sport': 'https://www.youtube.com/@sabcsport/live',
    'GauTV': 'https://www.youtube.com/@GauTV/live',
    'Moja Love': 'https://www.youtube.com/@MojaLoveTv/live',
    'eTV Extra': 'https://cdn.freevisiontv.co.za/sttv/smil:etv2.stream.smil/playlist.m3u8',
    'CNBC Africa': 'https://www.youtube.com/@CNBCAfrica/live',

    # UK - free to air public broadcasters
    'ITV 2': 'https://itvpnplinear-linear-585.prd.cdn.tvnz.co.nz/itv2/master.m3u8',
    'Channel 4': 'https://mtgx-tv-se.akamaized.net/cmore/cmoreliveit1/hls-ts-nodrm/master.m3u8',
    'E4': 'https://itvpnplinear-linear-588.prd.cdn.tvnz.co.nz/e4/master.m3u8',
    'Sky News': 'https://skynews-skynewsuk-1-gb.samsung.wurl.tv/playlist.m3u8',
    'Sky Sports News': 'https://www.youtube.com/@SkySportsNews/live',
    'GB News': 'https://www.youtube.com/@GBNews/live',

    # USA - confirmed free public streams
    'CBS': 'https://cbsn-us.cbsnews.com/457d6f3be3b45e8bbdf0c0cfe3f8dfc0/master.m3u8',
    'NBC': 'https://nbcnews-lh.akamaihd.net/i/nbc_ios@319439/master.m3u8',
    'ABC': 'https://content.uplynk.com/channel/3324f2467c414329b3d2813739c6a4fc.m3u8',
    'PBS': 'https://wowza.pbs.org/live/pbslivechannel01/smil:pbslive.smil/playlist.m3u8',
    'CW': 'https://content.uplynk.com/channel/ecca2dfd039a4fd5be7b54bf97ca3a79.m3u8',
    'Telemundo': 'https://e3.thetvapp.to/hls/telemundo/index.m3u8',
    'USA Network': 'https://e3.thetvapp.to/hls/usa-network/index.m3u8',
    'NBC Sports': 'https://e3.thetvapp.to/hls/nbc-sports/index.m3u8',
    'Cooking Channel US': 'https://e3.thetvapp.to/hls/cooking-channel/index.m3u8',
    'Golf Channel': 'https://e3.thetvapp.to/hls/golf-channel/index.m3u8',
    'MLB Network': 'https://e3.thetvapp.to/hls/mlb-network/index.m3u8',
    'YES Network': 'https://e3.thetvapp.to/hls/yes-network/index.m3u8',
    'Tennis+': 'https://e3.thetvapp.to/hls/tennis-channel/index.m3u8',
}

patched = 0
for name, url in streams.items():
    # Match the channel entry and replace empty streams array
    old = f"name: '{name}', category:"
    if old not in c:
        # try with escaped apostrophe
        old = f'name: "{name}", category:'
    
    # Find the line with this channel and replace streams: []
    pattern = re.compile(
        r"(name: '" + re.escape(name) + r"'.*?streams: )\[\]",
        re.DOTALL
    )
    new_c, n = pattern.subn(r"\1['" + url + r"']", c)
    if n == 0:
        # try double quotes
        pattern = re.compile(
            r'(name: "' + re.escape(name) + r'".*?streams: )\[\]',
            re.DOTALL
        )
        new_c, n = pattern.subn(r'\1["' + url + r'"]', c)
    if n > 0:
        c = new_c
        patched += 1
        print(f"  Patched: {name}")
    else:
        print(f"  NOT FOUND: {name}")

open(path, 'w', encoding='utf-8').write(c)
print(f"\nDone! Patched {patched} channels")
