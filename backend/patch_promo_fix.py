# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Fix 1 - add missing fields to setDoc
old = """        promoDays: promoDays,
        promoLabel: promoLabel,
        referredBy: new URLSearchParams(location.search).get('ref') || null,
        sessionToken: '',
        sessionAt: null,"""
new = """        plan: 'free_trial',
        subscriptionExpires: null,
        promoDays: promoDays,
        promoLabel: promoLabel,
        promoReferrals: 0,
        promoUnlocked: false,
        referralCode: 'FAM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        referredBy: new URLSearchParams(location.search).get('ref') || null,
        sessionToken: '',
        sessionAt: null,"""

if old in c:
    c = c.replace(old, new)
    print("Step 1: Done")
else:
    print("ERROR step 1")

# Fix 2 - replace broken referral block with proper one
old2 = """      const referredBy = new URLSearchParams(location.search).get('ref');
      if (referredBy) {
        try {
          const { doc: rDoc, getDoc: rGet, updateDoc: rUpdate, Timestamp: rTs } = await import('firebase/firestore');
          const referrerSnap = await rGet(rDoc(db, 'users', referredBy));
          if (referrerSnap.exists()) {
            const referrerData = referrerSnap.data();
              // Unlock the promo - extend their trial
              const now2 = new Date();
              const currentTrialEnds = referrerData.trialEnds?.toDate ? referrerData.trialEnds.toDate() : new Date(referrerData.trialEnds);
              const baseDate = currentTrialEnds > now2 ? currentTrialEnds : now2;
              const newTrialEnds = new Date(baseDate.getTime() + referrerData.promoDays * 24 * 60 * 60 * 1000);
              await rUpdate(rDoc(db, 'users', referredBy), {
                promoUnlocked: true,
                trialEnds: rTs.fromDate(newTrialEnds),
              });
            } else {
            }
          }
      }"""
new2 = """      // Handle manual promo code entry
      let referredBy = new URLSearchParams(location.search).get('ref');
      if (!referredBy && promoCode.trim()) {
        try {
          const { collection: _col, query: _q, where: _where, getDocs: _getDocs } = await import('firebase/firestore');
          const codeQuery = _q(_col(db, 'users'), _where('referralCode', '==', promoCode.trim().toUpperCase()));
          const codeSnap = await _getDocs(codeQuery);
          if (!codeSnap.empty) { referredBy = codeSnap.docs[0].id; }
        } catch(e) { console.error('Promo code lookup error:', e); }
      }
      if (referredBy) {
        try {
          const { doc: rDoc, getDoc: rGet, updateDoc: rUpdate, Timestamp: rTs } = await import('firebase/firestore');
          const referrerSnap = await rGet(rDoc(db, 'users', referredBy));
          if (referrerSnap.exists()) {
            const referrerData = referrerSnap.data();
            const currentReferrals = referrerData.promoReferrals || 0;
            const newReferrals = currentReferrals + 1;
            if (referrerData.promoDays > 0 && newReferrals >= 2 && !referrerData.promoUnlocked) {
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
      }"""

if old2 in c:
    c = c.replace(old2, new2)
    print("Step 2: Done")
else:
    print("ERROR step 2")

open(path, 'w', encoding='utf-8').write(c)
