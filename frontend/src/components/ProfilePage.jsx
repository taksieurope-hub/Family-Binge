import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, LogOut, Crown, Calendar, AlertTriangle, Tv, X } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const API = 'https://family-binge-g5hf.onrender.com/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('fb_uid');
    const token = localStorage.getItem('fb_token');
    if (!uid || !token) { navigate('/login'); return; }

    fetch(`${API}/auth/me/${uid}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUserData(data); })
      .catch(() => {
        const cached = localStorage.getItem('fb_userdata');
        if (cached) setUserData(JSON.parse(cached));
      })
      .finally(() => setLoading(false));

    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  }, [navigate]);

  const handleRemove = (id, type) => {
    removeFromWatchHistory(id, type);
    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  };

  const handleLogout = async () => {
    if (window.confirm('Log out?')) {
      localStorage.removeItem('fb_token');
      localStorage.removeItem('fb_uid');
      localStorage.removeItem('fb_name');
      localStorage.removeItem('fb_email');
      localStorage.removeItem('fb_userdata');
      try { await signOut(auth); } catch {}
      navigate('/login');
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Cancel your subscription? You will lose access after the current period.')) {
      const uid = localStorage.getItem('fb_uid');
      await fetch(`${API}/payment/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid })
      });
      const res = await fetch(`${API}/auth/me/${uid}`);
      if (res.ok) setUserData(await res.json());
      alert('Subscription cancelled.');
    }
  };

  const formatDate = (val) => {
    if (!val) return 'N/A';
    try { return new Date(val).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return 'N/A'; }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate('/app')} className="text-gray-400 hover:text-white transition-colors text-sm">← Back</button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900 rounded-3xl p-8 mb-8 border border-zinc-800">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {userData?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData?.name || localStorage.getItem('fb_name')}</h1>
              <p className="text-gray-400">{userData?.email || localStorage.getItem('fb_email')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-semibold capitalize">{userData?.plan || 'Free Trial'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-gray-400 mb-1">Member since</p>
              <p className="font-semibold">{formatDate(userData?.createdAt)}</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-gray-400 mb-1">Plan expires</p>
              <p className="font-semibold">{formatDate(userData?.subscriptionExpires || userData?.trialEnds)}</p>
            </div>
          </div>

          {userData?.plan && userData.plan !== 'free_trial' && (
            <button onClick={handleCancelSubscription}
              className="mt-4 text-red-400 hover:text-red-300 text-sm transition-colors">
              Cancel Subscription
            </button>
          )}
        </div>

        {/* Continue Watching */}
        {history.length > 0 && (
          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" /> Continue Watching
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {history.map(item => (
                <div key={`${item.type}-${item.id}`} className="relative group cursor-pointer"
                  onClick={() => navigate('/app')}>
                  <img src={item.poster} alt={item.title}
                    className="w-full aspect-[2/3] object-cover rounded-xl" />
                  <button onClick={(e) => { e.stopPropagation(); handleRemove(item.id, item.type); }}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <p className="text-white text-xs font-semibold mt-2 truncate">{item.title}</p>
                  {item.type === 'series' && (
                    <p className="text-gray-400 text-xs">S{item.season} E{item.episode}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
