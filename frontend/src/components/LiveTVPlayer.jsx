import React, { useEffect, useRef } from 'react';
import { X, Radio, Maximize } from 'lucide-react';
import Hls from 'hls.js';

const LiveTVPlayer = ({ channel, onClose }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!channel?.stream_url || !videoRef.current) return;

    const video = videoRef.current;
    const url = channel.stream_url;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(console.error);
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [channel]);

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-red-500" />
          <div>
            <h2 className="text-white font-semibold">{channel.name}</h2>
            <p className="text-gray-400 text-xs">CH {channel.number} • LIVE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg">
            <Maximize className="w-4 h-4 text-white" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-red-500 rounded-lg">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black p-4">
        <video
          ref={videoRef}
          className="max-w-full max-h-full rounded-xl"
          controls
          autoPlay
          playsInline
        />
      </div>

      <div className="text-center py-2 text-xs text-gray-400 bg-black/80">
        {channel.name} • {channel.country || 'Live TV'}
      </div>
    </div>
  );
};

export default LiveTVPlayer;
