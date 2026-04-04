# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# After saving user doc, check if they were referred and update referrer
old = "      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);"
new = """      // If referred, update referrer's promo referral count
      const referredBy = new URLSearchParams(location.search).get('ref');
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

      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);"""

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
