import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { Button } from './ui/button';

const AuthModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(tab === 'login' ? 'Login clicked' : 'Register clicked');
    // Later we will connect this to the backend
    alert(tab === 'login' ? 'Login successful (placeholder)' : 'Account created (placeholder)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-3xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-4 text-lg font-semibold ${tab === 'login' ? 'text-white border-b-2 border-green-400' : 'text-gray-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-4 text-lg font-semibold ${tab === 'register' ? 'text-white border-b-2 border-green-400' : 'text-gray-400'}`}
          >
            Create Account
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-zinc-800 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-zinc-800 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
              </div>

              {/* Register extra field */}
              {tab === 'register' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-zinc-800 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full py-6 text-xl font-semibold bg-green-400 hover:bg-green-500 text-black">
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </form>

          <button onClick={onClose} className="mt-6 text-gray-400 hover:text-white text-sm w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
