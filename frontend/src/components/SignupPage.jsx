import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AlertTriangle } from 'lucide-react';

const BACKEND = 'https://family-binge-backend.onrender.com';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });

      const now = new Date();
      const isPromoCode = false;
      const trialDays = isPromoCode ? 15 : 3;
      const trialEnds = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
      const referralCode = 'FAM-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const referredBy = new URLSearchParams(location.search).get('ref') || null;

      await fetch(`${BACKEND}/api/payment/user/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: email,
          name: name,
          trialEnds: trialEnds.toISOString(),
          plan: 'free_trial',
          referralCode,
          referredBy,
          createdAt: now.toISOString(),
        })
      });

      navigate('/app');
    } catch (err) {
      const msg = err.message.replace('Firebase: ', '');
      if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please log in instead.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-2">Join Family Binge</h1>
        <p className="text-center text-gray-400 mb-8">3 days free • Cancel anytime</p>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <Button type="submit" disabled={loading} className="w-full py-7 text-lg bg-purple-600 hover:bg-purple-700">
            {loading ? 'Creating account...' : 'Start Free Trial'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-8">
          Already have an account? <a href="/login" className="text-purple-400 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
