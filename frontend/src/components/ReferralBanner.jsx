import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { X } from 'lucide-react';

const ReferralBanner = () => {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleShare = () => {
    const uid = auth.currentUser?.uid;
    const link = uid ? window.location.origin + '/?ref=' + uid : window.location.origin;
    if (navigator.share) {
      navigator.share({ title: 'Family Binge', text: 'Watch unlimited movies and TV! Sign up free:', url: link });
    } else {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-900/90 to-pink-900/90 border-b border-purple-500/20 px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-white text-sm font-medium flex-1">
        <span className="text-purple-300 font-bold">Refer a friend</span> - earn <span className="text-green-400 font-bold">R5 off</span> your next subscription for every friend who subscribes. Stacks up!
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleShare}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
        >
          {copied ? 'Copied!' : 'Share & Earn'}
        </button>
        <button onClick={() => setDismissed(true)} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReferralBanner;
