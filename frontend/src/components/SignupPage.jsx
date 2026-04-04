import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { AlertTriangle } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoInfo, setPromoInfo] = useState(null);
  const [promoCode, setPromoCode] = useState('');

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

      // Check promo counter for early adopter bonus
      const { doc: _doc, getDoc: _getDoc, setDoc: _setDoc } = await import('firebase/firestore');
      const promoSnap = await _getDoc(_doc(db, 'promo', 'counter'));
      const promoCount = promoSnap.exists() ? (promoSnap.data().count || 0) : 0;

      let promoDays = 0;
      let promoLabel = null;
      if (promoCount < 3) {
        promoDays = 60;
        promoLabel = "first3";
      } else if (promoCount < 14) {
        promoDays = 15;
        promoLabel = "early14";
      } else if (promoCount < 30) {
        promoDays = 10;
        promoLabel = "early30";
      }

      await _setDoc(_doc(db, 'promo', 'counter'), { count: promoCount + 1 }, { merge: true });

      const now = new Date();
      const trialEnds = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // standard 3 days

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: Timestamp.fromDate(now),
        trialEnds: Timestamp.fromDate(trialEnds),
        plan: 'free_trial',
        subscriptionExpires: null,
        promoDays: promoDays,
        promoLabel: promoLabel,
        promoReferrals: 0,
        promoUnlocked: false,
        referralCode: 'FAM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        subscriptionPlan: null,
        referredBy: new URLSearchParams(location.search).get('ref') || null,
        sessionToken: '',
        sessionAt: null,
      });

      // Handle manual promo code entry
      let referredBy = new URLSearchParams(location.search).get('ref');
      if (!referredBy && promoCode.trim()) {
        try {
          const { collection: _col, query: _q, where: _where, getDocs: _getDocs } = await import('firebase/firestore');
          const codeQuery = _q(_col(db, 'users'), _where('referralCode', '==', promoCode.trim().toUpperCase()));
          const codeSnap = await _getDocs(codeQuery);
          if (!codeSnap.empty) { referredBy = codeSnap.docs[0].id; }
        } catch(e) { console.error('Promo code lookup error:', e); }
      }
      // If referred, update referrer's promo referral count
      if (referredBy) {
        try {
          const { doc: rDoc, getDoc: rGet, updateDoc: rUpdate, Timestamp: rTs } = await import('firebase/firestore');
          const referrerSnap = await rGet(rDoc(db, 'users', referredBy));
          if (referrerSnap.exists()) {
            const referrerData = referrerSnap.data();
            const currentReferrals = referrerData.promoReferrals || 0;
            const newReferrals = currentReferrals + 1;
            if (referrerData.promoDays > 0 && newReferrals >= 2 && !referrerData.promoUnlocked) {
              // Unlock the promo - extend their trial
              const now2 = new Date();
              const currentTrialEnds = referrerData.trialEnds?.toDate ? referrerData.trialEnds.toDate() : new Date(referrerData.trialEnds);
              const baseDate = currentTrialEnds > now2 ? currentTrialEnds : now2;
              const newTrialEnds = new Date(baseDate.getTime() + referrerData.promoDays * 24 * 60 * 60 * 1000);
              await rUpdate(rDoc(db, 'users', referredBy), {
                promoReferrals: newReferrals,
                promoUnlocked: true,
                trialEnds: rTs.fromDate(newTrialEnds),
              });
            } else {
              await rUpdate(rDoc(db, 'users', referredBy), { promoReferrals: newReferrals });
            }
          }
        } catch(e) { console.error('Referral update error:', e); }
      }

      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await import('firebase/firestore').then(({ doc: _doc, updateDoc }) =>
        updateDoc(_doc(db, 'users', user.uid), { sessionToken })
      );
      localStorage.setItem('fb_session_token', sessionToken);
      if (promoDays > 0) {
        setPromoInfo({ promoDays, promoLabel });
      } else {
        navigate('/app');
      }
    } catch (err) {
  console.log('FULL ERROR:', JSON.stringify(err));
  console.log('ERROR CODE:', err.code);
  console.log('ERROR MESSAGE:', err.message);
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

  if (promoInfo) {
    const msgs = {
      first3: { days: 60, title: "You're one of our first 3 members!", sub: "You've unlocked 60 days FREE once 2 friends subscribe using your link." },
      early14: { days: 15, title: "Early Adopter Bonus!", sub: "You've unlocked 15 days FREE once 2 friends subscribe using your link." },
      early30: { days: 10, title: "Welcome Bonus!", sub: "You've unlocked 10 days FREE once 2 friends subscribe using your link." },
    };
    const m = msgs[promoInfo.promoLabel];
    const referralLink = `${window.location.origin}/?ref=${require('../services/firebase').auth.currentUser?.uid}`;
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center">
          <div className="text-6xl mb-4">??</div>
          <h2 className="text-3xl font-bold text-white mb-3">{m.title}</h2>
          <p className="text-gray-300 mb-2">{m.sub}</p>
          <p className="text-gray-400 text-sm mb-6">Then just <span className="text-white font-bold">R99/month</span> after your free period ends.</p>
          <div className="bg-zinc-800 rounded-xl px-4 py-3 mb-4 text-left border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Your referral link</p>
            <p className="text-purple-400 text-sm truncate">{referralLink}</p>
          </div>
          <button
            onClick={() => {
              const msg = encodeURIComponent(`Join Family Binge and get 3 days free! Sign up here: ${referralLink}`);
              window.open(`https://wa.me/?text=${msg}`, '_blank');
            }}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl mb-3 transition-colors"
          >
            Share on WhatsApp
          </button>
          <button
            onClick={() => navigate('/app')}
            className="w-full py-3 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Continue to Family Binge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-2">Join Family Binge</h1>
        <p className="text-center text-gray-400 mb-8">3 days free • Cancel anytime</p>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Promo code (optional)"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value.toUpperCase())}
            className="w-full px-6 py-3 bg-zinc-800/50 border border-purple-500/30 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
        </div>
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
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;