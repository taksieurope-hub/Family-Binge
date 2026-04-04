# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Replace navigate('/app') with promo message screen trigger
old = "      localStorage.setItem('fb_session_token', sessionToken);\n      navigate('/app');"
new = """      localStorage.setItem('fb_session_token', sessionToken);
      if (promoDays > 0) {
        setPromoInfo({ promoDays, promoLabel });
      } else {
        navigate('/app');
      }"""

if old in c:
    c = c.replace(old, new)
    print("Step 1: Done")
else:
    print("ERROR step 1: anchor not found")

# Add promoInfo state
old2 = "  const [loading, setLoading] = useState(false);"
new2 = "  const [loading, setLoading] = useState(false);\n  const [promoInfo, setPromoInfo] = useState(null);"

if old2 in c:
    c = c.replace(old2, new2)
    print("Step 2: Done")
else:
    print("ERROR step 2: anchor not found")

# Add promo screen before main return
old3 = "  return (\n    <div className=\"min-h-screen bg-black flex items-center justify-center p-6\">"
new3 = """  if (promoInfo) {
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6">"""

if old3 in c:
    c = c.replace(old3, new3)
    print("Step 3: Done")
else:
    print("ERROR step 3: anchor not found")

open(path, 'w', encoding='utf-8').write(c)
