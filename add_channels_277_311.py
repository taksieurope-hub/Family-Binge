import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

PLUTO = 'https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/{}/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1'

NEW_CHANNELS = [
  { 'id': 277, 'name': 'Daystar TV', 'category': 'Religious', 'logo': 'https://i.imgur.com/0t9C04o.png', 'streams': [
      'https://live20.bozztv.com/dvrfl05/gin-daystar/index.m3u8',
      'https://amg01101-daystartelevisi-daystar-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 278, 'name': 'Bounce XL', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/6DByYZB.png', 'streams': [
      PLUTO.format('6176fd25e83a5f0007a464c9'),
      'https://amg01101-bouncexl-bouncexl-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 279, 'name': 'WCBS-DT1 CBS New York', 'category': 'General', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_logo_%282020%29.svg/960px-CBS_logo_%282020%29.svg.png', 'streams': [
      'https://aegis-cloudfront-1.tubi.video/9b8c7ba3-3c09-4e19-9bce-aed9e42be5d8/playlist.m3u8',
  ]},
  { 'id': 280, 'name': 'RVTV Rural America', 'category': 'General', 'logo': 'https://i.imgur.com/OaVKQwL.png', 'streams': [
      'https://amg01438-rvtv-rvtv-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 281, 'name': 'WSOC-DT1 ABC Charlotte', 'category': 'General', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png', 'streams': [
      'https://aegis-cloudfront-1.tubi.video/99765dba-e3aa-4d24-b49f-21d5e16e4e4a/playlist.m3u8',
  ]},
  { 'id': 282, 'name': 'Midnight Pulp', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/R7nnHfb.png', 'streams': [
      'https://amg00353-shout-midnightpulp-samsungus.amagi.tv/playlist.m3u8',
      'https://midnightpulp-plex.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 283, 'name': 'Comedy Central South Park', 'category': 'Series', 'logo': 'https://i.imgur.com/YbsxqIc.png', 'streams': [
      PLUTO.format('5cf04613626d10000a0a4697'),
      PLUTO.format('5b2d1dcbd3b54d52bdcbd6b1'),
  ]},
  { 'id': 284, 'name': 'True History', 'category': 'Documentary', 'logo': 'https://i.imgur.com/hFkB4fY.png', 'streams': [
      'https://amg01113-aenetworks-truehistory-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 285, 'name': 'TODAY All Day', 'category': 'News', 'logo': 'https://i.imgur.com/b4cZRRf.png', 'streams': [
      PLUTO.format('5d695f7db53adf96b78e7ce3'),
      'https://today-allday-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 286, 'name': 'TMZ', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/2zG1JsP.png', 'streams': [
      'https://dai2.xumo.com/xumocdn/p=roku/amagi_hls_data_xumo1234A-tmz/CDN/1280x720_5000000/index.m3u8',
      'https://tmz-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 287, 'name': 'The Walking Dead Universe', 'category': 'Series', 'logo': 'https://i.imgur.com/BW8hm8F.png', 'streams': [
      PLUTO.format('62fa8176b9884200074ef5ae'),
  ]},
  { 'id': 288, 'name': 'NTD TV', 'category': 'General', 'logo': 'https://i.imgur.com/WY0g2cZ.png', 'streams': [
      'https://ntd-ntdtv-samsungus.amagi.tv/playlist.m3u8',
      'https://amg00684-ntdamerica-ntdtv-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 289, 'name': 'The Price Is Right: The Barker Era', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/aOFDoZv.png', 'streams': [
      PLUTO.format('5cec2d8741c0bd000929c730'),
      'https://amg01087-cbsmedia-priceisright-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 290, 'name': 'The New Detectives', 'category': 'Series', 'logo': 'https://i.imgur.com/FOwMO3B.png', 'streams': [
      PLUTO.format('5cf04613626d10000a0a4670'),
      'https://amg01087-newdetectives-newdetectives-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 291, 'name': 'The Country Network', 'category': 'Music', 'logo': 'https://i.imgur.com/dQCPtPT.png', 'streams': [
      'https://thecountrynetwork-samsungus.amagi.tv/playlist.m3u8',
      'https://amg00353-thecountrynetw-thecountrynetwork-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 292, 'name': 'NFL RedZone', 'category': 'Sports', 'logo': 'https://i.imgur.com/QniXCxd.png', 'streams': [
      PLUTO.format('5cf04613626d10000a0a4696'),
      'https://amg01298-nflredzone-nflredzone-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 293, 'name': 'NBA TV', 'category': 'Sports', 'logo': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/NBA_TV_logo.svg/960px-NBA_TV_logo.svg.png', 'streams': [
      'https://amg01222-nba-nbatv-samsungus.amagi.tv/playlist.m3u8',
      'https://nbatv-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 294, 'name': 'Avatar', 'category': 'Kids', 'logo': 'https://i.imgur.com/TrBwXbA.png', 'streams': [
      PLUTO.format('5f4d83e0a382c00007bc02e6'),
      PLUTO.format('5cf04613626d10000a0a4694'),
  ]},
  { 'id': 295, 'name': 'Teen Mom', 'category': 'Documentary', 'logo': 'https://i.imgur.com/mOyBhvR.png', 'streams': [
      PLUTO.format('5df1c0e9a50cac000787fd63'),
      'https://amg01113-mtvteenmom-teenmom-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 296, 'name': 'MTV Pluto TV', 'category': 'Entertainment', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/MTV_2021_logo.svg/960px-MTV_2021_logo.svg.png', 'streams': [
      PLUTO.format('5cf04613626d10000a0a4699'),
  ]},
  { 'id': 297, 'name': 'CBS News Miami', 'category': 'News', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_logo_%282020%29.svg/960px-CBS_logo_%282020%29.svg.png', 'streams': [
      'https://cbsnewsmiami.cbslocal.com/hls/live/2020607/cbsnlineup_32/master.m3u8',
      'https://amg01087-cbsmedia-cbsnewsmiami-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 298, 'name': 'Beach TV Myrtle Beach', 'category': 'Travel', 'logo': 'https://i.imgur.com/1Q79EAt.png', 'streams': [
      'https://nimble.dashstreams.net/onestudio/beachtv/playlist.m3u8',
      'https://beachtv-myrtlebeach-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 299, 'name': 'Beach TV Florida & Alabama', 'category': 'Travel', 'logo': 'https://i.imgur.com/1Q79EAt.png', 'streams': [
      'https://a-cdn.klowdtv.com/live3/beachtvfl_720p/playlist.m3u8',
      'https://beachtv-florida-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 300, 'name': '24 Hour Free Movies', 'category': 'Movies', 'logo': 'https://i.imgur.com/UQH3DPD.png', 'streams': [
      'https://muxip-24hoursmovies-klowdtv.amagi.tv/playlist.m3u8',
      'https://24hourfreemovies-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 301, 'name': 'Ghost Dimension', 'category': 'Series', 'logo': 'https://i.imgur.com/9MagVIF.png', 'streams': [
      PLUTO.format('5f12111c9e6c2c00078ef3bc'),
      'https://ghostdimension-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 302, 'name': 'Beverly Hills 90210', 'category': 'Series', 'logo': 'https://i.imgur.com/jnuM6w1.png', 'streams': [
      PLUTO.format('5f4d83e0a382c00007bc02e7'),
      PLUTO.format('60afb576053df900076fa2f0'),
  ]},
  { 'id': 303, 'name': 'HollyWire', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/TPhOzBG.png', 'streams': [
      'https://hollywire-samsungus.amagi.tv/playlist.m3u8',
      'https://amg00353-hollywire-hollywire-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 304, 'name': 'Grit Xtra', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/aXhVFJl.png', 'streams': [
      'https://gritxtra-samsungus.amagi.tv/playlist.m3u8',
      'https://amg01438-ewscrippscompan-gritxtra-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 305, 'name': 'Golf Channel', 'category': 'Sports', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Golf_Channel_logo_2021.svg/960px-Golf_Channel_logo_2021.svg.png', 'streams': [
      'https://amg01371-golfchannel-golfchannel-samsungus.amagi.tv/playlist.m3u8',
      'https://golfchannel-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 306, 'name': 'Lego Channel', 'category': 'Kids', 'logo': 'https://i.imgur.com/qKWXWBD.png', 'streams': [
      'https://amg01076-lego-legochannel-samsungus.amagi.tv/playlist.m3u8',
      'https://legochannel-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 307, 'name': 'Smithsonian Channel Selects', 'category': 'Science', 'logo': 'https://i.imgur.com/kDvQF2X.png', 'streams': [
      PLUTO.format('5cff1d7e3b5e1100095b53fb'),
      'https://smithsonianselects-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 308, 'name': 'Schwab Network', 'category': 'Business', 'logo': 'https://i.imgur.com/YHmkfGL.png', 'streams': [
      'https://amg01298-tdameritrade-schwabnetwork-samsungus.amagi.tv/playlist.m3u8',
      'https://schwabnetwork-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 309, 'name': 'Cold Case Files', 'category': 'Series', 'logo': 'https://i.imgur.com/ABB3cRs.png', 'streams': [
      PLUTO.format('5cf04613626d10000a0a4672'),
      'https://amg01113-aenetworks-coldcasefiles-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 310, 'name': 'At Home with Family Handyman', 'category': 'Series', 'logo': 'https://i.imgur.com/c0LmqXA.png', 'streams': [
      'https://amg01438-familyhandyman-athomewfamilyh-samsungus.amagi.tv/playlist.m3u8',
      'https://familyhandyman-samsungus.amagi.tv/playlist.m3u8',
  ]},
  { 'id': 311, 'name': 'Gunsmoke', 'category': 'Series', 'logo': 'https://i.imgur.com/9NxLXcZ.png', 'streams': [
      PLUTO.format('5d10a39b3b5e11000836bdb7'),
      'https://gunsmoke-samsungus.amagi.tv/playlist.m3u8',
  ]},
]

new_lines = []
for ch in NEW_CHANNELS:
    streams_str = ', '.join([f'"{s}"' for s in ch['streams']])
    line = f'  {{ id: {ch["id"]}, name: "{ch["name"]}", category: "{ch["category"]}", logo: "{ch["logo"]}", streams: [{streams_str}] }},'
    new_lines.append(line)
new_js = '\n'.join(new_lines) + '\n'

idx = content.index('];')
content = content[:idx] + new_js + content[idx:]
src.write_text(content, encoding='utf-8')
print(f'Done! {len(NEW_CHANNELS)} channels added (ids 277-311).')
