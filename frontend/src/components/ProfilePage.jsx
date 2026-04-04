import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, LogOut, Settings, Crown, Shield, Zap, Calendar, AlertTriangle } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';
import { Button } from './ui/button';
import InviteSection from './InviteSection';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { channels } from './LiveTVSection';
import { Tv } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [hiddenChannels, setHiddenChannels] = useState([]);

  useEffect(() => {
    const loadHidden = async () => {
      const u = auth.currentUser;
      if (!u) { setTimeout(loadHidden, 500); return; }
      try {
        const snap = await getDoc(doc(db, 'hidden_channels', u.uid));
        if (snap.exists()) setHiddenChannels(snap.data().ids || []);
      } catch(e) { console.error('loadHidden error', e); }
    };
    loadHidden();
  }, []);

  const unhideChannel = async (id) => {
    const next = hiddenChannels.filter(i => i !== id);
    setHiddenChannels(next);
    const u = auth.currentUser;
    if (u) await setDoc(doc(db, 'hidden_channels', u.uid), { ids: next });
  };

  const unhideAll = async () => {
    setHiddenChannels([]);
    const u = auth.currentUser;
    if (u) await setDoc(doc(db, 'hidden_channels', u.uid), { ids: [] });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (e) {
        console.error('Error fetching user data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

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
      await signOut(auth);
      navigate('/login');
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Cancel your subscription? You will lose access after the current period.')) {
      const { updateDoc, doc: firestoreDoc } = await import('firebase/firestore');
      await updateDoc(firestoreDoc(db, 'users', auth.currentUser.uid), {
        plan: 'free_trial',
        subscriptionPlan: null,
        subscriptionExpires: null,
      });
      const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      setUserData(snap.data());
      alert('Subscription cancelled. You can resubscribe anytime.');
    }
  };

  // Date helpers
  const toDate = (val) => {
    if (!val) return null;
    if (val?.toDate) return val.toDate();
    return new Date(val);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getDaysLeft = (date) => {
    if (!date) return 0;
    const diff = date - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = auth.currentUser;
  const now = new Date();
  const trialEnds = toDate(userData?.trialEnds);
  const subExpires = toDate(userData?.subscriptionExpires);
  const hasPaidSub = userData?.plan && userData.plan !== 'free_trial' && subExpires && subExpires > now;
  const trialExpired = !hasPaidSub && trialEnds && trialEnds < now;
  const trialActive = !hasPaidSub && trialEnds && trialEnds >= now;
  const trialDaysLeft = trialActive ? getDaysLeft(trialEnds) : 0;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Back Button */}
      <div className="px-6 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>
      {/* Trial Expiry Banner */}
      {trialExpired && (
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
            <p className="text-white font-semibold">
              Your free trial expired on <span className="underline">{formatDate(trialEnds)}</span>
            </p>
          </div>
          <Button
            onClick={() => navigate('/app#pricing')}
            className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-2 rounded-xl flex-shrink-0"
          >
            <Crown className="w-4 h-4 mr-2" /> Subscribe Now
          </Button>
        </div>
      )}

      {trialActive && trialDaysLeft <= 1 && (
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white flex-shrink-0" />
            <p className="text-white font-semibold">
              Your trial expires <span className="underline">{formatDate(trialEnds)}</span> — don't lose access!
            </p>
          </div>
          <Button
            onClick={() => navigate('/app#pricing')}
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-6 py-2 rounded-xl flex-shrink-0"
          >
            <Crown className="w-4 h-4 mr-2" /> Upgrade
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/10 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
            {userData?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData?.name || 'User'}</h1>
            <p className="text-gray-400">{user?.email}</p>
            {hasPaidSub && (
              <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                <Crown className="w-3 h-3" /> {userData.subscriptionPlan}
              </span>
            )}
            {trialActive && (
              <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                <Zap className="w-3 h-3" /> Free Trial — {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
              </span>
            )}
            {trialExpired && (
              <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                <AlertTriangle className="w-3 h-3" /> Trial Expired
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Subscription Management */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-yellow-400" />
            Subscription
          </h2>

          {hasPaidSub ? (
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-2xl">
                    <Shield className="w-4 h-4" /> ACTIVE
                  </span>
                  <h3 className="text-3xl font-bold mt-4">{userData.subscriptionPlan}</h3>
                  <p className="text-gray-400 flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4" />
                    Expires: <span className="text-white font-medium">{formatDate(subExpires)}</span>
                  </p>
                  <p className="text-green-400 text-sm mt-1">{getDaysLeft(subExpires)} days remaining</p>
                </div>
                <Button onClick={handleCancelSubscription} variant="destructive" className="px-6">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : trialActive ? (
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-1.5 rounded-2xl">
                    <Zap className="w-4 h-4" /> FREE TRIAL
                  </span>
                  <h3 className="text-2xl font-bold mt-4">Trial Period</h3>
                  <p className="text-gray-400 flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4" />
                    Expires: <span className="text-white font-medium">{formatDate(trialEnds)}</span>
                  </p>
                  <p className="text-purple-400 text-sm mt-1">{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining</p>
                </div>
                <Button onClick={() => navigate('/app#pricing')} className="bg-purple-600 hover:bg-purple-700 px-8 py-4 flex items-center gap-2">
                  <Crown className="w-4 h-4" /> Upgrade Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-3xl p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-semibold text-lg">Trial expired on {formatDate(trialEnds)}</p>
              <p className="text-gray-400 mt-2">Subscribe to continue watching unlimited content.</p>
              <Button onClick={() => navigate('/app#pricing')} className="mt-6 px-10 py-6 text-lg bg-purple-600 hover:bg-purple-700 flex items-center gap-2 mx-auto">
                <Crown className="w-5 h-5" /> Choose a Plan
              </Button>
            </div>
          )}
        </div>

        {/* Watch History */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-green-400" />
            Continue Watching
          </h2>
          {history.length === 0 ? (
            <p className="text-gray-400">No watch history yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => navigate('/app')}
                >
                  <img src={item.backdrop || item.poster} alt={item.title} className="w-full aspect-video object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id, item.type); }}
                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-white" />
                  </button>
                  <div className="p-3">
                    <p className="font-medium line-clamp-2">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.type === 'series' ? `S${item.season} E${item.episode}` : item.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Account Settings
          </h2>
          <div className="bg-zinc-900 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Member Since</p>
                <p className="text-gray-400 text-sm">
                  {userData?.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Channels */}
        {hiddenChannels.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
              <Tv className="w-6 h-6 text-red-400" />
              Hidden Channels ({hiddenChannels.length})
            </h2>
            <div className="bg-zinc-900 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm">These channels are hidden from your Live TV</p>
                <button onClick={unhideAll} className="text-xs bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors">
                  Restore All
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {hiddenChannels.map(id => {
                  const ch = channels.find(c => c.id === id);
                  if (!ch) return null;
                  return (
                    <div key={id} className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Tv className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-white text-sm font-medium">{ch.name}</p>
                          <p className="text-gray-500 text-xs">CH {ch.id} · {ch.category}</p>
                        </div>
                      </div>
                      <button onClick={() => unhideChannel(id)} className="text-xs bg-zinc-700 hover:bg-green-700 text-white px-3 py-1.5 rounded-full transition-colors">
                        Restore
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Promo Code & Invite */}
        {userData?.referralCode && (
          <div className="mt-10 bg-zinc-900 rounded-3xl p-6 border border-purple-500/20">
            <h2 className="text-lg font-bold text-white mb-1">Your Referral Code</h2>
            <p className="text-gray-400 text-sm mb-4">Share this code - when 2 friends sign up you unlock your bonus trial</p>
            <div className="flex items-center gap-3 bg-zinc-800 rounded-2xl px-5 py-4 border border-white/10">
              <span className="text-purple-400 font-bold text-xl tracking-widest flex-1">{userData.referralCode}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(userData.referralCode); alert('Code copied!'); }}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
              >
                Copy
              </button>
            </div>
            {userData?.promoDays > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs">Referrals</p>
                  <p className="text-white font-bold text-lg">{userData.promoReferrals || 0} / 2</p>
                </div>
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs">Bonus trial</p>
                  <p className="text-purple-400 font-bold text-lg">{userData.promoDays} days</p>
                </div>
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs">Status</p>
                  <p className={`font-bold text-lg ${userData.promoUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                    {userData.promoUnlocked ? 'Unlocked!' : 'Pending'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-6">
          <InviteSection compact />
        </div>

        {/* Logout */}
        <div className="mt-12 flex justify-center">
          <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-3 px-10 py-6">
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4">
          <div className="bg-zinc-900 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cancel Subscription?</h3>
                <p className="text-gray-400 text-sm">This cannot be undone</p>
              </div>
            </div>
            <div className="bg-zinc-800 rounded-2xl p-4 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                You will keep full access to Family Binge until {formatDate(subExpires)}.
                After that your account will downgrade and you will need to resubscribe.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowCancelModal(false)} variant="outline" className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 py-6">
                Keep Subscription
              </Button>
              <Button onClick={handleCancelSubscription} variant="destructive" className="flex-1 py-6" disabled={cancelling}>
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;