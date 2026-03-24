import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

// Replace with your actual WhatsApp number (no + or spaces)
const WHATSAPP_NUMBER = "27000000000"; // ← CHANGE THIS
const WHATSAPP_MESSAGE = "Hi! I'm interested in the familybingeTV free trial 📺";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      {showTooltip && !dismissed && (
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-bottom">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="text-gray-800 text-sm font-medium pr-4">👋 Start your 7-day free trial!</p>
          <p className="text-gray-500 text-xs mt-1">Chat with us on WhatsApp</p>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 shadow-sm" />
        </div>
      )}

      {/* Main button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-110 active:scale-95"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
        {/* Pulse ring */}
        <span className="absolute inline-flex w-14 h-14 rounded-full bg-green-400 opacity-30 animate-ping" />
      </a>
    </div>
  );
};

export default WhatsAppButton;