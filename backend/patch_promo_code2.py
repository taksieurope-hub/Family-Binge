# -*- coding: utf-8 -*-
import codecs

# 1. Patch SignupPage
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = codecs.open(path, 'r', 'utf-8').read()

old = "        plan: 'free_trial',\n        subscriptionExpires: null,"
new = "        plan: 'free_trial',\n        subscriptionExpires: null,\n        referralCode: 'FAM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),"
if old in c:
    c = c.replace(old, new); print("Step 1: Done")
else:
    print("ERROR step 1")

old2 = "  const [promoInfo, setPromoInfo] = useState(null);"
new2 = "  const [promoInfo, setPromoInfo] = useState(null);\n  const [promoCode, setPromoCode] = useState('');"
if old2 in c:
    c = c.replace(old2, new2); print("Step 2: Done")
else:
    print("ERROR step 2")

old3 = "      // If referred, update referrer's promo referral count\n      const referredBy = new URLSearchParams(location.search).get('ref');"
new3 = "      // Handle manual promo code entry\n      let referredBy = new URLSearchParams(location.search).get('ref');\n      if (!referredBy && promoCode.trim()) {\n        try {\n          const { collection: _col, query: _q, where: _where, getDocs: _getDocs } = await import('firebase/firestore');\n          const codeQuery = _q(_col(db, 'users'), _where('referralCode', '==', promoCode.trim().toUpperCase()));\n          const codeSnap = await _getDocs(codeQuery);\n          if (!codeSnap.empty) { referredBy = codeSnap.docs[0].id; }\n        } catch(e) { console.error('Promo code lookup error:', e); }\n      }\n\n      // If referred, update referrer's promo referral count"
if old3 in c:
    c = c.replace(old3, new3); print("Step 3: Done")
else:
    print("ERROR step 3")

old4 = '        <p className="text-center text-gray-400 mb-8">3 days free \u2022 Cancel anytime</p>'
new4 = '        <p className="text-center text-gray-400 mb-8">3 days free \u2022 Cancel anytime</p>\n        <div className="mb-4">\n          <input\n            type="text"\n            placeholder="Promo code (optional)"\n            value={promoCode}\n            onChange={e => setPromoCode(e.target.value.toUpperCase())}\n            className="w-full px-6 py-3 bg-zinc-800/50 border border-purple-500/30 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"\n          />\n        </div>'
if old4 in c:
    c = c.replace(old4, new4); print("Step 4: Done")
else:
    print("ERROR step 4")

codecs.open(path, 'w', 'utf-8').write(c)

# 2. Patch ProfilePage
path2 = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ProfilePage.jsx'
c2 = codecs.open(path2, 'r', 'utf-8').read()

old5 = "        {/* Invite Friends */}\n        <InviteSection compact />"
new5 = "        {/* Promo Code & Invite */}\n        {userData?.referralCode && (\n          <div className=\"mt-10 bg-zinc-900 rounded-3xl p-6 border border-purple-500/20\">\n            <h2 className=\"text-lg font-bold text-white mb-1\">Your Referral Code</h2>\n            <p className=\"text-gray-400 text-sm mb-4\">Share this code - when 2 friends sign up you unlock your bonus trial</p>\n            <div className=\"flex items-center gap-3 bg-zinc-800 rounded-2xl px-5 py-4 border border-white/10\">\n              <span className=\"text-purple-400 font-bold text-xl tracking-widest flex-1\">{userData.referralCode}</span>\n              <button\n                onClick={() => { navigator.clipboard.writeText(userData.referralCode); alert('Code copied!'); }}\n                className=\"text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold\"\n              >\n                Copy\n              </button>\n            </div>\n            {userData?.promoDays > 0 && (\n              <div className=\"mt-4 flex items-center gap-3\">\n                <div className=\"flex-1 bg-zinc-800 rounded-xl px-4 py-3\">\n                  <p className=\"text-gray-400 text-xs\">Referrals</p>\n                  <p className=\"text-white font-bold text-lg\">{userData.promoReferrals || 0} / 2</p>\n                </div>\n                <div className=\"flex-1 bg-zinc-800 rounded-xl px-4 py-3\">\n                  <p className=\"text-gray-400 text-xs\">Bonus trial</p>\n                  <p className=\"text-purple-400 font-bold text-lg\">{userData.promoDays} days</p>\n                </div>\n                <div className=\"flex-1 bg-zinc-800 rounded-xl px-4 py-3\">\n                  <p className=\"text-gray-400 text-xs\">Status</p>\n                  <p className={`font-bold text-lg ${userData.promoUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>\n                    {userData.promoUnlocked ? 'Unlocked!' : 'Pending'}\n                  </p>\n                </div>\n              </div>\n            )}\n          </div>\n        )}\n        <div className=\"mt-6\">\n          <InviteSection compact />\n        </div>"

if old5 in c2:
    c2 = c2.replace(old5, new5)
    codecs.open(path2, 'w', 'utf-8').write(c2)
    print("Step 5: Done")
else:
    print("ERROR step 5")
