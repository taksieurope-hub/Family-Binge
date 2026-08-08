import React, { useState, useEffect } from 'react';
import { Plus, X, User } from 'lucide-react';

const API = 'https://family-binge-backend-2q4n.onrender.com/api';

const AVATARS = ['😀', '😎', '🤖', '🐱', '🐶', '🦄', '👽', '👻', '🦕', '🦊'];

const ProfileSelector = ({ onSelect }) => {
  const [profiles, setProfiles] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😀');
  const [loading, setLoading] = useState(true);

  const uid = localStorage.getItem('fb_uid');
  const mainName = localStorage.getItem('fb_name') || 'Main Profile';

  useEffect(() => {
    if (!uid) return;
    fetch(`${API}/profiles/${uid}`)
      .then(res => res.ok ? res.json() : { profiles: [] })
      .then(data => setProfiles(data.profiles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uid]);

  const [saveError, setSaveError] = useState('');

  const handleAddProfile = async () => {
    if (!newName.trim()) return;
    setSaveError('');
    const profile_id = 'profile_' + Date.now();
    const newProfile = { id: profile_id, name: newName.trim(), avatar: selectedAvatar };
    try {
      const res = await fetch(`${API}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, profile_id, name: newName.trim(), avatar: selectedAvatar })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setSaveError(errData.detail || 'Could not save profile. Please try again.');
        return;
      }
      setProfiles([...profiles, newProfile]);
      setNewName('');
      setAdding(false);
    } catch {
      setSaveError('Network error - could not save profile. Please try again.');
    }
  };

  const handleDelete = async (e, profileId) => {
    e.stopPropagation();
    await fetch(`${API}/profiles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, profile_id: profileId })
    });
    setProfiles(profiles.filter(p => p.id !== profileId));
  };

  const selectProfile = (profileId, profileName) => {
    localStorage.setItem('active_profile_id', profileId);
    localStorage.setItem('active_profile_name', profileName);
    onSelect(profileId, profileName);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Who's watching?</h1>
        <p className="text-gray-400 text-center mb-12">Select your profile</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center mb-10">
          {/* Main Profile */}
          <div onClick={() => selectProfile('main', mainName)}
            className="flex flex-col items-center cursor-pointer group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-2 transition-transform group-hover:scale-110 group-hover:ring-4 group-hover:ring-purple-500">
              {mainName.charAt(0).toUpperCase()}
            </div>
            <p className="text-white text-sm font-medium text-center truncate w-20">{mainName}</p>
            <p className="text-purple-400 text-xs">Main</p>
          </div>

          {/* Sub Profiles */}
          {profiles.map(profile => (
            <div key={profile.id} onClick={() => selectProfile(profile.id, profile.name)}
              className="flex flex-col items-center cursor-pointer group relative">
              <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110 group-hover:ring-4 group-hover:ring-purple-500">
                {profile.avatar}
              </div>
              <p className="text-white text-sm font-medium text-center truncate w-20">{profile.name}</p>
              <button onClick={(e) => handleDelete(e, profile.id)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          {/* Add Profile */}
          {profiles.length < 5 && !adding && (
            <div onClick={() => setAdding(true)}
              className="flex flex-col items-center cursor-pointer group">
              <div className="w-20 h-20 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-2xl flex items-center justify-center mb-2 transition-all group-hover:border-purple-500 group-hover:scale-110">
                <Plus className="w-8 h-8 text-zinc-500 group-hover:text-purple-400" />
              </div>
              <p className="text-zinc-500 text-sm group-hover:text-white">Add Profile</p>
            </div>
          )}
        </div>

        {/* Add Profile Form */}
        {adding && (
          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-700 max-w-md mx-auto">
            <h2 className="text-white font-bold text-xl mb-6 text-center">New Profile</h2>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Profile name"
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none mb-4"
              maxLength={20} />
            {saveError && (
              <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2">{saveError}</p>
            )}
            <p className="text-gray-400 text-sm mb-3">Choose an avatar:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {AVATARS.map(a => (
                <button key={a} onClick={() => setSelectedAvatar(a)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${selectedAvatar === a ? 'bg-purple-600 scale-110' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddProfile} disabled={!newName.trim()}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                Create Profile
              </button>
              <button onClick={() => setAdding(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;
