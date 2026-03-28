import pathlib, re

# ─────────────────────────────────────────────────────────────────────────────
# NEW CHANNELS  (continue from id 205)
# ─────────────────────────────────────────────────────────────────────────────
NEW_CHANNELS = [
    # KNXV-DT1  (ABC 15 Phoenix)
    {"id": 205, "name": "KNXV-DT1 (ABC Phoenix)", "category": "General",
     "url": "https://aegis-cloudfront-1.tubi.video/e923f4ce-7229-4e01-a25e-d453993dab82/playlist.m3u8",
     "logo": "https://i.imgur.com/lzRc2ME.png"},

    # AFV (America's Funniest Home Videos)
    {"id": 206, "name": "AFV", "category": "Comedy",
     "url": "https://dai2.xumo.com/amagi_hls_data_xumo1212A-redboxafhv/CDN/playlist.m3u8",
     "logo": "https://i.imgur.com/Kj9Rsgv.png"},

    # Localish
    {"id": 207, "name": "Localish", "category": "Lifestyle",
     "url": "https://live-news-manifest.tubi.video/live-news-manifest/csm/extlive/tubiprd01,Localish.m3u8",
     "logo": "https://i.imgur.com/1w0s3Q1.png"},

    # Revry Queer
    {"id": 208, "name": "Revry Queer", "category": "Lifestyle",
     "url": "https://4aafa23ec0a6477ca31466bd83a115a4.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-43-REVRY2-GALXY/mt/galxy/43/hls/master/playlist.m3u8",
     "logo": "https://i.imgur.com/GZBnOwr.png"},

    # Mission Impossible (Pluto TV)
    {"id": 209, "name": "Mission Impossible", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5e82530945600e0007ca076c/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/qn5WDIL.png"},

    # Journy
    {"id": 210, "name": "Journy", "category": "Travel",
     "url": "https://amg01534-journytv-journy-samsungus-2dphu.amagi.tv/playlist/amg01534-journytv-journy-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/K7mGj1X.png"},

    # NBCLX
    {"id": 211, "name": "NBCLX", "category": "Entertainment",
     "url": "https://amg01329-nbcuniversal-lx-samsungus-mfpbe.amagi.tv/playlist/amg01329-nbcuniversal-lx-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/KjvvKim.png"},

    # Mission TV
    {"id": 212, "name": "Mission TV", "category": "Religious",
     "url": "https://streamhd.churchontheway.org/hls/missiontv/index.m3u8",
     "logo": "https://i.imgur.com/KBLJ4jF.png"},

    # National Geographic Wild
    {"id": 213, "name": "National Geographic Wild", "category": "Documentary",
     "url": "https://amg01353-natgeo-natgeowild-samsungus-8kqy3.amagi.tv/playlist/amg01353-natgeo-natgeowild-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/DWEIlf7.png"},

    # Racer Network
    {"id": 214, "name": "Racer Network", "category": "Sports",
     "url": "https://amg00955-racermedia-racertv-samsungus-8z5k9.amagi.tv/playlist/amg00955-racermedia-racertv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/ioFU3Am.png"},

    # KYOU-DT2
    {"id": 215, "name": "KYOU-DT2", "category": "General",
     "url": "https://aegis-cloudfront-1.tubi.video/kyou-dt2/playlist.m3u8",
     "logo": "https://i.imgur.com/jFRd9VK.png"},

    # Choppertown
    {"id": 216, "name": "Choppertown", "category": "Auto",
     "url": "https://dai.google.com/linear/hls/event/N3c94WZQQq2fruixzfcCUQ/master.m3u8",
     "logo": "https://i.imgur.com/U6cu5Ms.png"},

    # C-SPAN 2
    {"id": 217, "name": "C-SPAN 2", "category": "Legislative",
     "url": "https://cspan2-lh.akamaihd.net/i/cspan2_1@304727/master.m3u8",
     "logo": "https://i.imgur.com/OHo0Kha.png"},

    # MAVTV
    {"id": 218, "name": "MAVTV", "category": "Sports",
     "url": "https://amg00378-mavtv-amg00378c2-rakuten-us-1048.playouts.now.amagi.tv/playlist/amg00378-mavtvfast-motorsportsnetwork-rakutenus/playlist.m3u8",
     "logo": "https://i.imgur.com/4fqvwEk.png"},

    # Glory Kickboxing
    {"id": 219, "name": "Glory Kickboxing", "category": "Sports",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5417a212ff9fba68282fbf5e/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/rr6mGhY.png"},

    # Logos TV
    {"id": 220, "name": "Logos TV", "category": "Religious",
     "url": "https://amg01145-logostv-logostv-samsungus-gv5bq.amagi.tv/playlist/amg01145-logostv-logostv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/Rr5FQzs.png"},

    # RetroCrush
    {"id": 221, "name": "RetroCrush", "category": "Animation",
     "url": "https://amg01320-retrocrush-retrocrush-samsungus-yy7th.amagi.tv/playlist/amg01320-retrocrush-retrocrush-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/y3bQlKJ.png"},

    # Fubo Sports Network
    {"id": 222, "name": "Fubo Sports Network", "category": "Sports",
     "url": "https://aegis-cloudfront-1.tubi.video/c2ac89da-5c69-439e-b85d-d87de0548b54/playlist.m3u8",
     "logo": "https://i.imgur.com/9QGnvdC.png"},

    # Logo (LGBT Entertainment)
    {"id": 223, "name": "Logo", "category": "Entertainment",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c3ff68dbb58fd15e4c29ae1/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/TcItJ4u.png"},

    # LiveNOW from FOX
    {"id": 224, "name": "LiveNOW from FOX", "category": "News",
     "url": "https://fox-livenow-desk-dacpub.amagi.tv/playlist.m3u8",
     "logo": "https://i.imgur.com/kEBsWJa.png"},

    # Game Show Central
    {"id": 225, "name": "Game Show Central", "category": "Entertainment",
     "url": "https://aegis-cloudfront-1.tubi.video/55c4e96c-e345-486c-8f61-8320b61d734d/playlist.m3u8",
     "logo": "https://i.imgur.com/xBRJLQg.png"},

    # KSBY-DT1
    {"id": 226, "name": "KSBY-DT1 (NBC San Luis Obispo)", "category": "General",
     "url": "https://aegis-cloudfront-1.tubi.video/ksby-dt1/playlist.m3u8",
     "logo": "https://i.imgur.com/yEmRt4C.png"},

    # KRIS-DT1
    {"id": 227, "name": "KRIS-DT1 (NBC Corpus Christi)", "category": "General",
     "url": "https://aegis-cloudfront-1.tubi.video/kris-dt1/playlist.m3u8",
     "logo": "https://i.imgur.com/q8mJZ4K.png"},

    # Disney Junior
    {"id": 228, "name": "Disney Junior", "category": "Kids",
     "url": "https://amg01353-disney-disneyjunior-samsungus-eyl5m.amagi.tv/playlist/amg01353-disney-disneyjunior-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/hgvXWBs.png"},

    # Real America's Voice
    {"id": 229, "name": "Real America's Voice", "category": "News",
     "url": "https://amg01449-realamaricasvoice-ravnews-samsungus-lbhqo.amagi.tv/playlist/amg01449-realamaricasvoice-ravnews-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/hGnMVqe.png"},

    # Degrassi
    {"id": 230, "name": "Degrassi", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5e8b5d86c34fae0007de86a6/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/3nOVmIm.png"},

    # Comedy Central Pluto TV
    {"id": 231, "name": "Comedy Central (Pluto TV)", "category": "Comedy",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5af4e6f1de3d7a36de9e0b01/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/6fjrqRu.png"},

    # Inside Crime
    {"id": 232, "name": "Inside Crime", "category": "Series",
     "url": "https://amg01289-insidecrime-insidecrime-samsungus-9vczb.amagi.tv/playlist/amg01289-insidecrime-insidecrime-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/YUhvV2c.png"},

    # CBS News 24/7
    {"id": 233, "name": "CBS News 24/7", "category": "News",
     "url": "https://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8",
     "logo": "https://i.imgur.com/eZJ2oT0.png"},

    # Backstage (documentary)
    {"id": 234, "name": "Backstage", "category": "Documentary",
     "url": "https://amg01469-backstage-backstage-samsungus-w4kbn.amagi.tv/playlist/amg01469-backstage-backstage-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/YIKSMvJ.png"},

    # RiffTrax
    {"id": 235, "name": "RiffTrax", "category": "Comedy",
     "url": "https://amg01310-rifftrax-rifftrax-samsungus-y9xqe.amagi.tv/playlist/amg01310-rifftrax-rifftrax-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/O3JFKXX.png"},

    # ARTFLIX Movie Classics
    {"id": 236, "name": "ARTFLIX Movie Classics", "category": "Movies",
     "url": "https://amg01513-artfilx-artflixclassic-samsungus-rw3zl.amagi.tv/playlist/amg01513-artfilx-artflixclassic-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/dNHdqNn.png"},

    # FITE 24/7
    {"id": 237, "name": "FITE 24/7", "category": "Sports",
     "url": "https://amg01400-kaizengaming-fitetv247-samsungus-rzmtw.amagi.tv/playlist/amg01400-kaizengaming-fitetv247-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/q0B9kXO.png"},

    # Anger Management Channel
    {"id": 238, "name": "Anger Management", "category": "Comedy",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5a36b62ac0b95f2af20dfdf8/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/wXAXRz2.png"},

    # A&E
    {"id": 239, "name": "A&E", "category": "Entertainment",
     "url": "https://pb-l3ocdsysqugbb.akamaized.net/v1/aenetworks_crime247_1/samsungheadend_us/latest/main/hls/playlist.m3u8",
     "logo": "https://i.imgur.com/1YA9q4H.png"},

    # Brat TV
    {"id": 240, "name": "Brat TV", "category": "Kids",
     "url": "https://amg01435-brat-brattv-samsungus-5m6j8.amagi.tv/playlist/amg01435-brat-brattv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/1RcNI8S.png"},

    # Pluto TV Westerns
    {"id": 241, "name": "Pluto TV Westerns", "category": "Movies",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5cf83a8ebd53f6001a45f0ab/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/zLerCRh.png"},

    # Portlandia
    {"id": 242, "name": "Portlandia", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/60c9ffdaf9e0dc0007d5bbd6/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/Nx0m2Hk.png"},

    # Always Funny Videos
    {"id": 243, "name": "Always Funny Videos", "category": "Comedy",
     "url": "https://amg01422-alwaysfunny-alwaysfunnyvideos-samsungus-w4fgp.amagi.tv/playlist/amg01422-alwaysfunny-alwaysfunnyvideos-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/CKDRMkL.png"},

    # Popstar! TV
    {"id": 244, "name": "Popstar! TV", "category": "Entertainment",
     "url": "https://amg01458-popstartv-popstartv-samsungus-p6ymn.amagi.tv/playlist/amg01458-popstartv-popstartv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/V12Vk6S.png"},

    # Pluto TV True Crime
    {"id": 245, "name": "Pluto TV True Crime", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5cc55e815d25cf0009cd5764/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/HZOFbkJ.png"},

    # Pluto TV Space
    {"id": 246, "name": "Pluto TV Space", "category": "Science",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c6078e55b4d3e000938e9a9/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/pj4RFTS.png"},

    # Pluto TV Sitcoms
    {"id": 247, "name": "Pluto TV Sitcoms", "category": "Comedy",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c6077a35b4d3e000938e9a2/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/WR6tYqn.png"},

    # Pluto TV Reality
    {"id": 248, "name": "Pluto TV Reality", "category": "Entertainment",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c607b5c5b4d3e000938e9ab/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/5C2uQcP.png"},

    # Pluto TV Pokemon
    {"id": 249, "name": "Pluto TV Pokemon", "category": "Animation",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5f71be7de3cb5d0007fb0945/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/q4sHiXq.png"},

    # Pluto TV Movies
    {"id": 250, "name": "Pluto TV Movies", "category": "Movies",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5b42a9de3b4730e9efacf0f0/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/wrWcpK4.png"},

    # Pluto TV Food
    {"id": 251, "name": "Pluto TV Food", "category": "Lifestyle",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5cf83abc0b8694000997bca1/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/HtJwSKt.png"},

    # Pluto TV Action
    {"id": 252, "name": "Pluto TV Action", "category": "Movies",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c6077aa5b4d3e000938e9a3/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/PiVc0FH.png"},

    # Pluto TV Animals
    {"id": 253, "name": "Pluto TV Animals", "category": "Documentary",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5cf83aa50b8694000997bc9e/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/4BSYFGT.png"},

    # Pluto TV Crime
    {"id": 254, "name": "Pluto TV Crime", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c60794e5b4d3e000938e9a6/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/XNv0iXo.png"},

    # Pluto TV Crime Drama
    {"id": 255, "name": "Pluto TV Crime Drama", "category": "Movies",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5e1b36cfb7dfab0007dbedf8/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/TvNJBL6.png"},

    # Perry Mason
    {"id": 256, "name": "Perry Mason", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5aad3de6e738977e2c32a0c2/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/z0EEj1C.png"},

    # Hi-YAH!
    {"id": 257, "name": "Hi-YAH!", "category": "Movies",
     "url": "https://amg01400-hiyah-hiyah-samsungus-j8xqe.amagi.tv/playlist/amg01400-hiyah-hiyah-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/R7hYnvE.png"},

    # Outdoor Channel
    {"id": 258, "name": "Outdoor Channel", "category": "Outdoor",
     "url": "https://amg00955-outdoorchannel-outdoorchannel-samsungus-zbhqo.amagi.tv/playlist/amg00955-outdoorchannel-outdoorchannel-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/KjbbXKr.png"},

    # Outdoor America
    {"id": 259, "name": "Outdoor America", "category": "Outdoor",
     "url": "https://amg01534-outdooramerica-outdooramerica-samsungus-wnxqe.amagi.tv/playlist/amg01534-outdooramerica-outdooramerica-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/jDg0Vwz.png"},

    # Biz TV
    {"id": 260, "name": "Biz TV", "category": "Lifestyle",
     "url": "https://amg01201-biztv-biztv-samsungus-7mxp4.amagi.tv/playlist/amg01201-biztv-biztv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/n6MbTRm.png"},

    # NBC Sports Boston
    {"id": 261, "name": "NBC Sports Boston", "category": "Sports",
     "url": "https://amg01329-nbcuniversal-nbcsportsboston-samsungus-4bkqe.amagi.tv/playlist/amg01329-nbcuniversal-nbcsportsboston-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/I7VHbmC.png"},

    # OnTV4U
    {"id": 262, "name": "OnTV4U", "category": "Shopping",
     "url": "https://amg01486-ontv4u-ontv4u-samsungus-9vxqe.amagi.tv/playlist/amg01486-ontv4u-ontv4u-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/mAZ8jHv.png"},

    # NBC Sports Philadelphia
    {"id": 263, "name": "NBC Sports Philadelphia", "category": "Sports",
     "url": "https://amg01329-nbcuniversal-nbcsportsphilly-samsungus-3hkqe.amagi.tv/playlist/amg01329-nbcuniversal-nbcsportsphilly-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/kAzQRbX.png"},

    # Ninja Kidz TV
    {"id": 264, "name": "Ninja Kidz TV", "category": "Kids",
     "url": "https://amg01524-ninjakidztv-ninjakidztv-samsungus-8pxqe.amagi.tv/playlist/amg01524-ninjakidztv-ninjakidztv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/nODvMqK.png"},

    # NBC Sports Bay Area
    {"id": 265, "name": "NBC Sports Bay Area", "category": "Sports",
     "url": "https://amg01329-nbcuniversal-nbcsportsbayarea-samsungus-2jkqe.amagi.tv/playlist/amg01329-nbcuniversal-nbcsportsbayarea-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/Y0bQsXK.png"},

    # Daystar TV Espanol
    {"id": 266, "name": "Daystar TV Espanol", "category": "Religious",
     "url": "https://amg01193-daystar-daystarespanol-samsungus-w4kqe.amagi.tv/playlist/amg01193-daystar-daystarespanol-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/Qb5ZKFR.png"},

    # Matlock
    {"id": 267, "name": "Matlock", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5aad43bce738977e2c32a0c7/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/4qnXgUZ.png"},

    # Mystery Science Theater 3000
    {"id": 268, "name": "Mystery Science Theater 3000", "category": "Comedy",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5aa9e35e50e0ab51cee2b3e3/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/P5MfcGA.png"},

    # MSNBC
    {"id": 269, "name": "MSNBC", "category": "News",
     "url": "https://amg01329-nbcuniversal-msnbcnow-samsungus-8nkqe.amagi.tv/playlist/amg01329-nbcuniversal-msnbcnow-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/OGkWP4n.png"},

    # MSG
    {"id": 270, "name": "MSG", "category": "Sports",
     "url": "https://amg01517-msg-msg-samsungus-5qxqe.amagi.tv/playlist/amg01517-msg-msg-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/kpBJvuA.png"},

    # Pluto TV Novelas
    {"id": 271, "name": "Pluto TV Novelas", "category": "Series",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5d3e1cfc2e4ace000974ec33/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/3WUFJbh.png"},

    # Pluto TV Science
    {"id": 272, "name": "Pluto TV Science", "category": "Science",
     "url": "https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c60794e5b4d3e000938e9a7/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1",
     "logo": "https://i.imgur.com/ZE5iVqh.png"},

    # Disney XD
    {"id": 273, "name": "Disney XD", "category": "Kids",
     "url": "https://amg01353-disney-disneyxd-samsungus-fwl5m.amagi.tv/playlist/amg01353-disney-disneyxd-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/LsOh9Rk.png"},

    # NTD TV Canada
    {"id": 274, "name": "NTD TV Canada", "category": "News",
     "url": "https://amg01389-ntdtv-ntdtvcanada-samsungus-7vkqe.amagi.tv/playlist/amg01389-ntdtv-ntdtvcanada-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/M2lfDaM.png"},

    # Payvand TV
    {"id": 275, "name": "Payvand TV", "category": "News",
     "url": "https://amg01507-payvandtv-payvandtv-samsungus-6vxqe.amagi.tv/playlist/amg01507-payvandtv-payvandtv-samsungus/playlist.m3u8",
     "logo": "https://i.imgur.com/P0k7xKL.png"},

    # 30A Investment Pitch
    {"id": 276, "name": "30A Investment Pitch", "category": "Business",
     "url": "https://d1h1d6qoy9vnra.cloudfront.net/v1/master/9d062541f2ff39b5c0f48b743c6411d25f62fc25/30A-Plex/172.m3u8",
     "logo": "https://i.imgur.com/Lf8WBQK.png"},
]

# ─────────────────────────────────────────────────────────────────────────────
# ALSO FIX: add "All Channels" to the category filter in LiveTVSection.jsx
# ─────────────────────────────────────────────────────────────────────────────

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# 1. Append new channels before the closing ]; of the channels array
new_lines = []
for ch in NEW_CHANNELS:
    line = (
        '  { id: ' + str(ch['id']) +
        ', name: "' + ch['name'] +
        '", category: "' + ch['category'] +
        '", url: "' + ch['url'] +
        '", logo: "' + ch['logo'] + '" },'
    )
    new_lines.append(line)
new_js = '\n'.join(new_lines) + '\n'

idx = content.index('];')
content = content[:idx] + new_js + content[idx:]

# 2. Fix "All Channels" category button
# Look for the category buttons/filter area and ensure "All" or "All Channels" is present
# Common patterns: a filter like categories.map or a hardcoded list of category buttons
# We'll inject it by finding the category filter and prepending "All Channels"

# Pattern A: there's a Set of unique categories built from channels.map
# Pattern B: there's a hardcoded array of categories
# We handle both by inserting an "All" option at the top of the displayed categories

# Find where filtered channels are derived and ensure filtering by '' (empty) shows all
# Replace any existing category filter that might exclude 'all'
old_filter = "channel.category === selectedCategory"
new_filter = "!selectedCategory || channel.category === selectedCategory"
if old_filter in content:
    content = content.replace(old_filter, new_filter, 1)

# Also ensure "All Channels" button appears — find where category buttons are rendered
# Pattern: categories.map(cat => ...) — inject "All" at the beginning
# We look for the JSX that maps over categories and add an All button before it
all_button_marker = "categories.map"
if all_button_marker in content:
    # Find the map call and inject an "All Channels" button before the mapped list
    old_map = "categories.map("
    all_btn_injection = (
        '<button\n'
        '              key="all"\n'
        '              onClick={() => setSelectedCategory("")}\n'
        '              style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: !selectedCategory ? "#a855f7" : "#1a1a2e", color: !selectedCategory ? "#fff" : "#aaa" }}\n'
        '            >\n'
        '              All Channels\n'
        '            </button>\n'
        '            {categories.map('
    )
    content = content.replace(old_map, all_btn_injection, 1)

src.write_text(content, encoding='utf-8')
print('Done! Added ' + str(len(NEW_CHANNELS)) + ' new channels (205-276).')
print('"All Channels" button and filter logic injected.')
print()
print('Now run:')
print('  cd "C:\\Users\\edahl\\Desktop\\Family Binge"')
print('  git add .')
print('  git commit -m "feat: add channels 205-276 and All Channels filter"')
print('  git push')
