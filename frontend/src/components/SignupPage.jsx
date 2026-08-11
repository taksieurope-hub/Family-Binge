import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

const BACKEND = 'https://api.familybinge.com';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState('');
  const [momsName, setMomsName] = useState('');
  const [dadsName, setDadsName] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Signup failed. Please try again.');
        return;
      }
      localStorage.setItem('fb_token', data.token);
      localStorage.setItem('fb_uid', data.uid);
      localStorage.setItem('fb_name', data.name);
      localStorage.setItem('fb_email', data.email);
      setUid(data.uid);
      setStep(2);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestions = async (e) => {
    e.preventDefault();
    setError('');
    if (!momsName || !dadsName || !birthYear) {
      setError('Please answer all questions.');
      return;
    }
    setLoading(true);
    try {
      await fetch('https://api.familybinge.com/api/auth/security-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, moms_name: momsName, dads_name: dadsName, birth_year: birthYear })
      });
      navigate('/app');
    } catch {
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Security Questions</h1>
        <p className="text-gray-400 text-center text-sm mb-8">In case you forget your password, we will use these to verify your identity.</p>
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSecurityQuestions} className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">What is your mom's name?</label>
            <input value={momsName} onChange={e => setMomsName(e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="Mom's name" />
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-2 block">What is your dad's name?</label>
            <input value={dadsName} onChange={e => setDadsName(e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="Dad's name" />
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-2 block">What year were you born?</label>
            <input value={birthYear} onChange={e => setBirthYear(e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="e.g. 1990" maxLength={4} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors">
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
          <button type="button" onClick={() => navigate('/app')}
            className="w-full py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">Join Family Binge</h1>
        <p className="text-center text-gray-400 mb-8">7 days free • Cancel anytime</p>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
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



