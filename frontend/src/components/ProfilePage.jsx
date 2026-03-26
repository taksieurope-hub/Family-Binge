import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, LogOut, Settings, Film, Tv } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [user] = useState({
    name: "Alex Rivera",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?img=68",
    plan: "Premium",
    expires: "March 2027"
  });

  useEffect(() => {
    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  }, []);

  const handleRemove = (id, type) => {
    removeFromWatchHistory(id, type);
    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  };

    const handleLogout = () => {
    if (window.confirm("Log out of your account?")) {
      localStorage.removeItem('familybinge_token');   // clear any saved login
      localStorage.removeItem('familybinge_user');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-white/10 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
          <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-2xl object-cover" />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              {user.plan} Plan • Expires {user.expires}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Watch History */}
        <div className="mt-10">
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
                <div key={item.id} className="group relative bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigate('/app')}>
                  <img 
                    src={item.backdrop || item.poster} 
                    alt={item.title}
                    className="w-full aspect-video object-cover"
                  />
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
                <p className="font-medium">Subscription</p>
                <p className="text-gray-400 text-sm">{user.plan} Plan</p>
              </div>
              <Button variant="outline">Manage Plan</Button>
            </div>
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
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="flex items-center gap-3 px-10 py-6"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;