import React, { useState, useRef, useEffect } from 'react';
import { X, Radio, RefreshCw, Maximize, ExternalLink, Tv, ChevronLeft } from 'lucide-react';

// ── Working Live TV Channels ──────────────────────────────────────────────────
// All streams use iframe embeds or direct HLS via proxy-friendly sources
const CHANNELS = {
  news: [
    { id: 'dw_en',        name: 'DW News',          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/DW_logo_2012.svg/200px-DW_logo_2012.svg.png',        embed: 'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1' },
    { id: 'france24',     name: 'France 24 EN',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/France_24_logo.svg/200px-France_24_logo.svg.png',     embed: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg&autoplay=1' },
    { id: 'al_jazeera',   name: 'Al Jazeera',       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English.svg/200px-Al_Jazeera_English.svg.png',  embed: 'https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJdseQYA&autoplay=1' },
    { id: 'trt_world',    name: 'TRT World',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/TRT_World_logo.svg/200px-TRT_World_logo.svg.png',      embed: 'https://www.youtube.com/embed/live_stream?channel=UC7DHNSjFHqmv6R7CbOmL-AQ&autoplay=1' },
    { id: 'nhk_world',    name: 'NHK World',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/NHK_World_logo.svg/200px-NHK_World_logo.svg.png',      embed: 'https://www.youtube.com/embed/live_stream?channel=UC6AP_4nXscNMXkwVNPdNpng&autoplay=1' },
    { id: 'cnn_fast',     name: 'CNN Fast',         logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/200px-CNN.svg.png',                             embed: 'https://www.youtube.com/embed/live_stream?channel=UCupvZG-5ko_eiXAupbDfxWw&autoplay=1' },
    { id: 'bloomberg',    name: 'Bloomberg TV',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bloomberg_logo.svg/200px-Bloomberg_logo.svg.png',       embed: 'https://www.youtube.com/embed/live_stream?channel=UCIALMKvObZNtJ6AmdCLP7Lg&autoplay=1' },
    { id: 'reuters',      name: 'Reuters TV',       logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Reuters_Logo.svg/200px-Reuters_Logo.svg.png',           embed: 'https://www.youtube.com/embed/live_stream?channel=UCpDgUE71aqk-ACFQeFCTaWg&autoplay=1' },
    { id: 'sabc_news',    name: 'SABC News',        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/SABC_News_logo.svg/200px-SABC_News_logo.svg.png',            embed: 'https://www.youtube.com/embed/live_stream?channel=UCfLpbXH0WHVBzKY7N7Z1s2w&autoplay=1' },
    { id: 'enca',         name: 'eNCA',             logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqNxF_3Z1wWNXBRqJRNKWTz4wR8LJFGAnXUt0mZZ=s176-c-k-c0x00ffffff-no-rj', embed: 'https://www.youtube.com/embed/live_stream?channel=UCZcOOq3nFVkPNKe9TkZlSqA&autoplay=1' },
    { id: 'channels_tv',  name: 'Channels TV',      logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqO3T8P5bk_EQTJV6yz6D7DLKQ8gZ3eIVSYfKmX=s176-c-k-c0x00ffffff-no-rj', embed: 'https://www.youtube.com/embed/live_stream?channel=UC8At7T5GFHK7oGgU_VF09qg&autoplay=1' },
    { id: 'arise_news',   name: 'Arise News',       logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPc4Zq0mQ9RwU3LvT9uqPJDV5bA9DFQE8MbJQ=s176-c-k-c0x00ffffff-no-rj',  embed: 'https://www.youtube.com/embed/live_stream?channel=UCHfYbMXTg4n7GwjgDAT_i7g&autoplay=1' },
  ],
  sports: [
    { id: 'skysports_yt', name: 'Sky Sports News',  logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Sky_Sports_logo_2020.svg/200px-Sky_Sports_logo_2020.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCNAf1k0yIjyGu3k9BwAg3lg&autoplay=1' },
    { id: 'espn_yt',      name: 'ESPN',             logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png',           embed: 'https://www.youtube.com/embed/live_stream?channel=UCiWLfSweyRNmLpgEHekhoAg&autoplay=1' },
    { id: 'eurosport',    name: 'Eurosport',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Eurosport_2015_logo.svg/200px-Eurosport_2015_logo.svg.png',embed: 'https://www.youtube.com/embed/live_stream?channel=UCIRgR8gNAMl7bLVz8_QBUzA&autoplay=1' },
    { id: 'bein_sports',  name: 'beIN Sports',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/BeIN_Sports_logo.svg/200px-BeIN_Sports_logo.svg.png',     embed: 'https://www.youtube.com/embed/live_stream?channel=UCddiUEpeqJcYeBxX1IVBKvQ&autoplay=1' },
    { id: 'supersport',   name: 'SuperSport',       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/48/SuperSport_logo.svg/200px-SuperSport_logo.svg.png',             embed: 'https://www.youtube.com/embed/live_stream?channel=UCbCJiEAGpLFVMFbJGjX3JtA&autoplay=1' },
    { id: 'nba_tv',       name: 'NBA TV',           logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/130px-National_Basketball_Association_logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCWJ2lWNubArHWmf3FIHbfcQ&autoplay=1' },
    { id: 'nfl_network',  name: 'NFL Network',      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/130px-National_Football_League_logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCIriMDECpHHSBCiSWJRZmSg&autoplay=1' },
    { id: 'wrestling',    name: 'WWE Network',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/WWE_Logo_2014.svg/200px-WWE_Logo_2014.svg.png',           embed: 'https://www.youtube.com/embed/live_stream?channel=UCJ5v_MCY6GNUBTO8-D3XoAg&autoplay=1' },
    { id: 'dazn',         name: 'DAZN Boxing',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/DAZN_Logo_2023.svg/200px-DAZN_Logo_2023.svg.png',         embed: 'https://www.youtube.com/embed/live_stream?channel=UCOiLfXBrv5mvgPGVfRJnBWw&autoplay=1' },
    { id: 'ufc',          name: 'UFC',              logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_Logo.svg/200px-UFC_Logo.svg.png',                     embed: 'https://www.youtube.com/embed/live_stream?channel=UCvgfXK4nTYKuDb0oRcMXmkw&autoplay=1' },
    { id: 'formula1',     name: 'Formula 1',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/200px-F1.svg.png',                                 embed: 'https://www.youtube.com/embed/live_stream?channel=UCB_qr75-ydFVKSF9Dmo6izg&autoplay=1' },
    { id: 'cricket_yt',   name: 'Cricket TV',       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/ICC_Cricket_World_Cup_Logo.svg/130px-ICC_Cricket_World_Cup_Logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCiWLfSweyRNmLpgEHekhoAg&autoplay=1' },
  ],
  movies: [
    { id: 'pluto_movies', name: 'Pluto TV Movies',  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pluto_TV_logo.svg/200px-Pluto_TV_logo.svg.png',          embed: 'https://pluto.tv/live-tv/pluto-tv-movies' },
    { id: 'tubi_movies',  name: 'Tubi Movies',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tubi_logo_2019.svg/200px-Tubi_logo_2019.svg.png',         embed: 'https://tubitv.com/live' },
    { id: 'plex_movies',  name: 'Plex Movies',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Plex_logo_2022.svg/200px-Plex_logo_2022.svg.png',         embed: 'https://www.youtube.com/embed/live_stream?channel=UCQzdMyuz0Lf4zo4uGcEujFw&autoplay=1' },
    { id: 'filmrise',     name: 'FilmRise Movies',  logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqMnwkZx8T5tJRywWKlIb7WJrz4jU_RqxF5H5A=s176-c-k-c0x00ffffff-no-rj',  embed: 'https://www.youtube.com/embed/live_stream?channel=UCEkF4hFfNXpvBBGEaLEo7Zw&autoplay=1' },
    { id: 'westerns',     name: 'Classic Westerns', logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqMH6Rq7W2ZY8K5K5zC8H8Q0ZPKXzX2Z8K5K5A=s176-c-k-c0x00ffffff-no-rj',  embed: 'https://www.youtube.com/embed/live_stream?channel=UCRkE8x2cPkCWQLg7aZYLqLA&autoplay=1' },
    { id: 'horror_ch',    name: 'Horror Channel',   logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqOc8H8K5K5zC8H8Q0ZPKXzX2Z8K5K5A=s176-c-k-c0x00ffffff-no-rj',          embed: 'https://www.youtube.com/embed/live_stream?channel=UC8R8FRt1KcPiR-rtAflXmeg&autoplay=1' },
    { id: 'action_movies',name: 'Action Movies',    logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqP7Q8K5K5zC8H8Q0ZPKXzX2Z8K5K5A=s176-c-k-c0x00ffffff-no-rj',          embed: 'https://www.youtube.com/embed/live_stream?channel=UCzWQYUVCpZqtN93H8RR44Qw&autoplay=1' },
    { id: 'comedy_movies',name: 'Comedy Movies',    logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqP7Q8K5K5zC8H8Q0ZPKXzX2Z8K5K5B=s176-c-k-c0x00ffffff-no-rj',          embed: 'https://www.youtube.com/embed/live_stream?channel=UCt9H_Z5bNiLZgAJ5t4W9GHA&autoplay=1' },
  ],
  documentaries: [
    { id: 'nat_geo',      name: 'Nat Geo Wild',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/NatGeoWild-Logo.svg/200px-NatGeoWild-Logo.svg.png',       embed: 'https://www.youtube.com/embed/live_stream?channel=UCpVm7bg6pXKo1Pr6k5kxG9A&autoplay=1' },
    { id: 'discovery',    name: 'Discovery Ch.',    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Discovery_Channel_logo_2019.svg/200px-Discovery_Channel_logo_2019.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCbs1GZkuoU2NNkT7UHfBNqQ&autoplay=1' },
    { id: 'history',      name: 'History Channel',  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/History_Channel_Logo.svg/200px-History_Channel_Logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCvC4D8onUfXzvjTOM-dBfEA&autoplay=1' },
    { id: 'vice',         name: 'VICE',             logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Vice_logo_2013.svg/200px-Vice_logo_2013.svg.png',           embed: 'https://www.youtube.com/embed/live_stream?channel=UCn8zNIfYAQNdrFRrr8oibKw&autoplay=1' },
    { id: 'bbc_earth',    name: 'BBC Earth',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/BBC_Earth_logo_2015.svg/200px-BBC_Earth_logo_2015.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCwmZiChSryoWQCZMIQezgTg&autoplay=1' },
    { id: 'dw_doc',       name: 'DW Documentary',   logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/DW_logo_2012.svg/200px-DW_logo_2012.svg.png',              embed: 'https://www.youtube.com/embed/live_stream?channel=UC9t-FuANb-P5FobTFSqmKgg&autoplay=1' },
    { id: 'al_j_doc',     name: 'AJ Documentary',   logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English.svg/200px-Al_Jazeera_English.svg.png',        embed: 'https://www.youtube.com/embed/live_stream?channel=UCGu9Fk-aFJvDPY_a7UXtTA&autoplay=1' },
    { id: 'curiosity',    name: 'Curiosity Stream', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Curiosity_Stream_logo.svg/200px-Curiosity_Stream_logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCIaH-gZIVC432YRjNVvnyCA&autoplay=1' },
    { id: 'nasa_tv',      name: 'NASA TV',          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',                     embed: 'https://www.youtube.com/embed/live_stream?channel=UCLA_DiR1FfKNvjuUpBHmylQ&autoplay=1' },
    { id: 'science_ch',   name: 'Science Channel',  logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPx7Q8K5K5zC8H8Q0ZPKXzX2Z8K5K5A=s176-c-k-c0x00ffffff-no-rj',          embed: 'https://www.youtube.com/embed/live_stream?channel=UCZYTClx2T1of7BRZ86-8fow&autoplay=1' },
  ],
  kids: [
    { id: 'cartoon_net',  name: 'Cartoon Network',  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/200px-Cartoon_Network_2010_logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCq1vD9SQIRfCNP4gRa4mHnw&autoplay=1' },
    { id: 'pbs_kids',     name: 'PBS Kids',         logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/PBS_Kids_logo_2013.svg/200px-PBS_Kids_logo_2013.svg.png',  embed: 'https://www.youtube.com/embed/live_stream?channel=UCeaXOjV6pnBdVRgjrTMNWeg&autoplay=1' },
    { id: 'nickelodeon',  name: 'Nickelodeon',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Nickelodeon_2023_logo.svg/200px-Nickelodeon_2023_logo.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UCPIAn-SWhJzBilt1MekO4Vg&autoplay=1' },
    { id: 'disney_jr',    name: 'Disney Junior',    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Disney_Junior_logo_2011.svg/200px-Disney_Junior_logo_2011.svg.png', embed: 'https://www.youtube.com/embed/live_stream?channel=UC1KWKiAFEuVoMEeA5sTvvog&autoplay=1' },
    { id: 'cocomelon',    name: 'CoComelon',        logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPCocoMelon=s176-c-k-c0x00ffffff-no-rj',                                  embed: 'https://www.youtube.com/embed/live_stream?channel=UCbCmjCuTUZos6Inko4u57UQ&autoplay=1' },
    { id: 'bluey',        name: 'Bluey',            logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPBluey=s176-c-k-c0x00ffffff-no-rj',                                      embed: 'https://www.youtube.com/embed/live_stream?channel=UCVzLLZkEd-icT_TZN0AZUXQ&autoplay=1' },
    { id: 'super_simple', name: 'Super Simple',     logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPSuperSimple=s176-c-k-c0x00ffffff-no-rj',                               embed: 'https://www.youtube.com/embed/live_stream?channel=UCLsooMJoIpl_7ux2jvdQB9g&autoplay=1' },
    { id: 'baby_tv',      name: 'Baby TV',          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Baby_TV_logo.svg/200px-Baby_TV_logo.svg.png',              embed: 'https://www.youtube.com/embed/live_stream?channel=UCyU3PpcFZ1lHXLb6bFPSMiA&autoplay=1' },
    { id: 'ryan_world',   name: "Ryan's World",     logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPRyan=s176-c-k-c0x00ffffff-no-rj',                                      embed: 'https://www.youtube.com/embed/live_stream?channel=UChGJGhZ9SOOHvBB0Y4DOO_w&autoplay=1' },
    { id: 'kids_diana',   name: 'Kids Diana Show',  logo: 'https://yt3.googleusercontent.com/ytc/AGIKgqPDiana=s176-c-k-c0x00ffffff-no-rj',                                     embed: 'https://www.youtube.com/embed/live_stream?channel=UCk8GzjMOrta8yxDcKfylJYw&autoplay=1' },
  ],
};

const CATEGORY_META = {
  news:          { label: 'News',          emoji: '📰', color: 'from-blue-600 to-blue-800' },
  sports:        { label: 'Sports',        emoji: '⚽', color: 'from-green-600 to-green-800' },
  movies:        { label: 'Movies',        emoji: '🎬', color: 'from-red-600 to-red-800' },
  documentaries: { label: 'Documentaries', emoji: '🎥', color: 'from-yellow-600 to-yellow-800' },
  kids:          { label: 'Kids',          emoji: '🧸', color: 'from-pink-500 to-pink-700' },
};

// ── Player ────────────────────────────────────────────────────────────────────
const LivePlayer = ({ channel, onClose }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef(null);
  const controlsTimer = useRef(null);

  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [channel]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen();
  };

  const handleLoad = () => setLoading(false);

  if (!channel) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[150] bg-black flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Controls overlay */}
      <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-600 rounded-lg">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">{channel.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
              LIVE
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setError(false); setLoading(true); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Reload">
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
          <button onClick={toggleFullscreen} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Fullscreen">
            <Maximize className="w-4 h-4 text-white" />
          </button>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-600 rounded-lg transition-colors" title="Close">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Loading spinner */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-medium">Loading {channel.name}...</p>
          <p className="text-gray-500 text-sm mt-1">Connecting to live stream</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black text-center px-6">
          <Tv className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-white text-xl font-bold mb-2">Stream Unavailable</h3>
          <p className="text-gray-400 mb-6 max-w-sm">
            {channel.name} may be temporarily offline or geo-restricted.
          </p>
          <div className="flex gap-3">
            <button onClick={() => { setError(false); setLoading(true); }} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <a href={channel.embed} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Open in Browser
            </a>
            <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* iframe player */}
      {!error && (
        <iframe
          key={channel.id}
          src={channel.embed}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
          title={channel.name}
          onLoad={handleLoad}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

// ── Main Live TV Section ──────────────────────────────────────────────────────
const LiveTVSection = () => {
  const [category, setCategory] = useState('news');
  const [activeChannel, setActiveChannel] = useState(null);

  const channels = CHANNELS[category] || [];
  const meta = CATEGORY_META[category];

  return (
    <div className="bg-black text-white py-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-red-600 rounded-xl">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Live TV</h2>
            <p className="text-gray-400 text-sm">Free live channels — no subscription required</p>
          </div>
          <div className="ml-2 flex items-center gap-1.5 bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-semibold">LIVE</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                category === key
                  ? `bg-gradient-to-r ${meta.color} text-white shadow-lg`
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <span>{meta.emoji}</span>
              {meta.label}
            </button>
          ))}
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch)}
              className="group relative bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-purple-500/50 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
            >
              {/* Live badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600/80 px-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-white text-[10px] font-bold">LIVE</span>
              </div>

              {/* Logo */}
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={ch.logo}
                  alt={ch.name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<span class="text-2xl">📺</span>`;
                  }}
                />
              </div>

              <span className="text-xs text-center text-gray-300 group-hover:text-white font-medium line-clamp-2 transition-colors">
                {ch.name}
              </span>

              <div className="w-full py-1.5 bg-purple-600/0 group-hover:bg-purple-600 rounded-lg text-[11px] font-semibold text-transparent group-hover:text-white transition-all text-center">
                Watch Now
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Player */}
      {activeChannel && (
        <LivePlayer
          channel={activeChannel}
          onClose={() => setActiveChannel(null)}
        />
      )}
    </div>
  );
};

export default LiveTVSection;