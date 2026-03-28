import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

new_channels = [
  { 'id': 296, 'name': 'TVS Talk Network', 'category': 'Classic', 'logo': 'https://i.imgur.com/WsaVAhx.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-TVStalk/index.m3u8'] },
  { 'id': 297, 'name': 'TVS Tally Ho', 'category': 'Classic', 'logo': 'https://i.imgur.com/JlFwnDD.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvstallyho/index.m3u8'] },
  { 'id': 298, 'name': 'TVS Tavern', 'category': 'Classic', 'logo': 'https://i.imgur.com/3GTIs4j.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tavern/index.m3u8'] },
  { 'id': 299, 'name': 'TVS Travel Network', 'category': 'Travel', 'logo': 'https://i.imgur.com/vSFf5Ce.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvstravel/index.m3u8'] },
  { 'id': 300, 'name': 'TVS Vintage Network', 'category': 'Entertainment', 'logo': 'https://www.watchyour.tv/channels/logo/tvs-vintage-network.jpg', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvsvintage/index.m3u8'] },
  { 'id': 301, 'name': 'TVS Western Movie', 'category': 'Classic', 'logo': 'https://i.imgur.com/dwr98qb.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvswesternmovies/index.m3u8'] },
  { 'id': 302, 'name': 'TVS Women Sports', 'category': 'Sports', 'logo': 'https://i.imgur.com/8hC4PfF.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-tvswsn/index.m3u8'] },
  { 'id': 303, 'name': 'Revry LatinX', 'category': 'Entertainment', 'logo': 'https://admin.worldlivetv.stream/upload/files/thumbnail/vuth_1676133370_91639_20154.png', 'streams': ['https://f731ead539e447dfa2866e8f589da1ed.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-142-REVRYLATINX-24i/mt/24i/142/hls/master/playlist.m3u8'] },
  { 'id': 304, 'name': 'Universal Crime', 'category': 'Series', 'logo': 'https://i.imgur.com/OwSlGMu.png', 'streams': ['https://xumo-xumoent-vc-107-xmuvk.fast.nbcuni.com/live/master.m3u8'] },
  { 'id': 305, 'name': 'VBS TV', 'category': 'General', 'logo': 'https://i.imgur.com/OkslYzP.png', 'streams': ['https://tgn.bozztv.com/vbstvcdn/vbstv/ngrp:vbstv_all/playlist.m3u8'] },
  { 'id': 306, 'name': 'Vice News', 'category': 'News', 'logo': 'https://i.imgur.com/QWPJQnr.png', 'streams': ['https://vicetv-vicefast2-firetv.amagi.tv/playlist.m3u8'] },
  { 'id': 307, 'name': 'Vida Mejor TV', 'category': 'Religious', 'logo': 'https://i.imgur.com/1hJ16i0.png', 'streams': ['https://tgn.bozztv.com/betterlife/bettervida/bettervida/index.m3u8'] },
  { 'id': 308, 'name': 'Scientology Network', 'category': 'General', 'logo': 'https://i.imgur.com/HOYF8NA.png', 'streams': ['https://stream6.scientology.org/master.m3u8'] },
  { 'id': 309, 'name': 'Wanted: Dead or Alive', 'category': 'Classic', 'logo': 'https://i.imgur.com/vaSXaFp.png', 'streams': ['https://aegis-cloudfront-1.tubi.video/d5171dc7-f8c6-469c-81eb-e1ffaaed5721/playlist.m3u8'] },
  { 'id': 310, 'name': 'FilmRise Anime', 'category': 'Animation', 'logo': 'https://i.imgur.com/3wqeGXM.png', 'streams': ['https://dvu7aia8rjlfm.cloudfront.net/master.m3u8'] },
  { 'id': 311, 'name': '3ABN Kids', 'category': 'Kids', 'logo': 'https://i.imgur.com/z3npqO1.png', 'streams': ['https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8'] },
  { 'id': 312, 'name': 'Bloomberg Originals', 'category': 'Business', 'logo': 'https://provider-static.plex.tv/epg/cms/production/a69341a2-fce3-4a05-af2e-469540b25d73/BBOriginals_2023_Plex_Stacked_WHTrdx.png', 'streams': ['https://dai.google.com/linear/hls/pa/event/jKwfd4apQcuxQtyRI9Q6-Q/stream/6a1739c9-6532-413e-8bd0-fcbbbd689880:MRN2/master.m3u8', 'https://www.bloomberg.com/media-manifest/streams/qt.m3u8', 'https://aegis-cloudfront-1.tubi.video/c597e8ac-bfb2-4a1c-865c-cad55566f953/playlist.m3u8'] },
  { 'id': 313, 'name': 'Yahoo! Finance', 'category': 'Business', 'logo': 'https://jiotvimages.cdn.jio.com/dare_images/images/Yahoo_Finance.png', 'streams': ['https://yahoo-plex.amagi.tv/playlist.m3u8', 'https://yahoo-samsung.amagi.tv/playlist.m3u8', 'https://d1ewctnvcwvvvu.cloudfront.net/playlist.m3u8'] },
  { 'id': 314, 'name': '30A Investment Pitch', 'category': 'Business', 'logo': 'https://i.imgur.com/CKCtZo7.png', 'streams': ['https://30a-tv.com/InvPit.m3u8', 'https://30a-tv.com/feeds/xodglobal/30atv.m3u8'] },
  { 'id': 315, 'name': 'EntrepreneurTV', 'category': 'Business', 'logo': 'https://i.imgur.com/isRfHYZ.png', 'streams': ['https://cineverse-entrepreneurtv-entrepreneurtv-1-us.ono.wurl.tv/playlist.m3u8'] },
  { 'id': 316, 'name': 'Just for Laughs Gags', 'category': 'Comedy', 'logo': 'https://i.imgur.com/HjVEVMJ.png', 'streams': ['https://dzmydakq7xf9n.cloudfront.net/playlist.m3u8', 'https://streams2.sofast.tv/sofastplayout/4c727f82-d2ec-4a07-870c-49a6f22ee6f9_0_HLS/master.m3u8'] },
  { 'id': 317, 'name': 'Dry Bar Comedy+', 'category': 'Comedy', 'logo': 'https://i.imgur.com/3N2C60N.png', 'streams': ['https://drybar-drybarcomedy-1-us.samsung.wurl.tv/playlist.m3u8', 'https://drybar-drybarcomedy-1-ca.samsung.wurl.tv/playlist.m3u8'] },
  { 'id': 318, 'name': 'Comedy Dynamics', 'category': 'Comedy', 'logo': 'https://i.imgur.com/1lEvUOa.png', 'streams': ['https://d3a5mry3t5fzw9.cloudfront.net/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/03cfa38e-ff8b-4e52-8fd2-084636c0c043/playlist.m3u8', 'https://linear-903.frequency.stream/dist/xumo/903/hls/master/playlist.m3u8'] },
  { 'id': 319, 'name': 'SNL Vault', 'category': 'Comedy', 'logo': 'https://provider-static.plex.tv/epg/cms/production/712dae9e-9111-4bbc-8ea4-242e891ab5b3/snl-vault-fclogo-72-dpi-1500-x-1000-3-2-channel-logo-dark-plex-1.png', 'streams': ['https://xumo-xumoent-vc-103-d3uqt.fast.nbcuni.com/live/master.m3u8'] },
  { 'id': 320, 'name': "Kevin Hart's LOL! Network", 'category': 'Comedy', 'logo': 'https://i.imgur.com/Tiy3Ur2.png', 'streams': ['https://d1kt53vrikzr5o.cloudfront.net/v1/lol_lolnetwork_5/samsungheadend_us/latest/main/hls/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/54f95462-b44d-4c99-b74b-af49467454fa/playlist.m3u8'] },
  { 'id': 321, 'name': 'AFV', 'category': 'Comedy', 'logo': 'https://i.imgur.com/TOB9vmW.png', 'streams': ['https://d1mp1kdk5zi1ie.cloudfront.net/playlist.m3u8'] },
  { 'id': 322, 'name': '30A Ridiculous TV', 'category': 'Comedy', 'logo': 'https://i.imgur.com/gNWg9tl.png', 'streams': ['https://30a-tv.com/feeds/720p/63.m3u8'] },
  { 'id': 323, 'name': 'NBC Comedy Vault', 'category': 'Comedy', 'logo': 'https://i.imgur.com/nydZWwg.png', 'streams': ['https://xumo-xumoent-vc-105-z0vpm.fast.nbcuni.com/live/master.m3u8'] },
  { 'id': 324, 'name': 'Tastemade', 'category': 'Cooking', 'logo': 'https://i.imgur.com/xP7Ehn8.png', 'streams': ['https://pb-rlo4if9lnjthw.akamaized.net/Tastemade.m3u8', 'https://tastemade-xumo.amagi.tv/playlist.m3u8', 'https://tastemade-tdint-rakuten.amagi.tv/playlist.m3u8'] },
  { 'id': 325, 'name': "Gordon Ramsay's Hell's Kitchen", 'category': 'Cooking', 'logo': 'https://i.imgur.com/WgN4T18.png', 'streams': ['https://aegis-cloudfront-1.tubi.video/c8364f36-c60b-4a39-8d86-0b92db4611c0/index.m3u8'] },
  { 'id': 326, 'name': 'bon appetit', 'category': 'Cooking', 'logo': 'https://i.imgur.com/YhFFxlE.png', 'streams': ['https://bonappetit-samsung.amagi.tv/playlist.m3u8'] },
  { 'id': 327, 'name': 'Chef Champion', 'category': 'Cooking', 'logo': 'https://i.imgur.com/15a9pG9.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-chefchampion/index.m3u8'] },
  { 'id': 328, 'name': 'Court TV', 'category': 'Documentary', 'logo': 'https://i.imgur.com/qkfe3o9.png', 'streams': ['https://pb-2rv53xe17yzvq.akamaized.net/Court_TV_US.m3u8', 'https://aegis-cloudfront-1.tubi.video/661c498b-4af0-4ba9-ae1c-4081340ee085/playlist.m3u8', 'https://content.uplynk.com/channel/6c0bd0f94b1d4526a98676e9699a10ef.m3u8'] },
  { 'id': 329, 'name': 'Crime 360', 'category': 'Documentary', 'logo': 'https://i.imgur.com/IjtaG1m.png', 'streams': ['https://94a3e237.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0NyaW1lMzYwX0hMUw/playlist.m3u8', 'https://eb3933ec.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/Um9rdV9DcmltZTM2MF9ITFM/playlist.m3u8'] },
  { 'id': 330, 'name': 'The Pet Collective', 'category': 'Family', 'logo': 'https://i.imgur.com/yH7n2dF.png', 'streams': ['https://pb-jc9emctsujawo.akamaized.net/playlist.m3u8', 'https://the-pet-collective-international-au.samsung.wurl.tv/playlist.m3u8', 'https://the-pet-collective-international-us.samsung.wurl.tv/playlist.m3u8'] },
  { 'id': 331, 'name': 'TVS Family Channel', 'category': 'Family', 'logo': 'https://i.imgur.com/Y3EV3DL.png', 'streams': ['https://rpn.bozztv.com/gusa/gusa-TVSFamilyChannel/index.m3u8'] },
  { 'id': 332, 'name': 'ToonGoggles', 'category': 'Kids', 'logo': 'https://i.imgur.com/JMnxswq.png', 'streams': ['https://stream.ads.ottera.tv/playlist.m3u8?network_id=771', 'https://d1eg24xrsfr6kv.cloudfront.net/tg/tg/tg.m3u8'] },
  { 'id': 333, 'name': 'Kartoon Channel!', 'category': 'Kids', 'logo': 'https://i.imgur.com/1luzP3T.png', 'streams': ['https://d2z0ysa6dgxhlc.cloudfront.net/kchan.m3u8', 'https://aegis-cloudfront-1.tubi.video/ba23a03c-22ff-4a48-ae7e-dd8bf4ee4e29/kc_co.m3u8'] },
  { 'id': 334, 'name': 'Lego Channel', 'category': 'Kids', 'logo': 'https://i.imgur.com/xePwW13.png', 'streams': ['https://dh18i7whff86v.cloudfront.net/index.m3u8'] },
  { 'id': 335, 'name': 'PBS Kids', 'category': 'Kids', 'logo': 'https://i.imgur.com/q4cUQKW.png', 'streams': ['https://livestream.pbskids.org/out/v1/14507d931bbe48a69287e4850e53443c/est.m3u8'] },
  { 'id': 336, 'name': 'BBC Kids', 'category': 'Kids', 'logo': 'https://i.imgur.com/vKUD64a.png', 'streams': ['https://dmr1h4skdal9h.cloudfront.net/playlist.m3u8'] },
  { 'id': 337, 'name': 'Kids Pang TV', 'category': 'Kids', 'logo': 'https://i.imgur.com/mhAAIa2.png', 'streams': ['https://newidco-kidspangtv-1-us.roku.wurl.tv/playlist.m3u8'] },
  { 'id': 338, 'name': 'MovieSphere', 'category': 'Movies', 'logo': 'https://i.imgur.com/PHBgi3h.png', 'streams': ['https://pb-wmei1j77c66s0.akamaized.net/MovieSphere.m3u8', 'https://aegis-cloudfront-1.tubi.video/8b127a5b-3054-4f39-93a2-1c4aab9ef5ff/playlist.m3u8'] },
  { 'id': 339, 'name': 'Maverick Black Cinema', 'category': 'Movies', 'logo': 'https://images.fubo.tv/station_logos/maverick_black_cinema_c.png', 'streams': ['https://maverick-maverick-black-cinema-1-us.samsung.wurl.tv/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/55607a73-d5bd-4a09-979e-5933354469ee/playlist.m3u8'] },
  { 'id': 340, 'name': 'Cinevault 80s', 'category': 'Movies', 'logo': 'https://i.imgur.com/xaCyyDd.png', 'streams': ['https://gsn-cinevault-80s-2-us.roku.wurl.tv/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/ea1ab5d1-f554-4f6b-b03f-2611fcd94257/playlist.m3u8'] },
  { 'id': 341, 'name': 'FilmRise Western', 'category': 'Movies', 'logo': 'https://i.imgur.com/8j2npVc.png', 'streams': ['https://dz05z8iljgvbe.cloudfront.net/master.m3u8'] },
  { 'id': 342, 'name': 'Charge!', 'category': 'Movies', 'logo': 'https://i.imgur.com/1rxmu2u.png', 'streams': ['https://fast-channels.sinclairstoryline.com/CHARGE/index.m3u8'] },
  { 'id': 343, 'name': 'Made In Hollywood', 'category': 'Movies', 'logo': 'https://i.imgur.com/p16HNIM.png', 'streams': ['https://connection3-ent-nz.samsung.wurl.tv/playlist.m3u8'] },
  { 'id': 344, 'name': 'Movies!', 'category': 'Movies', 'logo': 'https://i.imgur.com/gAGn3mK.png', 'streams': ['https://bozztv.com/dvrfl03/hdirect/hdirect-ovair1-movies!/index.m3u8'] },
  { 'id': 345, 'name': '30A TV Classic Movies', 'category': 'Movies', 'logo': 'https://babaktv.com/wp-content/uploads/2023/09/30A-Classi-Movies.jpeg', 'streams': ['https://30a-tv.com/feeds/pzaz/30atvmovies.m3u8'] },
  { 'id': 346, 'name': 'Runtime Espanol', 'category': 'Movies', 'logo': 'https://i.imgur.com/OMQq19N.png', 'streams': ['https://run-rt-uh-roku.otteravision.com/run/rt_uh/rt_uh.m3u8'] },
  { 'id': 347, 'name': 'Revry Her', 'category': 'Movies', 'logo': 'https://xstreamcp-assets-msp.streamready.in/assets/DISTROTV/LIVECHANNEL/66698907bac4421ebc533646/images/logo_20231219_221435_68.png', 'streams': ['https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/revry-her/playlist.m3u8', 'https://e1020cd35a264d63afeb5bfbc9c99157.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-73-REVRYHER-24i/mt/24i/73/hls/master/playlist.m3u8'] },
  { 'id': 348, 'name': 'Mythbusters', 'category': 'Series', 'logo': 'https://i.imgur.com/wzzjvcH.png', 'streams': ['https://d2bog959vw5xq.cloudfront.net/playlist/amg00627-banijayfast-mythbusters-samsungau/playlist.m3u8'] },
  { 'id': 349, 'name': 'Midsomer Murders', 'category': 'Series', 'logo': 'https://i.imgur.com/VFqfyfY.png', 'streams': ['https://pb-10d2295rjh7ki.akamaized.net/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/d76934f9-bea8-4cc2-a812-c2e8a9c5d40a/playlist.m3u8', 'https://all3media-midsomer-1-us.xumo.wurl.tv/playlist.m3u8'] },
  { 'id': 350, 'name': 'Fear Factor', 'category': 'Series', 'logo': 'https://i.imgur.com/CIYnLWz.png', 'streams': ['https://d2y1l0qikd751h.cloudfront.net/Fear_Factor.m3u8', 'https://aegis-cloudfront-1.tubi.video/2a9fb8e7-51c2-40d0-9cc0-6eb963199568/playlist.m3u8'] },
  { 'id': 351, 'name': 'This Old House', 'category': 'Series', 'logo': 'https://i.imgur.com/nrVLyE6.png', 'streams': ['https://pb-qmu0m4a1cb5dj.akamaized.net/This_Old_House.m3u8', 'https://thisoldhouse-2-us.roku.wurl.tv/playlist.m3u8'] },
  { 'id': 352, 'name': 'Are We There Yet?', 'category': 'Series', 'logo': 'https://i.imgur.com/3BJQiHP.png', 'streams': ['https://aegis-cloudfront-1.tubi.video/453e03c1-3a9f-415c-9370-5c744b19a748/playlist.m3u8'] },
  { 'id': 353, 'name': "Don't Tell The Bride", 'category': 'Series', 'logo': 'https://i.imgur.com/h0bc3Fa.png', 'streams': ['https://amg00426-lds-amg00426c15-samsung-au-3684.playouts.now.amagi.tv/playlist.m3u8', 'https://lds-donttellbride-rakuten.amagi.tv/playlist.m3u8'] },
  { 'id': 354, 'name': 'Doctor Who Classic', 'category': 'Series', 'logo': 'https://i.imgur.com/JIqJQQM.png', 'streams': ['https://aegis-cloudfront-1.tubi.video/34cd3ae2-bb20-4594-af20-01f241a525ba/playlist.m3u8', 'https://bbc-classicdrwho-1-us.xumo.wurl.tv/playlist.m3u8'] },
  { 'id': 355, 'name': 'Antiques Roadshow UK', 'category': 'Series', 'logo': 'https://i.imgur.com/rKWLv48.png', 'streams': ['https://dbbg0ax8bgo7d.cloudfront.net/playlist.m3u8', 'https://bbc-antiquesroadshowuk-1-us.roku.wurl.tv/playlist.m3u8'] },
  { 'id': 356, 'name': 'Tiny House Nation', 'category': 'Series', 'logo': 'https://i.imgur.com/ai1P06C.png', 'streams': ['https://pb-yxy31pwnm3mp2.akamaized.net/v1/aenetworks_tinyhousenation_1/samsungheadend_us/latest/main/hls/playlist.m3u8'] },
  { 'id': 357, 'name': 'Outside TV', 'category': 'Outdoor', 'logo': 'https://xstreamcp-assets-msp.streamready.in/assets/DISTROTV/LIVECHANNEL/666988d3bac4421ebc533616/images/logo_20231219_220634_59.png', 'streams': ['https://outsidetv-firetv.amagi.tv/playlist.m3u8', 'https://desdobebr2wri.cloudfront.net/Outside.m3u8', 'https://aegis-cloudfront-1.tubi.video/14e92b99-6a44-4e9d-9959-dd9ac76884b3/playlist.m3u8'] },
  { 'id': 358, 'name': 'PursuitUP', 'category': 'Outdoor', 'logo': 'https://i.imgur.com/5Vzwqts.png', 'streams': ['https://linear-205.frequency.stream/dist/glewedtv/205/hls/master/playlist.m3u8', 'https://pursuitup-klowdtv.amagi.tv/playlist.m3u8', 'https://d1p1siomv3cm7b.cloudfront.net/playlist.m3u8'] },
  { 'id': 359, 'name': 'Waypoint TV', 'category': 'Outdoor', 'logo': 'https://i.imgur.com/9vvlJN9.png', 'streams': ['https://waypoint-waypointtv-firetv.amagi.tv/playlist.m3u8', 'https://djb4ma5fajjay.cloudfront.net/Waypoint_TV.m3u8', 'https://aegis-cloudfront-1.tubi.video/5f3c2b46-3b02-48e8-8e7b-3ce1d89395ce/playlist.m3u8'] },
  { 'id': 360, 'name': 'Duck Hunting TV', 'category': 'Outdoor', 'logo': 'https://image.roku.com/developer_channels/prod/b2a80f0a20fc338f22a8289f23d20d19d958470ff1b8df3845c57cbc54ec1245.png', 'streams': ['https://main.duckhunting.playout.vju.tv/duckhuntingtv/main.m3u8'] },
  { 'id': 361, 'name': 'ION Plus', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/1dgCvNE.png', 'streams': ['https://pb-tcsruiaw9dc0i.akamaized.net/Ion_Plus_US.m3u8', 'https://aegis-cloudfront-1.tubi.video/5305de41-1f84-4226-a67b-6690552c7663/playlist.m3u8'] },
  { 'id': 362, 'name': 'Haunt TV', 'category': 'Entertainment', 'logo': 'https://yt3.googleusercontent.com/ytc/AIdro_kFORSMlXKT0V9fBpkp5TS7VbpwlNC6XbfZxrSSWUt1UA=s512-c-k-c0x00ffffff-no-rj', 'streams': ['https://d1ak5jijks54h1.cloudfront.net/Haunt_TV.m3u8', 'https://blueantmediacanada-haunttv-samsungca.amagi.tv/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/69da419c-6bb2-473f-98c3-246153fc909b/playlist.m3u8'] },
  { 'id': 363, 'name': 'Xplore TV', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/WaGRlFO.png', 'streams': ['https://depdwjha9qyli.cloudfront.net/Xplore.m3u8', 'https://aegis-cloudfront-1.tubi.video/4cfc30dc-1431-46b6-aea7-89a2e7d35823/playlist.m3u8', 'https://xplore-xumo.amagi.tv/playlist.m3u8'] },
  { 'id': 364, 'name': 'Wipeout Xtra', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/UDeCRW1.png', 'streams': ['https://djoigjo2g1xzo.cloudfront.net/Wipeout_Xtra.m3u8', 'https://aegis-cloudfront-1.tubi.video/e0a81cae-d483-46f9-aaa1-d0b87faa13cf/playlist.m3u8'] },
  { 'id': 365, 'name': 'Young Hollywood', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/X27MGHd.png', 'streams': ['https://younghollywood-rakuten-samsung.amagi.tv/playlist.m3u8', 'https://younghollywood-vizio.amagi.tv/playlist.m3u8'] },
  { 'id': 366, 'name': 'Rakuten Viki', 'category': 'Entertainment', 'logo': 'https://i.imgur.com/pbyd1g2.png', 'streams': ['https://newidco-rakutenviki-1-us.roku.wurl.tv/playlist.m3u8', 'https://newidco-rakutenviki-3-es.rakuten.wurl.tv/playlist.m3u8'] },
  { 'id': 367, 'name': 'Right Now TV', 'category': 'Entertainment', 'logo': 'https://xstreamcp-assets-msp.streamready.in/assets/DISTROTV/LIVECHANNEL/666988e8bac4421ebc533626/images/logo_20231219_221555_29.png', 'streams': ['https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/right-now-tv/playlist.m3u8', 'https://a-cdn.klowdtv.com/live2/rightnowtv_720p/playlist.m3u8'] },
  { 'id': 368, 'name': 'The Nest', 'category': 'Entertainment', 'logo': 'https://iili.io/JGqD21e.png', 'streams': ['https://fast-channels.sinclairstoryline.com/THENEST/index.m3u8'] },
]

new_lines = []
for ch in new_channels:
    streams_str = ', '.join([f'"{s}"' for s in ch["streams"]])
    new_lines.append(f'  {{ id: {ch["id"]}, name: "{ch["name"]}", category: "{ch["category"]}", logo: "{ch["logo"]}", streams: [{streams_str}] }},')

new_js = '\n'.join(new_lines)

content = content.rstrip()
if content.endswith('];'):
    content = content[:-2].rstrip() + ',\n' + new_js + '\n];'
else:
    content = content.rstrip().rstrip(',') + ',\n' + new_js + '\n];'

src.write_text(content, encoding='utf-8')
print(f"Done! Added {len(new_channels)} channels.")
