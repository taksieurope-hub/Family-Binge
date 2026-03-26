import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
        plan: 'free_trial',
        trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      navigate('/app');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-2">Join Family Binge</h1>
        <p className="text-center text-gray-400 mb-8">7 days free • Cancel anytime</p>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <Button type="submit" disabled={loading} className="w-full py-7 text-lg bg-purple-600 hover:bg-purple-700">
            {loading ? 'Creating account...' : 'Create Free Account'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-8">
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;