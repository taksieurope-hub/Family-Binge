# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx'
c = open(path, 'r', encoding='utf-8').read()

new_channels = """
  { id: 321, name: 'Comedy Central',      category: 'Comedy',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Comedy_Central_logo.svg/200px-Comedy_Central_logo.svg.png', streams: ['http://23.237.104.106:8080/USA_COMEDY_CENTRAL/index.m3u8'] },
  { id: 322, name: 'Nickelodeon',         category: 'Family',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Nickelodeon_2009_logo.svg/200px-Nickelodeon_2009_logo.svg.png', streams: ['http://23.237.104.106:8080/USA_NICKELODEON/index.m3u8'] },
  { id: 323, name: 'Disney Channel',      category: 'Family',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Disney_Channel_2014.svg/200px-Disney_Channel_2014.svg.png', streams: ['http://104.255.88.155/disney/playlist.m3u8', 'https://moviezona593.com:8443/play/cO7SMyYsfVeNHbC5IQqRpHzyzgpISTmz_ch_ZVKDwht95XgI8UhySeZgp7szKj3V/m3u8'] },
  { id: 324, name: 'BBC America',         category: 'Entertainment', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/BBC_America.svg/200px-BBC_America.svg.png', streams: ['https://bcovlive-a.akamaihd.net/7f5ec16d102f4b5d92e8e27bc95ff424/us-east-1/6240731308001/playlist.m3u8'] },
  { id: 325, name: 'Fox News',            category: 'News',          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/200px-Fox_News_Channel_logo.svg.png', streams: ['http://41.205.93.154/FOX-NEWS/index.m3u8', 'http://247preview.foxnews.com/hls/live/2020027/fncv3preview/primary.m3u8'] },
  { id: 326, name: 'NBC News NOW',        category: 'News',          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NBC_logo.svg/200px-NBC_logo.svg.png', streams: ['https://d1bl6tskrpq9ze.cloudfront.net/hls/master.m3u8?ads.xumo_channelId=99984003', 'https://livehub-voidnet.onrender.com/cluster/streamcore/us/NBC_REDIS.m3u8'] },
  { id: 327, name: 'ABC',                 category: 'Entertainment', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_Entertainment_logo.svg/200px-ABC_Entertainment_logo.svg.png', streams: ['http://41.205.93.154/ABC/index.m3u8'] },
  { id: 328, name: 'Fox Weather',         category: 'News',          logo: null, streams: ['https://247wlive.foxweather.com/stream/index.m3u8'] },
  { id: 329, name: 'History Hit',         category: 'Documentary',   logo: null, streams: ['https://amg00426-lds-amg00426c2-samsung-ph-4623.playouts.now.amagi.tv/playlist.m3u8'] },
  { id: 330, name: 'LiveNOW from FOX',    category: 'News',          logo: null, streams: ['https://fox-foxnewsnow-vizio.amagi.tv/playlist.m3u8'] },
  { id: 331, name: 'NBC Sports NOW',      category: 'Sports',        logo: null, streams: ['https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8?ads.xumo_channelId=99993008'] },
  { id: 332, name: 'ESPN Deportes',       category: 'Sports',        logo: null, streams: ['https://e3.thetvapp.to/hls/espn-deportes/index.m3u8'] },
"""

idx = c.rfind('];')
if idx != -1:
    c = c[:idx] + new_channels + c[idx:]
    open(path, 'w', encoding='utf-8').write(c)
    print("Done! Added 12 channels including Comedy Central, Disney, Nickelodeon, BBC, Fox, NBC")
else:
    print("ERROR: could not find end of channels array")
