import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, LogOut, Settings, Crown, Shield, Zap, Calendar } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';
import { Button } from './ui/button';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [subscription, setSubscription] = useState(null);

    useEffect(() => {
    const savedUser = localStorage.getItem('familybinge_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const paid = localStorage.getItem('familybinge_paid') === 'true';
    const plan = localStorage.getItem('familybinge_subscription_plan');
    const expires = localStorage.getItem('familybinge_subscription_expires');

    if (paid && plan && expires) {
      setSubscription({ plan, expires });
    }

    // watch history
    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  }, []);

  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com"
  });

  const handleRemove = (id, type) => {
    removeFromWatchHistory(id, type);
    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  };

  const handleCancelSubscription = () => {
    if (window.confirm("Cancel your subscription? You will lose access after the current period.")) {
      localStorage.removeItem('familybinge_paid');
      localStorage.removeItem('familybinge_subscription_plan');
      setSubscription(null);
      alert("Subscription cancelled. You can resubscribe anytime.");
    }
  };

  const handleUpgrade = () => {
    navigate('/app#pricing');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/10 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
                {/* Subscription Management */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              Subscription Management
            </h2>
          </div>

          {subscription ? (
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-2xl">
                    <Shield className="w-4 h-4" />
                    ACTIVE
                  </span>
                  <h3 className="text-3xl font-bold mt-4">{subscription.plan}</h3>
                  <p className="text-gray-400 flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4" />
                    Expires: {new Date(subscription.expires).toDateString()}
                  </p>
                </div>
                <Button onClick={handleCancelSubscription} variant="destructive" className="px-6">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-3xl p-12 text-center">
              <p className="text-gray-400 text-lg">No active subscription</p>
              <Button onClick={() => navigate('/app#pricing')} className="mt-6 px-10 py-6 text-lg">
                Choose a Plan
              </Button>
            </div>
          )}
        </div>

        {/* Watch History */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Clock className="w-6 h-6 text-green-400" />
              Continue Watching
            </h2>
          </div>
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
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <Button variant="outline">Change Email</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-gray-400 text-sm">Last changed 3 months ago</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-12 flex justify-center">
          <Button onClick={() => { if (window.confirm("Log out?")) navigate('/login'); }} variant="destructive" className="flex items-center gap-3 px-10 py-6">
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;