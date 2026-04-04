# -*- coding: utf-8 -*-

# 1. Add promo code generation to SignupPage
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Generate code on signup
old = "        plan: 'free_trial',\n        subscriptionExpires: null,"
new = """        plan: 'free_trial',
        subscriptionExpires: null,
        referralCode: 'FAM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),"""

if old in c:
    c = c.replace(old, new)
    print("Step 1: Done")
else:
    print("ERROR step 1: anchor not found")

# Add promoCode state
old2 = "  const [promoInfo, setPromoInfo] = useState(null);"
new2 = "  const [promoInfo, setPromoInfo] = useState(null);\n  const [promoCode, setPromoCode] = useState('');"

if old2 in c:
    c = c.replace(old2, new2)
    print("Step 2: Done")
else:
    print("ERROR step 2: anchor not found")

# Handle promo code lookup - add before referredBy check
old3 = "      // If referred, update referrer's promo referral count\n      const referredBy = new URLSearchParams(location.search).get('ref');"
new3 = """      // Handle manual promo code entry
      let referredBy = new URLSearchParams(location.search).get('ref');
      if (!referredBy && promoCode.trim()) {
        try {
          const { collection: _col, query: _q, where: _where, getDocs: _getDocs } = await import('firebase/firestore');
          const codeQuery = _q(_col(db, 'users'), _where('referralCode', '==', promoCode.trim().toUpperCase()));
          const codeSnap = await _getDocs(codeQuery);
          if (!codeSnap.empty) {
            referredBy = codeSnap.docs[0].id;
          } else {
            console.log('Promo code not found:', promoCode);
          }
        } catch(e) { console.error('Promo code lookup error:', e); }
      }

      // If referred, update referrer's promo referral count"""

if old3 in c:
    c = c.replace(old3, new3)
    print("Step 3: Done")
else:
    print("ERROR step 3: anchor not found")

# Add promo code input field to signup form
old4 = '        <p className="text-center text-gray-400 mb-8">3 days free \u2022 Cancel anytime</p>'
new4 = '        <p className="text-center text-gray-400 mb-8">3 days free \u2022 Cancel anytime</p>\n        <div className="mb-4">\n          <input\n            type="text"\n            placeholder="Promo code (optional)"\n            value={promoCode}\n            onChange={e => setPromoCode(e.target.value.toUpperCase())}\n            className="w-full px-6 py-3 bg-zinc-800/50 border border-purple-500/30 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"\n          />\n        </div>'

if old4 in c:
    c = c.replace(old4, new4)
    print("Step 4: Done")
else:
    print("ERROR step 4: anchor not found")

open(path, 'w', encoding='utf-8').write(c)

# 2. Add referral code display to ProfilePage
path2 = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ProfilePage.jsx'
c2 = open(path2, 'r', encoding='utf-8').read()

old5 = "        {/* Invite Friends */}\n        <InviteSection compact />"
new5 = """        {/* Promo Code & Invite */}
        {userData?.referralCode && (
          <div className="mt-10 bg-zinc-900 rounded-3xl p-6 border border-purple-500/20">
            <h2 className="text-lg font-bold text-white mb-1">Your Referral Code</h2>
            <p className="text-gray-400 text-sm mb-4">Share this code with friends — when 2 sign up you unlock your bonus trial</p>
            <div className="flex items-center gap-3 bg-zinc-800 rounded-2xl px-5 py-4 border border-white/10">
              <span className="text-purple-400 font-bold text-xl tracking-widest flex-1">{userData.referralCode}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(userData.referralCode); alert('Code copied!'); }}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
              >
                Copy
              </button>
            </div>
            {userData?.promoDays > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs">Referrals</p>
                  <p className="text-white font-bold text-lg">{userData.promoReferrals || 0} / 2</p>
                </div>
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs">Bonus trial</p>
                  <p className="text-purple-400 font-bold text-lg">{userData.promoDays} days</p>
                </div>
                <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs">Status</p>
                  <p className={`font-bold text-lg ${userData.promoUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                    {userData.promoUnlocked ? 'Unlocked!' : 'Pending'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-6">
          <InviteSection compact />
        </div>"""

if old5 in c2:
    c2 = c2.replace(old5, new5)
    open(path2, 'w', encoding='utf-8').write(c2)
    print("Step 5: Done")
else:
    print("ERROR step 5: anchor not found")
