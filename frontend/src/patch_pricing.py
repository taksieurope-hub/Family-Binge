import pathlib

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\PricingSection.jsx')
c = path.read_text(encoding='utf-8')

old = '''  const onApprove = async (data, actions, plan) => {
    const res = await fetch(https://family-binge-backend.onrender.com/api/payment/capture-order/, {
      method: 'POST'
    });
    if (res.ok) {
      const planDurations = {
        "Basic": 30,
        "Standard": 90,
        "Premium (The High Roller)": 180,
        "Annual (The Best Value) Family": 365
      };
      const days = planDurations[plan.name] || 30;
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          plan: plan.name,
          subscriptionPlan: plan.name,
          subscriptionExpires: expires,
          subscriptionDays: days,
          lastPaymentDate: new Date(),
          lastPaymentAmount: plan.price
        });
      }
      alert(\\u2705 Payment successful!\\nPlan: \\nExpires: );
      navigate('/app');
    }
  };'''

new = '''  const onApprove = async (data, actions, plan) => {
    const res = await fetch(https://family-binge-backend.onrender.com/api/payment/capture-order/, {
      method: 'POST'
    });
    if (res.ok) {
      const user = auth.currentUser;
      if (user) {
        // Call activate-plan to set device limits in Firestore
        await fetch('https://family-binge-backend.onrender.com/api/payment/activate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.uid,
            plan: plan.id,
            order_id: data.orderID
          })
        });
      }
      alert('Payment successful! Plan: ' + plan.name);
      navigate('/app');
    }
  };'''

if old in c:
    c = c.replace(old, new)
    path.write_text(c, encoding='utf-8')
    print('Done! PricingSection patched.')
else:
    print('ERROR: pattern not found')
