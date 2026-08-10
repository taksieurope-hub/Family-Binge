import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye } from 'lucide-react';

const BACKEND = 'https://family-binge-g5hf.onrender.com';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [momsName, setMomsName] = useState('');
  const [dadsName, setDadsName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, moms_name: momsName, dads_name: dadsName, birth_year: birthYear })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Answers do not match our records.');
        return;
      }
      setPassword(data.password);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (password) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Eye className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your Password</h1>
        <p className="text-gray-400 text-sm mb-6">Here is your password. Please keep it safe.</p>
        <div className="bg-zinc-800 rounded-2xl p-6 mb-6">
          <p className="text-white text-2xl font-mono font-bold tracking-wider">
            {showPassword ? password : ''}
          </p>
          <button onClick={() => setShowPassword(!showPassword)}
            className="text-purple-400 hover:text-purple-300 text-sm mt-2 transition-colors">
            {showPassword ? 'Hide' : 'Show'} password
          </button>
        </div>
        <button onClick={() => navigate('/login')}
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors">
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Forgot Password</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Answer your security questions to recover your password.</p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-2 block">What is your mom's name?</label>
            <input value={momsName} onChange={e => setMomsName(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="Mom's name" />
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-2 block">What is your dad's name?</label>
            <input value={dadsName} onChange={e => setDadsName(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="Dad's name" />
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-2 block">What year were you born?</label>
            <input value={birthYear} onChange={e => setBirthYear(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:border-purple-500 outline-none"
              placeholder="e.g. 1990" maxLength={4} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors">
            {loading ? 'Checking...' : 'Recover Password'}
          </button>
          <button type="button" onClick={() => navigate('/login')}
            className="w-full py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
