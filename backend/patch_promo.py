# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "      const now = new Date();\n      const trialEnds = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days"

new = """      // Check promo counter for early adopter bonus
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
      const trialEnds = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // standard 3 days"""

if old in c:
    c = c.replace(old, new)
    print("Step 1: Done")
else:
    print("ERROR step 1: anchor not found")

# Add promoDays and promoLabel to Firestore user doc
old2 = "        plan: 'free_trial',\n        subscriptionExpires: null,"
new2 = "        plan: 'free_trial',\n        subscriptionExpires: null,\n        promoDays: promoDays,\n        promoLabel: promoLabel,\n        promoReferrals: 0,"

if old2 in c:
    c = c.replace(old2, new2)
    print("Step 2: Done")
else:
    print("ERROR step 2: anchor not found")

open(path, 'w', encoding='utf-8').write(c)
