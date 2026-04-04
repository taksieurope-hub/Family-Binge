# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Add referralCode and promoUnlocked to setDoc
old = "        promoReferrals: 0,\n        subscriptionPlan: null,"
new = "        promoReferrals: 0,\n        promoUnlocked: false,\n        referralCode: 'FAM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),\n        subscriptionPlan: null,"
if old in c:
    c = c.replace(old, new)
    print("Step 1: Done")
else:
    print("ERROR step 1")

# Add manual promo code lookup before referredBy check
old2 = "      // If referred, update referrer's promo referral count\n      const referredBy = new URLSearchParams(location.search).get('ref');"
new2 = "      // Handle manual promo code entry\n      let referredBy = new URLSearchParams(location.search).get('ref');\n      if (!referredBy && promoCode.trim()) {\n        try {\n          const { collection: _col, query: _q, where: _where, getDocs: _getDocs } = await import('firebase/firestore');\n          const codeQuery = _q(_col(db, 'users'), _where('referralCode', '==', promoCode.trim().toUpperCase()));\n          const codeSnap = await _getDocs(codeQuery);\n          if (!codeSnap.empty) { referredBy = codeSnap.docs[0].id; }\n        } catch(e) { console.error('Promo code lookup error:', e); }\n      }\n      // If referred, update referrer's promo referral count"
if old2 in c:
    c = c.replace(old2, new2)
    print("Step 2: Done")
else:
    print("ERROR step 2")

open(path, 'w', encoding='utf-8').write(c)
