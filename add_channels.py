import pathlib, re, json

NEW_CHANNELS = [
    {"id": 178, "name": "Christian Youth Channel CYC", "category": "Religious", "url": "http://media3.smc-host.com:1935/cycnow.com/smil:cyc.smil/playlist.m3u8", "logo": "https://i.imgur.com/61eV77C.png"},
    {"id": 179, "name": "Cinevault 80s", "category": "Movies", "url": "https://amg01338-cinevaultmedia-cinevault80s-cineverse-tphvq.amagi.tv/playlist/amg01338-cinevaultmedia-cinevault80s-cineverse/playlist.m3u8", "logo": "https://i.imgur.com/X6eJHfe.png"},
    {"id": 180, "name": "Cinevault Westerns", "category": "Movies", "url": "https://amg01338-cinevaultmedia-cinevaultwe-cineverse-jbimf.amagi.tv/playlist/amg01338-cinevaultmedia-cinevaultwesterns-cineverse/playlist.m3u8", "logo": "https://i.imgur.com/O8LvHEe.png"},
    {"id": 181, "name": "DraftKings Network", "category": "Sports", "url": "https://amg01298-draftkingsnetwork-draftkingsntwrk-samsungus-9oydv.amagi.tv/playlist/amg01298-draftkingsnetwork-draftkingsntwrk-samsungus/playlist.m3u8", "logo": "https://i.imgur.com/SzE2ZiP.png"},
    {"id": 182, "name": "Aliento Vision", "category": "Religious", "url": "https://627bb251f23c7.streamlock.net:444/Alientoenvivo/Alientoenvivo/playlist.m3u8", "logo": "https://i.imgur.com/xT10iqB.png"},
    {"id": 183, "name": "Fox Business Network", "category": "News", "url": "https://fox-foxbusiness-desk-dacpub.amagi.tv/playlist.m3u8", "logo": "https://i.imgur.com/IelECsV.png"},
    {"id": 184, "name": "Fox Soul", "category": "Entertainment", "url": "https://amg01205-foxcorporation-foxsoul-samsungus-0uzqf.amagi.tv/playlist/amg01205-foxcorporation-foxsoul-samsungus/playlist.m3u8", "logo": "https://i.imgur.com/z0z4QvI.png"},
    {"id": 185, "name": "Fun Roads", "category": "Travel", "url": "https://a-cdn.klowdtv.com/live3/funroads_720p/playlist.m3u8", "logo": "https://i.imgur.com/2Q6TENm.png"},
    {"id": 186, "name": "ION Plus", "category": "Entertainment", "url": "https://pb-tcsruiaw9dc0i.akamaized.net/Ion_Plus_US.m3u8", "logo": "https://i.imgur.com/1dgCvNE.png"},
    {"id": 187, "name": "Judge Nosey", "category": "Series", "url": "https://amg00514-noseybaxterllc-realnosey-cineverse-tqbpv.amagi.tv/ts-us-w2-n1/playlist/amg00514-noseybaxterllc-realnosey-cineverse/playlist.m3u8", "logo": "https://i.imgur.com/S4r98AB.png"},
    {"id": 188, "name": "MLB Network", "category": "Sports", "url": "https://amg01222-mlbnetwork-mlbnetwork-samsungus-j3y5p.amagi.tv/playlist/amg01222-mlbnetwork-mlbnetwork-samsungus/playlist.m3u8", "logo": "https://i.imgur.com/P6zSmJc.png"},
    {"id": 189, "name": "Cine Terror", "category": "Movies", "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5f12111c9e6c2c00078ef3bb/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1", "logo": "https://i.imgur.com/I5XxyLI.png"},
    {"id": 190, "name": "Kevin Harts LOL Network", "category": "Comedy", "url": "https://d1kt53vrikzr5o.cloudfront.net/v1/lol_lolnetwork_5/samsungheadend_us/latest/main/hls/playlist.m3u8", "logo": "https://i.imgur.com/Tiy3Ur2.png"},
    {"id": 191, "name": "iCarly", "category": "Series", "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/6450209d939a5900084dba1d/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1", "logo": "https://i.imgur.com/R6jWcqz.png"},
    {"id": 192, "name": "PGA Tour", "category": "Sports", "url": "https://amg01371-pgatour-pgatourlive-samsungus-9m6eb.amagi.tv/playlist/amg01371-pgatour-pgatourlive-samsungus/playlist.m3u8", "logo": "https://i.imgur.com/NeXRdMk.png"},
    {"id": 193, "name": "LATV", "category": "Entertainment", "url": "https://amg00779-latv-amg00779c1-cineverse-us-1746.playouts.now.amagi.tv/ts-us-w2-n1/playlist/amg00779-latvnetworkllc-latv-cineverseus/playlist.m3u8", "logo": "https://i.imgur.com/fJxySUg.png"},
    {"id": 194, "name": "Alkarma TV Australia", "category": "Religious", "url": "https://58cc65c534c67.streamlock.net/alkarmatv.com/alkarmaau.smil/playlist.m3u8", "logo": "https://i.imgur.com/90ykspa.png"},
    {"id": 195, "name": "Lifetime Movies", "category": "Movies", "url": "https://amg01113-aenetworks-lifetimemovies-samsungus-2twt7.amagi.tv/playlist/amg01113-aenetworks-lifetimemovies-samsungus/playlist.m3u8", "logo": "https://i.imgur.com/X2NcU3R.png"},
    {"id": 196, "name": "Buzzr", "category": "Entertainment", "url": "https://buzzrota-ono.amagi.tv/playlist.m3u8", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Buzzr_logo.svg/960px-Buzzr_logo.svg.png"},
    {"id": 197, "name": "Cheddar News", "category": "News", "url": "https://amg01087-cheddarnews-cheddarnews-samsungus-n9lmo.amagi.tv/playlist/amg01087-cheddarnews-cheddarnews-samsungus/playlist.m3u8", "logo": "https://i.imgur.com/Ef5ABAK.png"},
    {"id": 198, "name": "KERO-DT1 ABC Bakersfield", "category": "General", "url": "https://aegis-cloudfront-1.tubi.video/69c4e4f9-84fa-43eb-b38e-6d1f9464ca73/playlist.m3u8", "logo": "https://i.imgur.com/CMANZWk.png"},
    {"id": 199, "name": "KSHB-DT1 NBC Kansas City", "category": "General", "url": "https://cvtv.cvalley.net/hls/KSHBNBC/KSHBNBC.m3u8", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png"},
    {"id": 200, "name": "QVC", "category": "Shopping", "url": "https://qvc-amd-live.akamaized.net/hls/live/2034113/lsqvc1us/master.m3u8", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/QVC_logo_2019.svg/960px-QVC_logo_2019.svg.png"},
    {"id": 201, "name": "KMOS-DT1 PBS Missouri", "category": "Education", "url": "https://hls-kmosdt.lls.cdn.pbs.org/hls/live/index.m3u8", "logo": "https://upload.wikimedia.org/wikipedia/commons/8/89/PBS_logo_2019.svg"},
    {"id": 202, "name": "E!", "category": "Entertainment", "url": "https://v14.thetvapp.to/hls/EEast/tracks-v1a1/mono.m3u8?token=K3MVigOs0dQvf6yO8xwShw&expires=1767024287&user_id=MTA3LjE3My4xNDAuMTY0", "logo": "https://i.imgur.com/TWFDkap.png"},
    {"id": 203, "name": "KFMB-DT2 CW San Diego", "category": "Entertainment", "url": "https://e4.thetvapp.to/hls/cw-kfmbtv2-san-diego-ca/tracks-v1a1/mono.m3u8?token=WT_RYLkdfNj2pORBaghzIA&expires=1767031568&user_id=MTA3LjE3My4xNDAuMTY0", "logo": "https://i.imgur.com/GCB3vun.png"},
]

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# 1. Build new channel JS lines and insert before first '];'
new_lines = []
for ch in NEW_CHANNELS:
    line = '  { id: ' + str(ch['id']) + ', name: "' + ch['name'] + '", category: "' + ch['category'] + '", url: "' + ch['url'] + '", logo: "' + ch['logo'] + '" },'
    new_lines.append(line)
new_js = '\n'.join(new_lines) + '\n'

idx = content.index('];')
content = content[:idx] + new_js + content[idx:]

# 2. Add deletedIds state + isAdmin + handlers after first useState line with currentChannel
marker = 'const [currentChannel, setCurrentChannel] = useState(null);'
if marker in content:
    replacement = (
        'const [currentChannel, setCurrentChannel] = useState(null);\n'
        '  const [deletedIds, setDeletedIds] = useState(() => {\n'
        '    try { return JSON.parse(localStorage.getItem("fb_deleted_channels") || "[]"); } catch(e) { return []; }\n'
        '  });\n'
        '  const isAdmin = localStorage.getItem("fb_admin") === "true";\n'
        '  const handleDeleteChannel = (id) => {\n'
        '    const next = [...deletedIds, id];\n'
        '    setDeletedIds(next);\n'
        '    localStorage.setItem("fb_deleted_channels", JSON.stringify(next));\n'
        '  };\n'
        '  const handleRestoreAll = () => {\n'
        '    setDeletedIds([]);\n'
        '    localStorage.removeItem("fb_deleted_channels");\n'
        '  };\n'
        '  const visibleChannels = channels.filter(c => !deletedIds.includes(c.id));'
    )
    content = content.replace(marker, replacement, 1)

# 3. Replace channels.filter and channels.map with visibleChannels equivalents
content = re.sub(r'\bchannels\.filter\b', 'visibleChannels.filter', content)
content = re.sub(r'\bchannels\.map\b', 'visibleChannels.map', content)

src.write_text(content, encoding='utf-8')
print('Done! ' + str(len(NEW_CHANNELS)) + ' channels added.')
print('Enable delete mode in browser console: localStorage.setItem("fb_admin","true"); location.reload()')
