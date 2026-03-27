import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { auth } from '../services/firebase';

const InviteSection = ({ compact = false }) => {
  const [copied, setCopied] = useState(false);

  const userId = auth.currentUser?.uid;
  const referralLink = userId
    ? `${window.location.origin}/?ref=${userId}`
    : window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Watch unlimited movies, series & live TV on Family Binge! Sign up free: ${referralLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Family Binge',
        text: 'Watch unlimited movies, series & live TV!',
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  if (compact) {
    return (
      <div className="bg-zinc-800/50 rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Invite Friends & Family</h3>
            <p className="text-gray-400 text-xs">Share your referral link</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 rounded-xl px-3 py-2 mb-3 border border-white/10">
          <span className="text-gray-400 text-xs truncate flex-1">{referralLink}</span>
          <button onClick={handleCopy} className="text-purple-400 hover:text-purple-300 flex-shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2">
            WhatsApp
          </Button>
          <Button onClick={handleNativeShare} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2">
            Share
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 bg-zinc-900/50 border-t border-white/10">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
          <Share2 className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Share with Friends & Family</h2>
        <p className="text-gray-400 mb-8">Invite the people you love to watch together on Family Binge.</p>
        <div className="flex items-center gap-3 bg-zinc-800 rounded-2xl px-5 py-4 mb-6 border border-white/10">
          <span className="text-gray-300 text-sm truncate flex-1">{referralLink}</span>
          <button onClick={handleCopy} className="text-purple-400 hover:text-purple-300 flex-shrink-0 flex items-center gap-1 text-sm font-medium">
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base rounded-2xl">
            Share on WhatsApp
          </Button>
          <Button onClick={handleNativeShare} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-base rounded-2xl">
            <Share2 className="w-4 h-4 mr-2" /> More Options
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteSection;
