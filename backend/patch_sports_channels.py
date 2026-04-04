# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx'
c = open(path, 'r', encoding='utf-8').read()

new_channels = """
  { id: 340, name: 'ESPN Deportes',       category: 'Sports', logo: null, streams: ['https://e3.thetvapp.to/hls/espn-deportes/index.m3u8'] },
  { id: 341, name: 'NBC Sports NOW',      category: 'Sports', logo: null, streams: ['https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8?ads.xumo_channelId=99993008'] },
  { id: 342, name: 'Tennis Channel',      category: 'Sports', logo: null, streams: ['https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01444-tennischannelth-tennischnlintl-lggb/playlist.m3u8'] },
  { id: 343, name: 'TVS Sports',          category: 'Sports', logo: null, streams: ['https://rpn.bozztv.com/gusa/gusa-tvssports/index.m3u8'] },
  { id: 344, name: 'TVS Boxing',          category: 'Sports', logo: null, streams: ['https://rpn.bozztv.com/gusa/gusa-tvsboxing/index.m3u8'] },
  { id: 345, name: 'TVS Classic Sports',  category: 'Sports', logo: null, streams: ['https://rpn.bozztv.com/gusa/gusa-tvs/index.m3u8'] },
  { id: 346, name: 'TVS Women Sports',    category: 'Sports', logo: null, streams: ['https://rpn.bozztv.com/gusa/gusa-tvswsn/index.m3u8'] },
  { id: 347, name: 'TVS Sports Bureau',   category: 'Sports', logo: null, streams: ['https://rpn.bozztv.com/gusa/gusa-tvssportsbureau/index.m3u8'] },
  { id: 348, name: 'Sports Connect',      category: 'Sports', logo: null, streams: ['https://streamdot.broadpeak.io/cff02a74da64d1459391ce1f72d58f1a/afxpstr/SportsConnect/index.m3u8'] },
  { id: 349, name: 'Motor Trend',         category: 'Sports', logo: null, streams: ['http://104.255.88.155/motortrend/index.m3u8'] },
  { id: 350, name: 'Motor1 TV',           category: 'Sports', logo: null, streams: ['https://motorsportnetwork-motor1tv-1-it.samsung.wurl.tv/playlist.m3u8'] },
  { id: 351, name: 'Abu Dhabi Sports 1',  category: 'Sports', logo: null, streams: ['https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel1/HLS/index.m3u8'] },
  { id: 352, name: 'Abu Dhabi Sports 2',  category: 'Sports', logo: null, streams: ['https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel2/HLS/index.m3u8'] },
  { id: 353, name: 'Dubai Sports 1',      category: 'Sports', logo: null, streams: ['https://dmitnthfr.cdn.mgmlcdn.com/dubaisports/smil:dubaisports.stream.smil/chunklist.m3u8'] },
  { id: 354, name: 'Dubai Sports 2',      category: 'Sports', logo: null, streams: ['https://dmitwlvvll.cdn.mangomolo.com/dubaisportshd/smil:dubaisportshd.smil/index.m3u8'] },
  { id: 355, name: 'Dubai Sports 3',      category: 'Sports', logo: null, streams: ['https://dmitwlvvll.cdn.mangomolo.com/dubaisportshd5/smil:dubaisportshd5.smil/index.m3u8'] },
  { id: 356, name: 'FTF Sports',          category: 'Sports', logo: null, streams: ['https://1657061170.rsc.cdn77.org/HLS/FTF-LINEAR.m3u8'] },
  { id: 357, name: 'Eurosport (Czech)',    category: 'Sports', logo: null, streams: ['https://sktv.plainrock127.xyz/get.php?x=CTsport'] },
  { id: 358, name: 'TV 2 Sport',          category: 'Sports', logo: null, streams: ['https://ws31-hls-live.akamaized.net/out/u/1416253.m3u8'] },
  { id: 359, name: 'CBC Sports',          category: 'Sports', logo: null, streams: ['https://mn-nl.mncdn.com/cbcsports_live/cbcsports/playlist.m3u8'] },
  { id: 360, name: 'BOK TV Rugby',        category: 'Sports', logo: null, streams: ['https://livestream2.bokradio.co.za/hls/Bok5c.m3u8'] },
  { id: 361, name: 'Sport Pluto TV',      category: 'Sports', logo: null, streams: ['https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/608030eff4b6f70007e1684c/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1&advertisingId=channel&embedPartner=rokuChannel&appName=rokuchannel&is_lat=1&bmodel=bm1&content=channel&platform=web'] },
  { id: 362, name: 'Unbeaten Sports',     category: 'Sports', logo: null, streams: ['https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/64c3b106dac71b00080a26d2/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1&advertisingId=channel&embedPartner=rokuChannel&appName=rokuchannel&is_lat=1&bmodel=bm1&content=channel&platform=web'] },
  { id: 363, name: 'SportOutdoor TV',     category: 'Sports', logo: null, streams: ['https://gto2000-sportoutdoortv-1-it.samsung.wurl.tv/playlist.m3u8'] },
  { id: 364, name: 'Willow Cricket',      category: 'Sports', logo: null, streams: ['https://amg01269-amg01269c1-firetv-us-5377.playouts.now.amagi.tv/playlist.m3u8'] },
  { id: 365, name: 'World Poker Tour',    category: 'Sports', logo: null, streams: ['https://amg00218-wptenterprisesi-worldpokertour-xumo-us.amagi.tv/playlist.m3u8'] },
"""

idx = c.rfind('];')
if idx != -1:
    c = c[:idx] + new_channels + c[idx:]
    open(path, 'w', encoding='utf-8').write(c)
    print("Done! Added 26 sports channels")
else:
    print("ERROR: could not find end of channels array")
