import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Fix missing comma after FilAmTV
content = re.sub(
    r"(ftv/playlist\.m3u8'\]\s*)\}(\s*\n\s*\{)",
    r"\1},\2",
    content
)

# New channels to add
new_channels = [
  { 'id': 233, 'name': 'CBS News 24/7', 'category': 'News', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/CBS_News_247_logo.svg/960px-CBS_News_247_logo.svg.png', 'streams': ['https://cbsn-us-vtt.cbsnstream.cbsnews.com/out/v1/ef868690d34144509eda696884bf1619/master.m3u8', 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8'] },
  { 'id': 234, 'name': 'Unbeaten', 'category': 'Sports', 'logo': 'https://i.imgur.com/LmkNt3v.png', 'streams': ['https://d1t5afz6qed3xk.cloudfront.net/Unbeaten.m3u8', 'https://unbeaten-tcl.amagi.tv/playlist.m3u8'] },
  { 'id': 235, 'name': 'Undercover Boss Global', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/O9lwu23.png', 'streams': ['https://all3media-international-undercoverboss-1-au.samsung.wurl.tv/playlist.m3u8', 'https://all3media-international-undercoverboss-1-nz.samsung.wurl.tv/playlist.m3u8'] },
  { 'id': 236, 'name': 'Pluto TV Cult Films', 'category': 'Movies', 'logo': 'https://i.imgur.com/xoaIAus.png', 'streams': ['https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/5c5c31f2f21b553c1f673fb0/master.m3u8?deviceType=samsung-tvplus&embedPartner=samsung-tvplus&masterJWTPassthrough=1'] },
  { 'id': 237, 'name': 'Impact Network', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/57NH9sS.png', 'streams': ['https://edge1.lifestreamcdn.com/live/impactroku1/index.m3u8', 'http://51.75.94.167/impact/index.m3u8'] },
  { 'id': 238, 'name': 'AKC TV', 'category': 'Outdoor', 'logo': 'https://i.imgur.com/XRTfoSp.png', 'streams': ['https://broadcast.blivenyc.com/speed/broadcast/22/desktop-playlist.m3u8', 'https://install.akctvcontrol.com/speed/broadcast/138/desktop-playlist.m3u8'] },
  { 'id': 239, 'name': '30A Music', 'category': 'Music', 'logo': 'https://i.imgur.com/gNWg9tl.png', 'streams': ['https://30a-tv.com/music.m3u8', 'https://30a-tv.com/feeds/ceftech/30atvmusic.m3u8'] },
  { 'id': 240, 'name': 'Anime x HIDIVE', 'category': 'Animation', 'logo': 'https://i.imgur.com/v0BlxCa.png', 'streams': ['https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/6793eaa4bc03978b9bc63db1/master.m3u8?deviceType=samsung-tvplus&embedPartner=samsung-tvplus&masterJWTPassthrough=1', 'https://d3f088nnrrvkwf.cloudfront.net/v1/amc_anime_x_hidive_1/samsungheadend_us/latest/main/hls/playlist.m3u8'] },
  { 'id': 241, 'name': 'All Weddings WE tv', 'category': 'Series', 'logo': 'https://i.imgur.com/zKcaFcm.png', 'streams': ['https://pb-amiq9wz02dhco.akamaized.net/playlist.m3u8', 'https://amc-allweddings-1-us.xumo.wurl.tv/playlist.m3u8'] },
  { 'id': 242, 'name': 'Beach TV Panama City', 'category': 'Travel', 'logo': 'https://i.imgur.com/HCQDvEe.png', 'streams': ['http://media4.tripsmarter.com:1935/LiveTV/BTVHD/playlist.m3u8', 'https://5ed325193d4e1.streamlock.net:444/LiveTV/BTVHD/playlist.m3u8'] },
  { 'id': 243, 'name': 'BritBox Mysteries', 'category': 'Documentary', 'logo': 'https://i.imgur.com/PJdzoLN.png', 'streams': ['https://pb-ippotemhtglhp.akamaized.net/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/c95700f8-e51c-4a36-ad46-56f70fc9f1d9/playlist.m3u8'] },
  { 'id': 244, 'name': 'BYU TV', 'category': 'General', 'logo': 'https://i.imgur.com/mruGyuu.png', 'streams': ['https://d13j8jpstr8iqz.cloudfront.net/BYUtv.m3u8', 'https://amg02604-byutv-amg02604c2-firetv-us-4981.playouts.now.amagi.tv/playlist.m3u8'] },
  { 'id': 245, 'name': 'CBS News Boston', 'category': 'News', 'logo': 'https://i.imgur.com/9un7R3N.png', 'streams': ['https://cbsn-bos.cbsnstream.cbsnews.com/out/v1/589d66ec6eb8434c96c28de0370d1326/master.m3u8', 'https://dai.google.com/linear/hls/pa/event/dHA193vxQ_WqZNVoC-W5MA/stream/6e418a0a-0a3b-4de2-9eb5-6d0bca1f8769:CHS/master.m3u8'] },
  { 'id': 246, 'name': 'Buzzr', 'category': 'Entertainment', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Buzzr_logo.svg/960px-Buzzr_logo.svg.png', 'streams': ['https://buzzrota-ono.amagi.tv/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/d4038326-a3e3-4aba-b1f1-f0526c912c74/playlist.m3u8'] },
  { 'id': 247, 'name': 'Cheddar News', 'category': 'News', 'logo': 'https://i.imgur.com/tuP9GW8.png', 'streams': ['https://wurlcheddar.global.transmit.live/hls/689ceac9301c34d3919676f3/v1/Cheddar/samsung_us/latest/main/hls/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/27ff1997-507a-41c4-8433-08875fe5f40f/playlist.m3u8'] },
  { 'id': 248, 'name': 'QVC', 'category': 'Shopping', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/QVC_logo_2019.svg/960px-QVC_logo_2019.svg.png', 'streams': ['https://qvc-amd-live.akamaized.net/hls/live/2034113/lsqvc1us/master.m3u8', 'https://a-cdn.klowdtv.com/live2/qvclive_720p/playlist.m3u8'] },
  { 'id': 249, 'name': 'Revry Queer', 'category': 'Lifestyle', 'logo': 'https://f9q4g5j6.ssl.hwcdn.net/5fc81016d98cab623846a4f3', 'streams': ['https://4aafa23ec0a6477ca31466bd83a115a4.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-43-REVRY2-GALXY/mt/galxy/43/hls/master/playlist.m3u8', 'https://linear-43.frequency.stream/mt/galxy/43/hls/master/playlist.m3u8'] },
  { 'id': 250, 'name': 'Daystar TV Espanol', 'category': 'Religious', 'logo': 'https://i.imgur.com/4nP7j4M.png', 'streams': ['https://hls-live-media-gc.cdn01.net/mpegts/232076_2222907/bI7YLDjG-QC_0puM4vuSsA/1776902400/master_mpegts.m3u8', 'https://hls-live-media-gc.cdn01.net/mpegts/232076_2222907/karlKyiKToEdHsTFUcjs9g/1776816000/master_mpegts.m3u8'] },
  { 'id': 251, 'name': 'NBCLX', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/5iT7hEa.png', 'streams': ['https://nbculocallive.akamaized.net/hls/live/2037096/lx/use1.m3u8', 'https://dn7vkzd5khpp3.cloudfront.net/master.m3u8'] },
  { 'id': 252, 'name': 'Ninja Kidz TV', 'category': 'Kids', 'logo': 'https://i.imgur.com/7EngqUi.png', 'streams': ['https://d3868b4ny0rgdf.cloudfront.net/playlist.m3u8', 'https://playworksdigital-ninjakidztv-1-us.xumo.wurl.tv/playlist.m3u8'] },
  { 'id': 253, 'name': 'Outdoor America', 'category': 'Outdoor', 'logo': 'https://i.imgur.com/UKfimFD.png', 'streams': ['https://d1e354daam8g5r.cloudfront.net/playlist.m3u8', 'https://linear-600.frequency.stream/dist/xumo/600/hls/master/playlist.m3u8'] },
  { 'id': 254, 'name': 'Outdoor Channel', 'category': 'Outdoor', 'logo': 'https://i.imgur.com/Kh4MWaY.png', 'streams': ['https://amg00718-outdoorchannela-outdoortv-samsungau-uc7mp.amagi.tv/playlist/amg00718-outdoorchannela-outdoortv-samsungau/playlist.m3u8', 'https://d3ehdya3kqqd52.cloudfront.net/v1/master/9d062541f2ff39b5c0f48b743c6411d25f62fc25/DistroTV-MuxIP-OutdoorChannelV2/455.m3u8'] },
  { 'id': 255, 'name': 'Hi-YAH!', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/sOYAnTB.png', 'streams': ['https://a28dc5e3f24c4a8da3a67c68be729c2c.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-59-HIYAH-PLEX/mt/plex/59/hls/master/playlist.m3u8', 'https://linear-59.frequency.stream/dist/xumo/59/hls/master/playlist.m3u8'] },
  { 'id': 256, 'name': 'Popstar! TV', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/d4xEiXX.png', 'streams': ['https://linear-10.frequency.stream/dist/stirr/10/hls/master/playlist.m3u8', 'https://bd0c70d8954d416d819afb3e1c940ee6.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-10-POPSTAR-PLEX/mt/plex/10/hls/master/playlist.m3u8'] },
  { 'id': 257, 'name': 'Always Funny Videos', 'category': 'Series', 'logo': 'https://i.imgur.com/vfdN5Xl.png', 'streams': ['https://d24l3uppudokci.cloudfront.net/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/a0713659-0883-4501-9aba-f7e651becae9/playlist.m3u8'] },
  { 'id': 258, 'name': 'Brat TV', 'category': 'Kids', 'logo': 'https://i.imgur.com/Kkcp9Bk.png', 'streams': ['https://amg00350-amg00350c1-klowdtv-us-2536.playouts.now.amagi.tv/playlist/amg00350-bratstudiofast-brat-klowdtvus/playlist.m3u8', 'https://brat-samsung-us.amagi.tv/playlist.m3u8'] },
  { 'id': 259, 'name': 'Anger Management', 'category': 'Comedy', 'logo': 'https://i.imgur.com/VXZgrNy.png', 'streams': ['https://amg00353-lionsgatestudio-angermgmt-samsungau-o9jg9.amagi.tv/playlist/amg00353-lionsgatestudio-angermgmt-samsungau/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/0a019247-55a2-4b3e-8b62-b84c9cbd5b12/playlist.m3u8'] },
  { 'id': 260, 'name': 'ARTFLIX Movie Classics', 'category': 'Movies', 'logo': 'https://i.imgur.com/5pOZQB4.png', 'streams': ['https://amogonetworx-artflix-1-nl.samsung.wurl.tv/playlist.m3u8', 'https://amogonetworx-artflix-1-se.samsung.wurl.tv/playlist.m3u8'] },
  { 'id': 261, 'name': 'RiffTrax', 'category': 'Comedy', 'logo': 'https://i.imgur.com/hM4yKMn.png', 'streams': ['https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/58d947b9e420d8656ee101ab/master.m3u8?deviceType=samsung-tvplus&embedPartner=samsung-tvplus&masterJWTPassthrough=1', 'https://wurlrifftrax.global.transmit.live/hls/68222b9cbe836edbe6f39e74/playlist.m3u8'] },
  { 'id': 262, 'name': 'Inside Crime', 'category': 'Series', 'logo': 'https://i.imgur.com/wvQYWsj.png', 'streams': ['https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/61c49f1495f417000731cef0/master.m3u8?deviceType=samsung-tvplus&embedPartner=samsung-tvplus&masterJWTPassthrough=1', 'https://aenetworks-insidecrime-rakuten.amagi.tv/playlist.m3u8'] },
  { 'id': 263, 'name': 'Fubo Sports Network', 'category': 'Sports', 'logo': 'https://i.imgur.com/qFNRJLb.png', 'streams': ['https://dnf08l6u6uxnz.cloudfront.net/master.m3u8', 'https://aegis-cloudfront-1.tubi.video/c2ac89da-5c69-439e-b85d-d87de0548b54/playlist.m3u8'] },
  { 'id': 264, 'name': 'RetroCrush', 'category': 'Animation', 'logo': 'https://i.imgur.com/M40b4YI.png', 'streams': ['https://linear-899.frequency.stream/dist/cineverse/899/hls/master/playlist.m3u8', 'https://d2nqmwm1ndpgi2.cloudfront.net/playlist.m3u8'] },
  { 'id': 265, 'name': 'Glory Kickboxing', 'category': 'Sports', 'logo': 'https://i.imgur.com/tS7Ub7i.png', 'streams': ['https://6f972d29.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0dsb3J5S2lja2JveGluZ19ITFM/playlist.m3u8'] },
  { 'id': 266, 'name': 'Choppertown', 'category': 'Auto', 'logo': 'https://i.imgur.com/U6cu5Ms.png', 'streams': ['https://linear-11.frequency.stream/dist/glewedtv/11/hls/master/playlist.m3u8', 'https://6c4d10b7b847421db903914a39b00eb7.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-11-CHOPPERTOWN-PLEX/mt/plex/11/hls/master/playlist.m3u8'] },
  { 'id': 267, 'name': 'Game Show Central', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/Uuc5h1s.png', 'streams': ['https://pb-bunear28tuvaw.akamaized.net/v1/gsn_gameshowchannnel_1/samsungheadend_us/latest/main/hls/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/55c4e96c-e345-486c-8f61-8320b61d734d/playlist.m3u8'] },
  { 'id': 268, 'name': 'LiveNOW from FOX', 'category': 'News', 'logo': 'https://i.imgur.com/1JnyzHv.png', 'streams': ['https://pb-k5p02dtnr2162.akamaized.net/LiveNOW_from_FOX.m3u8', 'https://fox-foxnewsnow-vizio.amagi.tv/playlist.m3u8'] },
  { 'id': 269, 'name': 'Cold Case Files', 'category': 'Series', 'logo': 'https://i.imgur.com/mowSfj6.png', 'streams': ['https://pb-ab2qxzv3xf291.akamaized.net/Cold_Case_Files.m3u8', 'https://aegis-cloudfront-1.tubi.video/1e764712-0649-4946-bd7e-f1bbba3be6fa/playlist.m3u8'] },
  { 'id': 270, 'name': 'Schwab Network', 'category': 'Business', 'logo': 'https://i.imgur.com/zmQnKV6.png', 'streams': ['https://tdameritrade-distro.amagi.tv/playlist.m3u8', 'https://content.uplynk.com/channel/f9aafa1f132e40af9b9e7238bc18d128.m3u8'] },
  { 'id': 271, 'name': 'Grit Xtra', 'category': 'Entertainment', 'logo': 'https://pbs.twimg.com/profile_images/1587656647803113472/tANAElTS_400x400.jpg', 'streams': ['https://pb-7k9tqpp5wqdnj.akamaized.net/Grit_Xtra_US.m3u8', 'https://aegis-cloudfront-1.tubi.video/3bda1ff3-ae32-45ab-ad49-f5e206511a70/playlist.m3u8'] },
  { 'id': 272, 'name': 'HollyWire', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/oVNjFoj.png', 'streams': ['https://bozztv.com/hwotta/playlist/playlist.m3u8', 'https://di1slo8304ver.cloudfront.net/playlist.m3u8'] },
  { 'id': 273, 'name': '24 Hour Free Movies', 'category': 'Movies', 'logo': 'https://i.imgur.com/iSVnzR1.png', 'streams': ['https://d1b5mlajbmvkjv.cloudfront.net/v1/master/9d062541f2ff39b5c0f48b743c6411d25f62fc25/UDU-DistroTV/145.m3u8', 'https://d1j2u714xk898n.cloudfront.net/scheduler/scheduleMaster/145.m3u8'] },
  { 'id': 274, 'name': 'CBS News Miami', 'category': 'News', 'logo': 'https://i.imgur.com/DExbVa9.png', 'streams': ['https://cbsn-mia.cbsnstream.cbsnews.com/out/v1/ac174b7938264d24ae27e56f6584bca0/master.m3u8', 'https://lineup.cbsivideo.com/playout/8796731e-7ce7-4bcf-bb04-41ef5a969c62/master.m3u8'] },
  { 'id': 275, 'name': 'The Country Network', 'category': 'Music', 'logo': 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Country_Network_Logo.png', 'streams': ['https://amg00600-amg00600c1-thecountrynetwork-us-5497.playouts.now.amagi.tv/playlist.m3u8', 'https://a-cdn.klowdtv.com/live2/countrytv_720p/playlist.m3u8'] },
  { 'id': 276, 'name': 'NTD TV', 'category': 'General', 'logo': 'https://i.imgur.com/QtFM5Oo.png', 'streams': ['https://live.ntdtv.com/uwlive990/playlist.m3u8', 'https://live.ntdtv.com/live900/playlist.m3u8'] },
  { 'id': 277, 'name': 'The Walking Dead Universe', 'category': 'Series', 'logo': 'https://i.imgur.com/IwJ5Pnc.png', 'streams': ['https://pb-7ien6yaxy2am1.akamaized.net/playlist.m3u8', 'https://amc-twdfanexperience-1-us.xumo.wurl.tv/playlist.m3u8'] },
  { 'id': 278, 'name': 'TMZ', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/eLIe7Va.png', 'streams': ['https://pb-ryciga1q62u8o.akamaized.net/TMZ.m3u8', 'https://aegis-cloudfront-1.tubi.video/57c1fa3c-566b-4998-b6de-d6de67031d99/index.m3u8'] },
  { 'id': 279, 'name': 'TODAY All Day', 'category': 'News', 'logo': 'https://i.imgur.com/LhbQ8Mr.png', 'streams': ['https://d37kx062o4ii0p.cloudfront.net/master.m3u8', 'https://aegis-cloudfront-1.tubi.video/cb7f305d-049a-4feb-bc6e-028c43ad3c3e/master.m3u8'] },
  { 'id': 280, 'name': 'True History', 'category': 'Documentary', 'logo': 'https://i.imgur.com/1BHDGXx.png', 'streams': ['https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/true-history/playlist.m3u8', 'https://linear-188.frequency.stream/dist/glewedtv/188/hls/master/playlist.m3u8'] },
  { 'id': 281, 'name': 'Midnight Pulp', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/R7nnHfb.png', 'streams': ['https://linear-897.frequency.stream/dist/cineverse/897/hls/master/playlist.m3u8', 'https://d18l78mi5ujmqr.cloudfront.net/playlist.m3u8'] },
  { 'id': 282, 'name': 'Bounce XL', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/GzxgSkc.png', 'streams': ['https://pb-xp0ozx9lyqeiv.akamaized.net/BounceXL_US.m3u8', 'https://aegis-cloudfront-1.tubi.video/22eea4e9-00a6-427c-92dd-57e78cc160dc/playlist.m3u8'] },
  { 'id': 283, 'name': 'Daystar TV', 'category': 'Religious', 'logo': 'https://i.imgur.com/IjzCv8f.png', 'streams': ['https://hls-live-media-gc.cdn01.net/mpegts/232076_2222904/4A4UNcpCda6il11Z5y8zHw/1776902400/master_mpegts.m3u8', 'https://hls-live-media-gc.cdn01.net/mpegts/232076_2222904/ApFvejWjRVUzPbyYzS8d9g/1776816000/master_mpegts.m3u8'] },
  { 'id': 284, 'name': 'Stadium', 'category': 'Sports', 'logo': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Stadium_%28sports_network%29_logo.svg/960px-Stadium_%28sports_network%29_logo.svg.png', 'streams': ['https://wurl120sports.global.transmit.live/hls/679a907dce42a042c23ace37/v1/stadium_gracenote/samsung_us/latest/main/hls/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/74681dcc-e6d0-4add-ad67-a22ad9c152e6/playlist.m3u8'] },
  { 'id': 285, 'name': 'VoA TV', 'category': 'News', 'logo': 'https://i.imgur.com/rtRnlqN.png', 'streams': ['https://voa-ingest.akamaized.net/hls/live/2033874/tvmc06/playlist.m3u8'] },
  { 'id': 286, 'name': 'So Real', 'category': 'Lifestyle', 'logo': 'https://i.imgur.com/wZ2uj9d.png', 'streams': ['https://cineverse-all3-soreal-1-us.ono.wurl.tv/playlist.m3u8'] },
  { 'id': 287, 'name': 'World Channel', 'category': 'Education', 'logo': 'https://upload.wikimedia.org/wikipedia/commons/3/36/World_Channel_2023.svg', 'streams': ['https://world.lls.pbs.org/index.m3u8'] },
  { 'id': 288, 'name': 'Pursuit Channel', 'category': 'Outdoor', 'logo': 'https://upload.wikimedia.org/wikipedia/en/d/d6/Pursuit_Channel_logo.png', 'streams': ['https://d2qa45tniogkj6.cloudfront.net/out/v1/30f129d3a8a8482b9efe5092cf46e601/index.m3u8'] },
  { 'id': 289, 'name': 'TVS Bowling Network', 'category': 'Sports', 'logo': 'https://www.watchyour.tv/channels/logo/tvs-bowling-network.jpg', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvsbowling/index.m3u8'] },
  { 'id': 290, 'name': 'TVS Flashback Network', 'category': 'Entertainment', 'logo': 'https://www.watchyour.tv/channels/logo/tvs-flashback-network.jpg', 'streams': ['https://rpn.bozztv.com/gusa/gusa-TVSFlashback/index.m3u8'] },
  { 'id': 291, 'name': 'TVS Hollywood History', 'category': 'Classic', 'logo': 'https://i.imgur.com/QtQGyMS.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvshollywoohistory/index.m3u8'] },
  { 'id': 292, 'name': 'TVS Nostalgia', 'category': 'Classic', 'logo': 'https://i.imgur.com/q72FCCQ.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-nostalgia/index.m3u8'] },
  { 'id': 293, 'name': 'TVS Pinball Network', 'category': 'Kids', 'logo': 'https://i.imgur.com/HHmc14i.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-TVSCartoonNetwork/index.m3u8'] },
  { 'id': 294, 'name': 'TVS Quiz Show Network', 'category': 'Classic', 'logo': 'https://i.imgur.com/5ljQwx2.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvsgameshow/index.m3u8'] },
  { 'id': 295, 'name': 'TVS Sports', 'category': 'Sports', 'logo': 'https://i.imgur.com/Lwwq62E.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvssports/index.m3u8'] },
]

new_lines = []
for ch in new_channels:
    streams_str = ', '.join([f'"{s}"' for s in ch["streams"]])
    new_lines.append(f'  {{ id: {ch["id"]}, name: "{ch["name"]}", category: "{ch["category"]}", logo: "{ch["logo"]}", streams: [{streams_str}] }},')

new_js = '\n'.join(new_lines)

# Remove existing channels 200+ that were added by parse_m3u and replace cleanly
content = re.sub(r'\n  \{ id: 2\d\d,.*', '', content)

# Insert before ];
content = content.rstrip()
if content.endswith('];'):
    content = content[:-2].rstrip() + ',\n' + new_js + '\n];'
else:
    content = content.rstrip().rstrip(',') + ',\n' + new_js + '\n];'

src.write_text(content, encoding='utf-8')
print(f"Done! Added {len(new_channels)} channels.")
