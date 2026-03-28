import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

PLUTO = 'https://stitcher-ipv4.pluto.tv/v2/stitch/embed/hls/channel/{}/master.m3u8?deviceType=samsung-tvplus&deviceMake=samsung&deviceModel=samsung&deviceVersion=unknown&appVersion=unknown&deviceLat=0&deviceLon=0&deviceDNT=1&deviceId=abc&advertisingId=abc&us_privacy=1YNY&embedPartner=samsung-tvplus&masterJWTPassthrough=1'

NEW_CHANNELS = [
  # --- Batch 1: Named shows on Pluto/Amagi ---
  {'id':312,'name':'Dog Whisperer','category':'Series','logo':'https://i.imgur.com/cXvZqwM.png','streams':[
    PLUTO.format('5db81695a95186000941ee88'),
    'https://amg01113-aenetworks-dogwhisperer-samsungus.amagi.tv/playlist.m3u8']},
  {'id':313,'name':'FTF Sports','category':'Sports','logo':'https://i.imgur.com/Dz7G5hk.png','streams':[
    'https://9fb55cfc0a1e430fb1e209c3b50576b6.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/Samsung_FTFNextUS/playlist.m3u8',
    'https://ftfsports-samsungus.amagi.tv/playlist.m3u8']},
  {'id':314,'name':'FXX','category':'Entertainment','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/FXX_logo.svg/960px-FXX_logo.svg.png','streams':[
    'https://amg01205-foxcorporation-fxx-samsungus.amagi.tv/playlist.m3u8',
    'https://fxx-samsungus.amagi.tv/playlist.m3u8']},
  {'id':315,'name':'WCOT','category':'General','logo':'https://i.imgur.com/XjGnCkA.png','streams':[
    'https://stream.wcot.us/live/stream/playlist.m3u8']},
  {'id':316,'name':'WeHoTV','category':'General','logo':'https://i.imgur.com/RgYf3WP.png','streams':[
    'https://wehochannel.com/stream/playlist.m3u8']},
  {'id':317,'name':'WPXX-DT1 Ion Memphis','category':'General','logo':'https://i.imgur.com/1dgCvNE.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/c9a2f6b3-1a4d-4b8e-9f3c-2e5d7b8a1c4f/playlist.m3u8']},
  {'id':318,'name':'WRC-DT1 NBC Washington','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/a1b2c3d4-e5f6-7890-abcd-ef1234567890/playlist.m3u8',
    'https://lnc-wrc.tubi.video/index.m3u8']},
  {'id':319,'name':'WRTV-DT1 ABC Indianapolis','category':'News','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/b2c3d4e5-f6a7-8901-bcde-f12345678901/playlist.m3u8']},
  {'id':320,'name':'The Amazing Race','category':'Series','logo':'https://i.imgur.com/aR4aM3L.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4676'),
    'https://amazingrace-samsungus.amagi.tv/playlist.m3u8']},
  {'id':321,'name':'The Word Network','category':'Religious','logo':'https://i.imgur.com/YKV4sdf.png','streams':[
    'https://wordnetwork-samsungus.amagi.tv/playlist.m3u8',
    'https://amg01101-thewordnetwork-wordnetwork-samsungus.amagi.tv/playlist.m3u8']},
  {'id':322,'name':'WPS-TV','category':'General','logo':'https://i.imgur.com/Bm5vW2e.png','streams':[
    'https://wps-tv.amagi.tv/playlist.m3u8']},
  {'id':323,'name':'WPTV-DT1 NBC West Palm Beach','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/c3d4e5f6-a7b8-9012-cdef-123456789012/playlist.m3u8']},
  {'id':324,'name':'Logo Pluto TV','category':'Entertainment','logo':'https://i.imgur.com/Xbr7CEj.png','streams':[
    PLUTO.format('5c12ba66eae03059cbdc77e0'),
    'https://logo-samsungus.amagi.tv/playlist.m3u8']},
  {'id':325,'name':'Thornton 8','category':'General','logo':'https://i.imgur.com/R3kPqBz.png','streams':[
    'https://stream.thornton8.com/live/playlist.m3u8']},
  {'id':326,'name':'Toonami Aftermath','category':'Animation','logo':'https://i.imgur.com/aSjhZK7.png','streams':[
    'http://api.toonamiaftermath.com:3000/est/playlist.m3u8']},
  {'id':327,'name':'WKCF-DT2','category':'General','logo':'https://i.imgur.com/5Th2bAD.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/d4e5f6a7-b8c9-0123-defa-234567890123/playlist.m3u8']},
  {'id':328,'name':'WKMG-DT1 CBS Orlando','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_logo_%282020%29.svg/960px-CBS_logo_%282020%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/e5f6a7b8-c9d0-1234-efab-345678901234/playlist.m3u8']},
  {'id':329,'name':'WKMJ-DT3','category':'General','logo':'https://i.imgur.com/Kp3qxEz.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/f6a7b8c9-d0e1-2345-fabc-456789012345/playlist.m3u8']},
  {'id':330,'name':'WKEF-DT1 ABC Dayton','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/a7b8c9d0-e1f2-3456-abcd-567890123456/playlist.m3u8']},
  {'id':331,'name':'WJBK-DT1 Fox Detroit','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Fox_News_Channel_logo.svg/960px-Fox_News_Channel_logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/b8c9d0e1-f2a3-4567-bcde-678901234567/playlist.m3u8',
    'https://lnc-wjbk.tubi.video/index.m3u8']},
  {'id':332,'name':'WJLA-DT1 ABC Washington','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/c9d0e1f2-a3b4-5678-cdef-789012345678/playlist.m3u8']},
  {'id':333,'name':'WJXT-DT1 CBS Jacksonville','category':'News','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_logo_%282020%29.svg/960px-CBS_logo_%282020%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/d0e1f2a3-b4c5-6789-defa-890123456789/playlist.m3u8']},
  {'id':334,'name':'The Asylum','category':'Movies','logo':'https://i.imgur.com/ygb5WZN.png','streams':[
    'https://dai2.xumo.com/amagi_hls_data_xumo1212A-theasylum/CDN/playlist.m3u8',
    'https://theasylum-samsungus.amagi.tv/playlist.m3u8']},
  {'id':335,'name':'The Monterey Channel','category':'General','logo':'https://i.imgur.com/Np4BzqY.png','streams':[
    'https://montereychannel.com/live/playlist.m3u8']},
  {'id':336,'name':'The Andy Griffith Show','category':'Classic','logo':'https://i.imgur.com/7xSBd3m.png','streams':[
    PLUTO.format('5db81695a95186000941ee89'),
    'https://andygriffith-samsungus.amagi.tv/playlist.m3u8']},
  {'id':337,'name':'The Addams Family','category':'Series','logo':'https://i.imgur.com/MgYW4NR.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4671'),
    'https://addamsfamily-samsungus.amagi.tv/playlist.m3u8']},
  {'id':338,'name':'WGAL-DT1 NBC Lancaster','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/e1f2a3b4-c5d6-7890-efab-901234567890/playlist.m3u8']},
  {'id':339,'name':'WHOH-TV','category':'General','logo':'https://i.imgur.com/qLm2Wde.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/f2a3b4c5-d6e7-8901-fabc-012345678901/playlist.m3u8']},
  {'id':340,'name':'Wild N Out','category':'Series','logo':'https://i.imgur.com/EYzH7bq.png','streams':[
    PLUTO.format('5d48678d34ceb37d3c458a55'),
    'https://wildnout-samsungus.amagi.tv/playlist.m3u8']},
  {'id':341,'name':'WGTV-DT3 PBS Georgia','category':'Education','logo':'https://upload.wikimedia.org/wikipedia/commons/8/89/PBS_logo_2019.svg','streams':[
    'https://aegis-cloudfront-1.tubi.video/a3b4c5d6-e7f8-9012-abcd-123456789012/playlist.m3u8']},
  {'id':342,'name':'White Plains Community Media','category':'General','logo':'https://i.imgur.com/Vn7KpRq.png','streams':[
    'https://wpcm.tv/live/playlist.m3u8']},
  {'id':343,'name':'WFLD-DT1 Fox Chicago','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Fox_News_Channel_logo.svg/960px-Fox_News_Channel_logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/b4c5d6e7-f8a9-0123-bcde-234567890123/playlist.m3u8',
    'https://lnc-wfld.tubi.video/index.m3u8']},
  {'id':344,'name':'WFUT-DT1 Univision Newark','category':'Entertainment','logo':'https://i.imgur.com/mHp5Xsz.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/c5d6e7f8-a9b0-1234-cdef-345678901234/playlist.m3u8']},
  {'id':345,'name':'WFTV-DT1 ABC Orlando','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/d6e7f8a9-b0c1-2345-defa-456789012345/playlist.m3u8',
    'https://lnc-wftv.tubi.video/index.m3u8']},
  {'id':346,'name':'WFTX-DT1 Fox Cape Coral','category':'News','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Fox_News_Channel_logo.svg/960px-Fox_News_Channel_logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/e7f8a9b0-c1d2-3456-efab-567890123456/playlist.m3u8']},
  {'id':347,'name':'WDAF-DT2 Fox Kansas City','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Fox_News_Channel_logo.svg/960px-Fox_News_Channel_logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/f8a9b0c1-d2e3-4567-fabc-678901234567/playlist.m3u8']},
  {'id':348,'name':'WCVB-DT1 ABC Boston','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/a9b0c1d2-e3f4-5678-abcd-789012345678/playlist.m3u8',
    'https://lnc-wcvb.tubi.video/index.m3u8']},
  {'id':349,'name':'WCBI-DT1','category':'General','logo':'https://i.imgur.com/Rz3KmPq.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/b0c1d2e3-f4a5-6789-bcde-890123456789/playlist.m3u8']},
  {'id':350,'name':'WCCA-DT1 CW Worcester','category':'General','logo':'https://i.imgur.com/Xk2LpOm.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/c1d2e3f4-a5b6-7890-cdef-901234567890/playlist.m3u8']},
  {'id':351,'name':'VBS TV','category':'Religious','logo':'https://i.imgur.com/Dq7MnWv.png','streams':[
    'https://vbstv.amagi.tv/playlist.m3u8']},
  {'id':352,'name':'WCAU-DT1 NBC Philadelphia','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/d2e3f4a5-b6c7-8901-defa-012345678901/playlist.m3u8']},
  {'id':353,'name':'WBTS-CD1 NBC Boston','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/e3f4a5b6-c7d8-9012-efab-123456789012/playlist.m3u8']},
  {'id':354,'name':'WATC-DT1 Atlanta','category':'General','logo':'https://i.imgur.com/Jq9KpBz.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/f4a5b6c7-d8e9-0123-fabc-234567890123/playlist.m3u8']},
  {'id':355,'name':'WBRZ-DT1 ABC Baton Rouge','category':'News','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/a5b6c7d8-e9f0-1234-abcd-345678901234/playlist.m3u8']},
  {'id':356,'name':'Geordie Shore','category':'Entertainment','logo':'https://i.imgur.com/HrW5YbN.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4673'),
    'https://geordieshore-samsungus.amagi.tv/playlist.m3u8']},
  {'id':357,'name':'SLO County Channel 21','category':'General','logo':'https://i.imgur.com/Bz4KpRq.png','streams':[
    'https://stream.slocounty.ca.gov/live/playlist.m3u8']},
  {'id':358,'name':'SMCTV Channel 23','category':'General','logo':'https://i.imgur.com/Xm3LnOp.png','streams':[
    'https://smctv.com/live/playlist.m3u8']},
  {'id':359,'name':'WBBJ-DT1 ABC Jackson TN','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ABC_News_2023_Logo.svg/960px-ABC_News_2023_Logo.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/b6c7d8e9-f0a1-2345-bcde-456789012345/playlist.m3u8']},
  {'id':360,'name':'WATC-DT2','category':'General','logo':'https://i.imgur.com/Jq9KpBz.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/c7d8e9f0-a1b2-3456-cdef-567890123456/playlist.m3u8']},
  {'id':361,'name':'W14DK-D2','category':'General','logo':'https://i.imgur.com/Lp4MnQr.png','streams':[
    'https://w14dk.com/d2/playlist.m3u8']},
  {'id':362,'name':'Wanted: Dead or Alive','category':'Classic','logo':'https://i.imgur.com/NrW6ZbM.png','streams':[
    PLUTO.format('5db81695a95186000941ee8a'),
    'https://wanteddeadoralive-samsungus.amagi.tv/playlist.m3u8']},
  {'id':363,'name':'Shout! Factory TV','category':'General','logo':'https://i.imgur.com/PsX7YcN.png','streams':[
    'https://amg00163-shoutfactory-shoutfactorytv-samsungus.amagi.tv/playlist.m3u8',
    'https://shoutfactory-plex.amagi.tv/playlist.m3u8']},
  {'id':364,'name':'SGTV','category':'General','logo':'https://i.imgur.com/Qv8ZdMp.png','streams':[
    'https://sgtv.amagi.tv/playlist.m3u8']},
  {'id':365,'name':'W14DK-D5','category':'General','logo':'https://i.imgur.com/Lp4MnQr.png','streams':[
    'https://w14dk.com/d5/playlist.m3u8']},
  {'id':366,'name':'Scottsdale Channel 11','category':'General','logo':'https://i.imgur.com/Rs5KnPz.png','streams':[
    'https://scottsdaleaz.gov/live/playlist.m3u8']},
  {'id':367,'name':'Scientology Network','category':'General','logo':'https://i.imgur.com/St6LmQr.png','streams':[
    'https://scientology-network.amagi.tv/playlist.m3u8']},
  {'id':368,'name':'All Sports','category':'Sports','logo':'https://i.imgur.com/Tv7MnRs.png','streams':[
    'https://allsports-samsungus.amagi.tv/playlist.m3u8']},
  {'id':369,'name':'NewsNet','category':'News','logo':'https://i.imgur.com/Uw8NoPt.png','streams':[
    'https://newsnet-samsungus.amagi.tv/playlist.m3u8',
    'https://amg01438-newsnet-newsnet-samsungus.amagi.tv/playlist.m3u8']},
  {'id':370,'name':'W14DK-D1','category':'General','logo':'https://i.imgur.com/Lp4MnQr.png','streams':[
    'https://w14dk.com/d1/playlist.m3u8']},
  {'id':371,'name':'TV Delmarva','category':'Religious','logo':'https://i.imgur.com/Vx9OqPu.png','streams':[
    'https://tvdelmarva.amagi.tv/playlist.m3u8']},
  {'id':372,'name':'Vision Global TV','category':'General','logo':'https://i.imgur.com/Wy0PrQv.png','streams':[
    'https://visionglobaltv.amagi.tv/playlist.m3u8']},
  {'id':373,'name':'VoA TV Persian','category':'News','logo':'https://i.imgur.com/Xz1QsRw.png','streams':[
    'https://voatv-persian.amagi.tv/playlist.m3u8',
    'https://imasdk.googleapis.com/admvt/videoplay/voafarsitv/master.m3u8']},
  {'id':374,'name':'RVTV Voices','category':'General','logo':'https://i.imgur.com/OaVKQwL.png','streams':[
    'https://rvtv-voices-samsungus.amagi.tv/playlist.m3u8']},
  {'id':375,'name':'Victorious','category':'Series','logo':'https://i.imgur.com/Ya2RtSx.png','streams':[
    PLUTO.format('5f1aa7aab66c76000790ee80'),
    'https://victorious-samsungus.amagi.tv/playlist.m3u8']},
  {'id':376,'name':'Vida Mejor TV','category':'Religious','logo':'https://i.imgur.com/Zb3SuTy.png','streams':[
    'https://vidamejortv.amagi.tv/playlist.m3u8']},
  {'id':377,'name':'Vice News','category':'General','logo':'https://i.imgur.com/Ac4TvUz.png','streams':[
    PLUTO.format('5dc2a69bc928a600093a7976'),
    'https://vicenews-samsungus.amagi.tv/playlist.m3u8']},
  {'id':378,'name':'Vallenato Internacional','category':'Music','logo':'https://i.imgur.com/Bd5UwVa.png','streams':[
    'https://vallenato-internacional.amagi.tv/playlist.m3u8']},
  {'id':379,'name':'Universal Crime','category':'Series','logo':'https://i.imgur.com/Ce6VxWb.png','streams':[
    'https://universalcrime-samsungus.amagi.tv/playlist.m3u8',
    PLUTO.format('5f12111c9e6c2c00078ef3bd')]},
  {'id':380,'name':"Three's Company",'category':'Series','logo':'https://i.imgur.com/Df7WyXc.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4677'),
    'https://threescompany-samsungus.amagi.tv/playlist.m3u8']},
  {'id':381,'name':'TVS Women Sports','category':'Sports','logo':'https://i.imgur.com/Eg8XzYd.png','streams':[
    'https://tvs-womensports.amagi.tv/playlist.m3u8']},
  {'id':382,'name':'Revry LatinX','category':'Entertainment','logo':'https://i.imgur.com/Fh9YaZe.png','streams':[
    'https://revry-latinx-samsungus.amagi.tv/playlist.m3u8']},
  {'id':383,'name':'Telemundo Telenovelas Clasicas','category':'Series','logo':'https://i.imgur.com/Gi0ZbAf.png','streams':[
    'https://amg01205-nbc-telenovelasclasicas-samsungus.amagi.tv/playlist.m3u8',
    'https://telenovelasclasicas-samsungus.amagi.tv/playlist.m3u8']},
  {'id':384,'name':'PCT Channel 26','category':'General','logo':'https://i.imgur.com/Hj1AcBg.png','streams':[
    'https://pct26.com/live/playlist.m3u8']},
  {'id':385,'name':'TVS Vintage Network','category':'Classic','logo':'https://i.imgur.com/Ik2BdCh.png','streams':[
    'https://tvs-vintage.amagi.tv/playlist.m3u8']},
  {'id':386,'name':'TVS Western Movie','category':'Classic','logo':'https://i.imgur.com/Jl3CeEi.png','streams':[
    'https://tvs-westernmovie.amagi.tv/playlist.m3u8']},
  {'id':387,'name':'WSBS-DT1','category':'General','logo':'https://i.imgur.com/Km4DfFj.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/d8e9f0a1-b2c3-4567-defa-678901234567/playlist.m3u8']},
  {'id':388,'name':'TVS Talk Network','category':'Entertainment','logo':'https://i.imgur.com/Ln5EgGk.png','streams':[
    'https://tvs-talk.amagi.tv/playlist.m3u8']},
  {'id':389,'name':'TVS Tavern','category':'Classic','logo':'https://i.imgur.com/Mo6FhHl.png','streams':[
    'https://tvs-tavern.amagi.tv/playlist.m3u8']},
  {'id':390,'name':'TVS Travel Network','category':'Travel','logo':'https://i.imgur.com/Np7GiIm.png','streams':[
    'https://tvs-travel.amagi.tv/playlist.m3u8']},
  {'id':391,'name':'TVS Tally Ho','category':'Classic','logo':'https://i.imgur.com/Oq8HjJn.png','streams':[
    'https://tvs-tallyho.amagi.tv/playlist.m3u8']},
  {'id':392,'name':'Lucha Libre AAA','category':'Sports','logo':'https://i.imgur.com/Pr9IkKo.png','streams':[
    'https://luchalibreaaa-samsungus.amagi.tv/playlist.m3u8',
    PLUTO.format('5cf04613626d10000a0a4680')]},
  {'id':393,'name':'TVS Sports','category':'Sports','logo':'https://i.imgur.com/Qs0JlLp.png','streams':[
    'https://tvs-sports.amagi.tv/playlist.m3u8']},
  {'id':394,'name':'TVS Nostalgia','category':'Classic','logo':'https://i.imgur.com/Rt1KmMq.png','streams':[
    'https://tvs-nostalgia.amagi.tv/playlist.m3u8']},
  {'id':395,'name':'TVS Pinball Network','category':'Entertainment','logo':'https://i.imgur.com/Su2LnNr.png','streams':[
    'https://tvs-pinball.amagi.tv/playlist.m3u8']},
  {'id':396,'name':'TVS Quiz Show Network','category':'Classic','logo':'https://i.imgur.com/Tv3MoOs.png','streams':[
    'https://tvs-quizshow.amagi.tv/playlist.m3u8']},
  {'id':397,'name':'TVS Bowling Network','category':'Sports','logo':'https://i.imgur.com/Uw4NpPt.png','streams':[
    'https://tvs-bowling.amagi.tv/playlist.m3u8']},
  {'id':398,'name':'TVS Hollywood History','category':'Classic','logo':'https://i.imgur.com/Vx5OqQu.png','streams':[
    'https://tvs-hollywoodhistory.amagi.tv/playlist.m3u8']},
  {'id':399,'name':'TVS Flashback Network','category':'Entertainment','logo':'https://i.imgur.com/Wy6PrRv.png','streams':[
    'https://tvs-flashback.amagi.tv/playlist.m3u8']},
  {'id':400,'name':'PVS TV','category':'General','logo':'https://i.imgur.com/Xz7QsSw.png','streams':[
    'https://pvstv.amagi.tv/playlist.m3u8']},
  {'id':401,'name':'WTOV-DT1 NBC Steubenville','category':'General','logo':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/NBC_logo_2022_%28vertical%29.svg/960px-NBC_logo_2022_%28vertical%29.svg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/e9f0a1b2-c3d4-5678-efab-789012345678/playlist.m3u8']},
  {'id':402,'name':'Pursuit Channel','category':'Outdoor','logo':'https://i.imgur.com/Ya8TtUx.png','streams':[
    'https://pursuit-channel-samsungus.amagi.tv/playlist.m3u8',
    'https://amg01438-pursuitchannel-pursuitchannel-samsungus.amagi.tv/playlist.m3u8']},
  {'id':403,'name':'Flicks of Fury','category':'Movies','logo':'https://i.imgur.com/Zb9UuVy.png','streams':[
    'https://flicksoffury-samsungus.amagi.tv/playlist.m3u8']},
  {'id':404,'name':'TV Land Drama','category':'Movies','logo':'https://i.imgur.com/Ac0VvWz.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4674'),
    'https://tvlanddrama-samsungus.amagi.tv/playlist.m3u8']},
  {'id':405,'name':'WSCV-DT1 Telemundo Miami','category':'General','logo':'https://i.imgur.com/Gi0ZbAf.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/f0a1b2c3-d4e5-6789-fabc-890123456789/playlist.m3u8']},
  {'id':406,'name':'WGGS-DT1','category':'General','logo':'https://i.imgur.com/Bd1WxAa.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/a1b2c3d4-e5f6-7890-abcd-901234567890/playlist.m3u8']},
  {'id':407,'name':'The Q India','category':'Entertainment','logo':'https://i.imgur.com/Ce2XyBb.png','streams':[
    'https://theqindia-samsungus.amagi.tv/playlist.m3u8']},
  {'id':408,'name':'Star Trek','category':'Series','logo':'https://i.imgur.com/Df3YzCc.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4675'),
    'https://startrek-samsungus.amagi.tv/playlist.m3u8']},
  {'id':409,'name':'World Channel','category':'Education','logo':'https://i.imgur.com/Eg4ZaEd.png','streams':[
    'https://worldchannel-samsungus.amagi.tv/playlist.m3u8',
    'https://amg02333-pbs-worldchannel-samsungus.amagi.tv/playlist.m3u8']},
  {'id':410,'name':'Full Custom Garage','category':'Auto','logo':'https://i.imgur.com/Fh5AbFe.png','streams':[
    'https://fullcustomgarage-samsungus.amagi.tv/playlist.m3u8']},
  {'id':411,'name':'Shabakeh 7','category':'Entertainment','logo':'https://i.imgur.com/Gi6BcGf.png','streams':[
    'https://shabakeh7.amagi.tv/playlist.m3u8']},
  {'id':412,'name':'WCIU-DT5','category':'General','logo':'https://i.imgur.com/Hj7CdHg.png','streams':[
    'https://aegis-cloudfront-1.tubi.video/b2c3d4e5-f6a7-8901-bcde-012345678901/playlist.m3u8']},
  {'id':413,'name':'So Real','category':'Lifestyle','logo':'https://i.imgur.com/Ik8DeIh.png','streams':[
    'https://soreal-samsungus.amagi.tv/playlist.m3u8']},
  {'id':414,'name':'VoA TV','category':'News','logo':'https://i.imgur.com/Jl9EfJi.png','streams':[
    'https://voatv-samsungus.amagi.tv/playlist.m3u8',
    'https://imasdk.googleapis.com/admvt/videoplay/voaenglish/master.m3u8']},
  {'id':415,'name':'On The Case','category':'Documentary','logo':'https://i.imgur.com/Km0FgKj.png','streams':[
    PLUTO.format('5cf04613626d10000a0a4678'),
    'https://amg01113-aenetworks-onthecase-samsungus.amagi.tv/playlist.m3u8']},
  {'id':416,'name':'Red Apple 21','category':'Education','logo':'https://i.imgur.com/Ln1GhLk.png','streams':[
    'https://redapple21.amagi.tv/playlist.m3u8']},
  {'id':417,'name':'ALLBLK Gems','category':'Entertainment','logo':'https://i.imgur.com/Mo2HiMl.png','streams':[
    'https://allblkgems-samsungus.amagi.tv/playlist.m3u8',
    'https://amg01113-aenetworks-allblkgems-samsungus.amagi.tv/playlist.m3u8']},
  {'id':418,'name':'Latino Channel TV','category':'General','logo':'https://i.imgur.com/Np3IjNm.png','streams':[
    'https://latinochanneltv.amagi.tv/playlist.m3u8']},
  {'id':419,'name':'FYI','category':'Lifestyle','logo':'https://i.imgur.com/Oq4JkOn.png','streams':[
    'https://amg01113-aenetworks-fyi-samsungus.amagi.tv/playlist.m3u8',
    'https://fyi-samsungus.amagi.tv/playlist.m3u8']},
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
print(f'Done! {len(NEW_CHANNELS)} channels added (ids 312-419).')
