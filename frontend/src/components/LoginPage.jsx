import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AlertTriangle, Crown, Clock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [trialInfo, setTrialInfo] = useState(null); // shown after login if trial active/expired

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data from Firestore
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const now = new Date();
        const trialEnds = data.trialEnds?.toDate ? data.trialEnds.toDate() : new Date(data.trialEnds);
        const subExpires = data.subscriptionExpires?.toDate ? data.subscriptionExpires.toDate() : (data.subscriptionExpires ? new Date(data.subscriptionExpires) : null);

        const hasPaidSub = data.plan && data.plan !== 'free_trial' && subExpires && subExpires > now;

        if (hasPaidSub) {
          // Paid user — go straight in
          navigate('/app');
          return;
        }

        const trialExpired = trialEnds < now;

        // Show trial info before proceeding
        setTrialInfo({
          trialEnds,
          trialExpired,
          name: data.name,
        });
      } else {
        navigate('/app');
      }
    } catch (err) {
  console.log('FULL ERROR:', JSON.stringify(err));
  console.log('ERROR CODE:', err.code);
  console.log('ERROR MESSAGE:', err.message);
  const msg = err.message.replace('Firebase: ', '');
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format trial end date nicely
  const formatTrialDate = (date) => {
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Trial info screen shown after login
  if (trialInfo) {
    const { trialEnds, trialExpired, name } = trialInfo;
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
          <div className="text-center mb-6">
            {trialExpired ? (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-1">
              Welcome back{name ? `, ${name.split(' ')[0]}` : ''}!
            </h2>
            {trialExpired ? (
              <>
                <p className="text-red-400 font-semibold mt-2">Your free trial has expired</p>
                <p className="text-gray-400 text-sm mt-1">
                  Trial ended on <span className="text-white">{formatTrialDate(trialEnds)}</span>
                </p>
                <p className="text-gray-400 text-sm mt-3">Subscribe now to keep watching.</p>
              </>
            ) : (
              <>
                <p className="text-green-400 font-semibold mt-2">Your free trial is active</p>
                <p className="text-gray-400 text-sm mt-2">
                  Trial expires on:
                </p>
                <p className="text-white font-semibold mt-1">{formatTrialDate(trialEnds)}</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={() => navigate('/app#pricing')}
              className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              {trialExpired ? 'Subscribe Now' : 'Upgrade to Premium'}
            </Button>
            {!trialExpired && (
              <Button
                onClick={() => navigate('/app')}
                variant="outline"
                className="w-full py-6 text-lg bg-white/5 hover:bg-white/10 text-white border-white/20"
              >
                Continue Watching
              </Button>
            )}
            {trialExpired && (
              <Button
                onClick={() => navigate('/app')}
                variant="outline"
                className="w-full py-4 text-sm bg-white/5 hover:bg-white/10 text-gray-400 border-white/10"
              >
                Browse Only (Limited Access)
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome Back</h1>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <Button type="submit" disabled={loading} className="w-full py-7 text-lg bg-purple-600 hover:bg-purple-700">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-8">
          New here? <Link to="/signup" className="text-purple-400 hover:underline">Create free account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;