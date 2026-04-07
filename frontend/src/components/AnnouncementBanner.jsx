import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ANNOUNCEMENT_KEY = "announcement_v1_dismissed";
const MESSAGE = "";

const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (dismissed) return;

    const checkTime = () => {
      const now = new Date();
      // Georgia time is UTC+4
      const georgiaHour = (now.getUTCHours() + 4) % 24;
      if (georgiaHour >= 1) {
        setVisible(true);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Message from Family Binge</span>
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-200 text-sm leading-relaxed mb-6">{MESSAGE}</p>
        <button
          onClick={handleDismiss}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors"
        >
          Got it, thanks! ??
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
