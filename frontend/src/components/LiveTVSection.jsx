import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Tv, Radio, Globe, Search } from 'lucide-react';

const channels = [
  { id: 1,  name: 'Al Jazeera English',   category: 'News',          logo: null,                                                                                streams: ['https://live-hls-aje-ak.getaj.net/AJE/01.m3u8'] },
  { id: 2,  name: 'TRT World',            category: 'News',          logo: null,                                                                                streams: ['https://tv-trtworld.medya.trt.com.tr/master_1080.m3u8'] },
  { id: 3,  name: 'DW English',           category: 'News',          logo: null,                                                                                streams: ['https://dwamdstream102.akamaized.net/hls/live/2015529/dwstream102/index.m3u8'] },
  { id: 4,  name: 'France 24 English',    category: 'News',          logo: null,                                                                                streams: ['https://stream.france24.com/hls/live/2037163/F24_EN_HI_HLS/master.m3u8'] },
  { id: 5,  name: 'RT News',             category: 'News',          logo: null,                                                                                streams: ['https://rt-glb.rttv.com/dvr/rtnews/playlist_4500Kb.m3u8', 'https://rt-glb.rttv.com/live/rtnews/playlist.m3u8'] },
  { id: 6,  name: 'RT Documentary',      category: 'Documentary',   logo: null,                                                                                streams: ['https://rt-rtd.rttv.com/live/rtdoc/playlist_4500Kb.m3u8'] },
  { id: 7,  name: 'Newsmax',             category: 'News',          logo: 'https://www.lyngsat.com/logo/tv/nn/newsmax-2-us-ug.png',                            streams: ['https://nmxdistro.akamaized.net/hls/live/529965/Live_1/index.m3u8', 'https://nmxlive.akamaized.net/hls/live/529965/Live_1/index.m3u8', 'https://newsmax-samsungus.amagi.tv/playlist.m3u8', 'https://newsmax-vizio.amagi.tv/playlist.m3u8'] },
  { id: 8,  name: 'GB News',             category: 'News',          logo: null,                                                                                streams: ['https://rakutenaa-lightning-gbnews-rakuten-ccoa9.amagi.tv/playlist/rakutenAA-lightning-gbnews-rakuten/playlist.m3u8'] },
  { id: 9,  name: 'The First TV',        category: 'News',          logo: null,                                                                                streams: ['https://thefirst-oando.amagi.tv/playlist.m3u8'] },
  { id: 10, name: 'Bloomberg TV',        category: 'Business',      logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Bloomberg_TV.png',               streams: ['https://cdn4.skygo.mn/live/disk1/Bloomberg/HLSv3-FTA/Bloomberg.m3u8', 'https://www.bloomberg.com/media-manifest/streams/eu.m3u8', 'https://www.bloomberg.com/media-manifest/streams/us.m3u8', 'https://86ebec83.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0Jsb29tYmVyZ1RWUGx1c19ITFM/playlist.m3u8', 'https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/bloomberg-television/bloombergtv.m3u8', 'https://aegis-cloudfront-1.tubi.video/de29234d-1a53-4cf9-b6ba-9cf412b66d76/playlist.m3u8', 'https://d2d98ykcmmhgd4.cloudfront.net/v1/bloomberg_bloombergtv_2/samsungheadend_us/latest/main/hls/playlist.m3u8'] },
  { id: 11, name: 'Bloomberg Originals', category: 'Business',      logo: 'https://provider-static.plex.tv/epg/cms/production/a69341a2-fce3-4a05-af2e-469540b25d73/BBOriginals_2023_Plex_Stacked_WHTrdx.png', streams: ['https://www.bloomberg.com/media-manifest/streams/qt.m3u8', 'https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/bloomberg-quicktake/bloombergqt.m3u8', 'https://aegis-cloudfront-1.tubi.video/c597e8ac-bfb2-4a1c-865c-cad55566f953/playlist.m3u8', 'https://86fdc85a.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/TEctZ2JfQmxvb21iZXJnT3JpZ2luYWxzX0hMUw/playlist.m3u8', 'https://www.bloomberg.com/media-manifest/streams/originals-global.m3u8'] },
  { id: 12, name: 'NASA TV',            category: 'Science',        logo: null,                                                                                streams: ['https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV1-HLS/master.m3u8'] },
  { id: 13, name: 'Wild Earth',          category: 'Nature',        logo: null,                                                                                streams: ['https://wildearth-plex.amagi.tv/masterR1080p.m3u8'] },
  { id: 14, name: 'Tastemade',           category: 'Cooking',       logo: 'https://i.imgur.com/xP7Ehn8.png',                                                   streams: ['https://tastemade-xumo.amagi.tv/playlist.m3u8', 'https://pb-rlo4if9lnjthw.akamaized.net/Tastemade.m3u8', 'https://tastemade-tdint-rakuten.amagi.tv/playlist.m3u8', 'https://tmint-aus-samsungau.amagi.tv/playlist.m3u8'] },
  { id: 15, name: 'The Pet Collective',  category: 'Family',        logo: 'https://i.imgur.com/yH7n2dF.png',                                                   streams: ['https://pb-jc9emctsujawo.akamaized.net/playlist.m3u8', 'https://the-pet-collective-international-au.samsung.wurl.tv/playlist.m3u8', 'https://6ec8627d.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X1RoZVBldENvbGxlY3RpdmVfSExT/playlist.m3u8'] },
  { id: 16, name: 'FailArmy',            category: 'Comedy',        logo: 'https://i.imgur.com/VIpQJxL.png',                                                   streams: ['https://pb-w5ixcojas1swl.akamaized.net/playlist.m3u8', 'https://failarmy-international-au.samsung.wurl.tv/playlist.m3u8', 'https://bd93cfed.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZhaWxBcm15X0hMUw/playlist.m3u8'] },
  { id: 17, name: 'People Are Awesome',  category: 'Entertainment', logo: 'https://i.imgur.com/MsIx7Ax.png',                                                   streams: ['https://3ab76e42.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X1Blb3BsZUFyZUF3ZXNvbWVfSExT/playlist.m3u8', 'https://jukin-peopleareawesome-2-au.samsung.wurl.tv/playlist.m3u8'] },
  { id: 18, name: 'Just for Laughs',     category: 'Comedy',        logo: 'https://i.imgur.com/HjVEVMJ.png',                                                   streams: ['https://dzmydakq7xf9n.cloudfront.net/playlist.m3u8', 'https://streams2.sofast.tv/sofastplayout/4c727f82-d2ec-4a07-870c-49a6f22ee6f9_0_HLS/master.m3u8'] },
  { id: 19, name: 'World Poker Tour',    category: 'Sports',        logo: 'https://i.imgur.com/98kLMjj.png',                                                   streams: ['https://amg00218-wptenterprisesi-worldpokertour-xumo-us.amagi.tv/playlist.m3u8', 'https://pb-41uwb26l8gvwx.akamaized.net/World_Poker_Tour.m3u8', 'https://d2e2kr7m9coe4.cloudfront.net/scheduler/scheduleMaster/406.m3u8'] },
  { id: 20, name: 'GoUSA TV',            category: 'Travel',        logo: 'https://i.imgur.com/x90ALip.png',                                                   streams: ['https://brandusa-gousa-1-in.samsung.wurl.tv/playlist.m3u8', 'https://brandusa-gousa-1-au.samsung.wurl.tv/playlist.m3u8', 'https://cc2b7c60df304389ba60c76790d1a82f.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/LG-au_GoUSATV/playlist.m3u8'] },
  { id: 21, name: 'Homes Under Hammer',  category: 'Series',        logo: 'https://i.imgur.com/P5Haaln.png',                                                   streams: ['https://all3media-homes-under-the-hammer-1-au.samsung.wurl.tv/playlist.m3u8', 'https://all3media-homes-under-the-hammer-1-gb.rakuten.wurl.tv/playlist.m3u8'] },
  { id: 22, name: 'Deal or No Deal',     category: 'Series',        logo: 'https://i.imgur.com/lZvNXA1.png',                                                   streams: ['https://deal-or-no-deal-rakuten.amagi.tv/playlist.m3u8', 'https://pb-gnznqq6l66wre.akamaized.net/Deal_or_No_Deal.m3u8', 'https://aegis-cloudfront-1.tubi.video/65eef95b-7b52-42be-8b08-faa459153ed9/playlist.m3u8'] },
  { id: 23, name: 'Haunt TV',            category: 'Entertainment', logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kFORSMlXKT0V9fBpkp5TS7VbpwlNC6XbfZxrSSWUt1UA=s512-c-k-c0x00ffffff-no-rj', streams: ['https://d1ak5jijks54h1.cloudfront.net/Haunt_TV.m3u8', 'https://aegis-cloudfront-1.tubi.video/69da419c-6bb2-473f-98c3-246153fc909b/playlist.m3u8', 'https://blueantmediacanada-haunttv-samsungca.amagi.tv/playlist.m3u8'] },
  { id: 24, name: 'Estrella TV',         category: 'Entertainment', logo: 'https://i.imgur.com/IZxjnyp.png',                                                   streams: ['https://estrellatv-plex.amagi.tv/playlist.m3u8', 'https://estrellatv-roku.amagi.tv/playlist.m3u8', 'https://estrellatv-xumo.amagi.tv/playlist.m3u8', 'https://aegis-cloudfront-1.tubi.video/20bf77c0-dc60-46ae-8e87-c01cc7a836fc/playlist.m3u8'] },
  { id: 25, name: 'EWTN',                category: 'Religious',     logo: 'https://i.imgur.com/sua70RO.png',                                                   streams: ['https://cdn3.wowza.com/1/ZVBYYXFLLzE0c3NC/Qk1FMURC/hls/live/playlist.m3u8', 'https://cdn3.wowza.com/1/QmVNUVhTNTZSS3Uz/YWQ0aHpi/hls/live/playlist.m3u8', 'https://cdn3.wowza.com/1/YW5wSWZiRGd2eFlU/bGV0aVBq/hls/live/playlist.m3u8'] },
  { id: 26, name: 'Newsmax 2',           category: 'News',          logo: 'https://www.lyngsat.com/logo/tv/nn/newsmax-2-us-ug.png',                            streams: ['https://newsmax-klowdtv.amagi.tv/playlist.m3u8', 'https://amg00217-newsmax-newsmax-samsungus.amagi.tv/playlist.m3u8'] },
  { id: 27, name: 'MovieSphere UK',      category: 'Movies',        logo: null,                                                                                streams: ['https://moviesphereuk-samsunguk.amagi.tv/playlist.m3u8'] },
  { id: 28, name: 'Sony Action Hits',    category: 'Movies',        logo: null,                                                                                streams: ['https://89514e758f814907be6d14bbc0aa66b7.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-800-UK-SONYONEACTIONHITS-LG_UK/playlist.m3u8'] },
  { id: 29, name: 'Sony Comedy Hits',    category: 'Movies',        logo: null,                                                                                streams: ['https://9f8e2ffcd87f4c469be7194e48f84874.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-802-UK-SONYONECOMEDYHITS-LG_UK/playlist.m3u8'] },
  { id: 30, name: 'Sony Comedy TV',      category: 'Movies',        logo: null,                                                                                streams: ['https://ec613694ee5049d3b8f30913b619662e.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-804-UK-SONYONECOMEDYTV-LG_UK/playlist.m3u8'] },
  { id: 31, name: 'Sony Thriller TV',    category: 'Movies',        logo: null,                                                                                streams: ['https://52aad07d9d4f4d479d9b27e08ddf9e8b.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-808-UK-SONYONETHRILLERTV-LG_UK/playlist.m3u8'] },
  { id: 32, name: 'Sony Faves',          category: 'Movies',        logo: null,                                                                                streams: ['https://8a4805800dac428ebbf1d3cde0cdcf87.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-806-UK-SONYONEFAVES-LG_UK/playlist.m3u8'] },
  { id: 33, name: 'Sony Dragons Den',    category: 'Series',        logo: null,                                                                                streams: ['https://5dae1f2dfec54d8f9992b7d2ac0bc627.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-810-UK-SONYONEDRAGONSDEN-LG_UK/playlist.m3u8'] },
  { id: 34, name: 'Rakuten Sci-Fi',      category: 'Movies',        logo: null,                                                                                streams: ['https://sci-fi-rakuten-tv-uk.fast.rakuten.tv/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6241/master.m3u8'] },
  { id: 35, name: 'Rakuten Romance',     category: 'Movies',        logo: null,                                                                                streams: ['https://romance-rakuten-tv-uk.fast.rakuten.tv/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6194/master.m3u8'] },
  { id: 36, name: 'Rakuten Thriller',    category: 'Movies',        logo: null,                                                                                streams: ['https://thriller-rakuten-tv-uk.fast.rakuten.tv/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6482/master.m3u8'] },
  { id: 37, name: 'Arirang TV',          category: 'Entertainment', logo: null,                                                                                streams: ['https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/chunklist_b3256000_sleng.m3u8'] },
  { id: 38, name: 'Talk TV',             category: 'News',          logo: null,                                                                                streams: ['https://live-talktv-ssai.simplestreamcdn.com/v1/master/774d979dd66704abea7c5b62cb34c6815fda0d35/talktv-live/index.m3u8'] },
  { id: 39, name: 'Trace Sport',         category: 'Sports',        logo: null,                                                                                streams: ['https://lightning-tracesport-samsungau.amagi.tv/playlist.m3u8'] },
  { id: 40, name: 'Trace Urban',         category: 'Entertainment', logo: null,                                                                                streams: ['https://lightning-traceurban-samsungau.amagi.tv/playlist.m3u8'] },
  { id: 41, name: 'Action Hollywood',    category: 'Movies',        logo: null,                                                                                streams: ['https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg01076-lightningintern-actionhollywood-samsungau/playlist.m3u8'] },
  { id: 42, name: 'Pulse',               category: 'Entertainment', logo: null,                                                                                streams: ['https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg01076-lightningintern-pulse-samsungau/playlist.m3u8'] },
  { id: 43, name: 'FNF Channel',         category: 'Entertainment', logo: null,                                                                                streams: ['https://lightning-fnf-samsungaus.amagi.tv/playlist.m3u8'] },
  { id: 44, name: 'My Time AU',          category: 'Entertainment', logo: null,                                                                                streams: ['https://appletree-mytimeau-samsung.amagi.tv/playlist.m3u8'] },
  { id: 45, name: 'Ion Plus',            category: 'Series',        logo: null,                                                                                streams: ['https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01438-ewscrippscompan-ionplus-tablo/playlist.m3u8'] },
  { id: 46, name: 'Tennis Channel Intl', category: 'Sports',        logo: null,                                                                                streams: ['https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01444-tennischannelth-tennischnlintl-lggb/playlist.m3u8'] },
  { id: 47, name: 'Outdoor TV NZ',       category: 'Nature',        logo: null,                                                                                streams: ['https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg00718-outdoorchannela-outdoortvnz-samsungnz/playlist.m3u8'] },
  { id: 48, name: 'Great British Menu',  category: 'Cooking',       logo: null,                                                                                streams: ['https://7ed93f662af44c2e9bdf93b56464f6a8.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/LG-gb_GreatBritishMenu/playlist.m3u8'] },
  { id: 49, name: 'Authentic History',   category: 'Documentary',   logo: null,                                                                                streams: ['https://9e754fa707344ccca6d84955c8fcaf36.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/RlaxxTV-eu_AutenticHistory/playlist.m3u8'] },
  { id: 50, name: 'Authentic Travel',    category: 'Travel',        logo: null,                                                                                streams: ['https://cb0c87cc605942ff9766a4e6744bbadc.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/RlaxxTV-eu_AutenticTravel/playlist.m3u8'] },
  { id: 51, name: 'Adventure Earth',     category: 'Nature',        logo: null,                                                                                streams: ['https://a57e9c69976649b582a8d7604c00e69a.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/RlaxxTV-eu_AdventureEarth/playlist.m3u8'] },
  { id: 52, name: 'Inside Outside',      category: 'Entertainment', logo: null,                                                                                streams: ['https://52405cd167dc41c68edcaa842b916ccd.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/LG-au_InsideOutside/playlist.m3u8'] },
  { id: 53, name: 'ORF Austria',         category: 'Entertainment', logo: null,                                                                                streams: ['http://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8'] },
  { id: 54, name: 'NBC (US)',            category: 'Entertainment', logo: null,                                                                                streams: ['https://livehub-voidnet.onrender.com/cluster/streamcore/us/NBC_REDIS.m3u8'] },
  { id: 55, name: 'ESPN',               category: 'Sports',        logo: null,                                                                                streams: ['http://41.205.93.154/ESPN/index.m3u8'] },
  { id: 56, name: 'Discovery',          category: 'Documentary',   logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_DISCOVERY/index.m3u8'] },
  { id: 57, name: 'Nat Geo',            category: 'Documentary',   logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_NAT_GEO/index.m3u8'] },
  { id: 58, name: 'Comedy Central',     category: 'Comedy',        logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_COMEDY_CENTRAL/index.m3u8'] },
  { id: 59, name: 'Disney XD',          category: 'Family',        logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_DISNEY_XD/index.m3u8'] },
  { id: 60, name: 'HBO',                category: 'Movies',        logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_HBO/index.m3u8', 'http://23.237.104.106:8080/USA_HBO2/index.m3u8'] },
  { id: 61, name: 'CMT',                category: 'Entertainment', logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_CMT/index.m3u8'] },
  { id: 62, name: 'LMN',                category: 'Movies',        logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_LMN/index.m3u8'] },
  { id: 63, name: 'Cooking Channel',    category: 'Cooking',       logo: null,                                                                                streams: ['http://23.237.104.106:8080/USA_COOKING/index.m3u8'] },
  { id: 64, name: 'Channel 4 UK',       category: 'Entertainment', logo: null,                                                                                streams: ['https://viamotionhsi.netplus.ch/live/eds/channel4/browser-HLS8/channel4.m3u8'] },
];

const categories = ['All', 'News', 'Movies', 'Series', 'Entertainment', 'Comedy', 'Sports', 'Business', 'Documentary', 'Nature', 'Travel', 'Cooking', 'Family', 'Science', 'Religious'];

const colorMap = {
  News: 'from-blue-700 to-blue-900', Movies: 'from-violet-700 to-purple-900', Series: 'from-amber-600 to-orange-700',
  Entertainment: 'from-pink-600 to-rose-700', Comedy: 'from-yellow-500 to-orange-500', Sports: 'from-green-600 to-emerald-700',
  Business: 'from-purple-600 to-indigo-700', Documentary: 'from-slate-600 to-slate-800', Nature: 'from-green-500 to-teal-600',
  Travel: 'from-sky-500 to-blue-600', Cooking: 'from-orange-500 to-amber-600', Family: 'from-pink-400 to-rose-500',
  Science: 'from-cyan-600 to-blue-700', Religious: 'from-indigo-800 to-blue-900', default: 'from-zinc-600 to-zinc-800'
};

const LiveTVSection = ({ accessStatus, onExpiredClick }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [streamIndex, setStreamIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const filtered = channels.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const loadChannel = (channel, sIdx = 0) => {
    if (accessStatus === 'expired') { onExpiredClick && onExpiredClick(); return; }
    setSelectedChannel(channel);
    setStreamIndex(sIdx);
    setError(false);
    setLoading(true);
  };

  const tryNextStream = () => {
    if (!selectedChannel) return;
    const next = streamIndex + 1;
    if (next < selectedChannel.streams.length) {
      setStreamIndex(next);
      setLoading(true);
      setError(false);
    } else {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    if (!selectedChannel || !videoRef.current) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    const video = videoRef.current;
    const url = selectedChannel.streams[streamIndex];
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { setLoading(false); video.play().catch(() => {}); });
      hls.on(Hls.Events.ERROR, (e, data) => { if (data.fatal) tryNextStream(); });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => { setLoading(false); video.play().catch(() => {}); });
      video.addEventListener('error', tryNextStream);
    } else {
      setLoading(false);
      setError(true);
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [selectedChannel, streamIndex]);

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2.5 rounded-xl">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Live TV</h2>
            <p className="text-gray-400 text-sm">{channels.length} channels from around the world</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold">LIVE</span>
          </div>
        </div>

        {selectedChannel && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
            <div className="relative aspect-video bg-black">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    {streamIndex > 0 && <p className="text-gray-400 text-xs">Trying backup stream {streamIndex + 1}...</p>}
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
                  <Tv className="w-12 h-12 text-gray-600" />
                  <p className="text-gray-400 text-sm">All streams unavailable. Try another channel.</p>
                </div>
              )}
              <video ref={videoRef} className="w-full h-full" controls playsInline />
            </div>
            <div className="px-5 py-3 flex items-center gap-3 border-t border-white/10">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorMap[selectedChannel.category] || colorMap.default} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                {selectedChannel.logo ? <img src={selectedChannel.logo} alt="" className="w-full h-full object-contain p-1" onError={e => e.target.style.display='none'} /> : <Tv className="w-4 h-4 text-white" />}
              </div>
              <div>
                <p className="text-white font-bold text-sm">CH {selectedChannel.id} - {selectedChannel.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{selectedChannel.category}</span>
                  <span className="text-gray-600 text-xs">|</span>
                  <Globe className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-400">{selectedChannel.streams.length} stream{selectedChannel.streams.length > 1 ? 's' : ''} available</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs font-bold">LIVE</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search channels..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500" />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => {
            const count = cat === 'All' ? channels.length : channels.filter(c => c.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'}`}>
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map(channel => (
            <button key={channel.id} onClick={() => loadChannel(channel)}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-200 text-left group ${selectedChannel?.id === channel.id ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-white/10 hover:border-white/30'}`}>
              <div className={`aspect-video bg-gradient-to-br ${colorMap[channel.category] || colorMap.default} flex items-center justify-center relative overflow-hidden`}>
                {channel.logo
                  ? <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain p-2" onError={e => e.target.style.display='none'} />
                  : <Tv className="w-7 h-7 text-white/70" />}
                <div className="absolute top-1 left-1 bg-black/70 rounded px-1.5 py-0.5">
                  <span className="text-white text-xs font-bold">CH {channel.id}</span>
                </div>
                {channel.streams.length > 1 && (
                  <div className="absolute top-1 right-1 bg-green-500/80 rounded px-1 py-0.5">
                    <span className="text-white text-xs">{channel.streams.length}</span>
                  </div>
                )}
                {selectedChannel?.id === channel.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 bg-red-500/90 rounded-full px-2 py-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-bold">LIVE</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2.5 bg-zinc-900">
                <p className="text-white text-xs font-semibold truncate">{channel.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{channel.category}</p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Tv className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No channels found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LiveTVSection;
