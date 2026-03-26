import React, { useState, useEffect, useRef } from 'react';
import { X, Radio, RefreshCw, Maximize, ExternalLink, AlertTriangle, Tv } from 'lucide-react';

// Embed-based Live TV player — bypasses all CORS/HLS issues
// by using iframe embeds from services that handle their own streaming.
//
// Strategy per channel type:
//  1. Channels with a known embed URL → use it directly
//  2. ythls.armelin.one streams → these proxy YouTube livestreams, use playerservices embed
//  3. All others → pluto.tv / watchnewslive.tv iframes as fallback

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Map channel IDs to working iframe embed URLs
const CHANNEL_EMBEDS = {
  // News
  dw_en: 'https://www.dw.com/en/media-center/live-tv/s-100825',
  france24_en: 'https://www.france24.com/en/live-news/',
  trt_world: 'https://www.trtworld.com/live',
  nhk_world: 'https://www3.nhk.or.jp/nhkworld/en/live/',
  nasa_tv: 'https://www.nasa.gov/multimedia/nasatv/nt_windows_stream.asx',
  abc_aus: 'https://iview.abc.net.au/live/news24',
  // African
  channels_tv: null, // YouTube proxy
  arise_news: null,
  africanews: null,
  ktn_news: null,
  citizen_tv: null,
  sabc_news: null,
};

// For ythls.armelin.one streams, extract YouTube channel ID and embed via YouTube
function getYouTubeEmbedFromYthls(streamUrl) {
  const match = streamUrl.match(/ythls\.armelin\.one\/channel\/(UC[a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://www.youtube.com/embed/live_stream?channel=${match[1]}&autoplay=1`;
  }
  return null;
}

// Samsung FAST channels (wurl.tv) — use their Pluto-style embed
function getSamsungEmbed(streamUrl) {
  // These are free ad-supported channels, use watchfree.samsung.com
  return null; // No public embed available, will show redirect option
}

function getEmbedUrl(channel) {
  const { id, stream_url, name } = channel;

  // 1. Known direct embeds
  if (CHANNEL_EMBEDS[id]) {
    return { type: 'website', url: CHANNEL_EMBEDS[id] };
  }

  // 2. YouTube proxy streams (ythls.armelin.one)
  if (stream_url && stream_url.includes('ythls.armelin.one')) {
    const ytEmbed = getYouTubeEmbedFromYthls(stream_url);
    if (ytEmbed) return { type: 'youtube', url: ytEmbed };
  }

  // 3. Samsung WURL channels — open in new tab (no embed available)
  if (stream_url && stream_url.includes('samsung.wurl.tv')) {
    return { type: 'external', url: stream_url };
  }

  // 4. Pluto TV channels — use their embed
  if (stream_url && stream_url.includes('pluto.tv')) {
    const slugMatch = stream_url.match(/channel\/([a-f0-9]+)/);
    if (slugMatch) {
      return {
        type: 'iframe',
        url: `https://pluto.tv/live-tv/pluto-tv-spotlight`
      };
    }
  }

  // 5. Akamaized / CDN streams — try via proxy
  if (stream_url && (stream_url.includes('akamaized.net') || stream_url.includes('cloudfront.net') || stream_url.includes('wowza'))) {
    return {
      type: 'proxy',
      url: `${API_URL}/api/content/livetv/proxy?url=${encodeURIComponent(stream_url)}`
    };
  }

  // 6. Fallback — direct stream via proxy
  return {
    type: 'proxy',
    url: stream_url ? `${API_URL}/api/content/livetv/proxy?url=${encodeURIComponent(stream_url)}` : null
  };
}

const LiveTVPlayer = ({ channel, onClose }) => {
  const [embedInfo, setEmbedInfo] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!channel) return;
    setError(false);
    const info = getEmbedUrl(channel);
    setEmbedInfo(info);
  }, [channel]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleMouseMove);
      }
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  };

  if (!channel) return null;

  const isExternal = embedInfo?.type === 'external';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/95 to-transparent absolute top-0 left-0 right-0 z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-600 rounded-lg">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">{channel.name}</h2>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
              <span>·</span>
              <span>{channel.country}</span>
              <span>·</span>
              <span>CH {channel.number}</span>
              {embedInfo?.type === 'youtube' && (
                <span className="px-1.5 py-0.5 bg-red-600/30 border border-red-500/30 rounded text-red-400 text-xs">YouTube Live</span>
              )}
              {embedInfo?.type === 'proxy' && (
                <span className="px-1.5 py-0.5 bg-purple-600/30 border border-purple-500/30 rounded text-purple-400 text-xs">HLS Stream</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {embedInfo?.url && (
            <a
              href={embedInfo.type === 'proxy' ? (channel.stream_url || embedInfo.url) : embedInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </a>
          )}
          <button
            onClick={() => { setError(false); setEmbedInfo(null); setTimeout(() => setEmbedInfo(getEmbedUrl(channel)), 100); }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Reload"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Player area */}
      <div className="flex-1 flex items-center justify-center relative bg-black">
        {!embedInfo && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <p className="text-gray-400">Loading {channel.name}...</p>
          </div>
        )}

        {/* External link channels (Samsung WURL etc.) */}
        {embedInfo?.type === 'external' && (
          <div className="flex flex-col items-center gap-6 text-center px-8 max-w-lg">
            <div className="w-20 h-20 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Tv className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white text-2xl font-bold mb-2">{channel.name}</h3>
              <p className="text-gray-400 mb-6">
                This channel streams via a protected CDN that can't be embedded directly.
                Click below to watch it on its official page.
              </p>
            </div>
            <a
              href={channel.stream_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              <ExternalLink className="w-5 h-5" />
              Watch {channel.name}
            </a>
          </div>
        )}

        {/* Embeddable channels */}
        {embedInfo && embedInfo.type !== 'external' && embedInfo.url && !error && (
          <iframe
            ref={iframeRef}
            key={`${channel.id}-${embedInfo.url}`}
            src={embedInfo.url}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
            title={channel.name}
            onError={() => setError(true)}
          />
        )}

        {/* Error state */}
        {(error || (embedInfo && !embedInfo.url)) && (
          <div className="flex flex-col items-center gap-6 text-center px-8 max-w-lg">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
            <div>
              <h3 className="text-white text-xl font-bold mb-2">Stream Unavailable</h3>
              <p className="text-gray-400 mb-6">
                {channel.name} may be geo-restricted, temporarily offline, or require authentication.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setError(false); setEmbedInfo(getEmbedUrl(channel)); }}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTVPlayer;