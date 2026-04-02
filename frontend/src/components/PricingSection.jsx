import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { auth, db } from '../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const PricingSection = () => {
  const navigate = useNavigate();
  const [referralCredit, setReferralCredit] = React.useState(0);

  React.useEffect(() => {
    const fetchCredit = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setReferralCredit(snap.data().referralCredit || 0);
      }
    };
    fetchCredit();
  }, []);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 99,
      billing: "R99 / 1 month",
      devices: "1 TV + 1 Phone",
      quality: "HD Quality",
      popular: false
    },
    {
      id: "standard",
      name: "Standard",
      price: 249,
      billing: "R249 / 3 months (~ R83/month)",
      devices: "1 TV + 1 Phone (Upgraded)",
      quality: "Full HD Quality",
      popular: true
    },
    {
      id: "premium",
      name: "Premium (The High Roller)",
      price: 399,
      billing: "R399 / 6 months (~ R66/month)",
      devices: "2 TV + 2 Phones (Upgraded)",
      quality: "4K Quality",
      popular: false
    },
    {
      id: "annual",
      name: "Annual (The Best Value) Family",
      price: 599,
      billing: "R599 / 12 months (~ R50/month)",
      devices: "5 TV + 5 Phones",
      quality: "4K Quality",
      popular: false,
      bestValue: true
    }
  ];

  const createOrder = async (plan) => {
  // Fetch current USD/ZAR rate
  const rateRes = await fetch('https://open.er-api.com/v6/latest/ZAR');
  const rateData = await rateRes.json();
  const zarToUsd = rateData.rates.USD;

  const discountedPrice = Math.max(0, plan.price - referralCredit);
  const usdAmount = (discountedPrice * zarToUsd).toFixed(2);

  const res = await fetch('https://family-binge-backend.onrender.com/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: plan.name, amount: usdAmount, currency: 'USD' })
  });
  const data = await res.json();
  return data.id;
};

    const onApprove = async (data, actions, plan) => {
    const res = await fetch('https://family-binge-backend.onrender.com/api/payment/capture-order/' + data.orderID, {
      method: 'POST'
    });
    if (res.ok) {
      const user = auth.currentUser;
      if (user) {
        await fetch('https://family-binge-backend.onrender.com/api/payment/activate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.uid, plan: plan.id, order_id: data.orderID })
        });
      }
      // Clear used referral credit
      if (referralCredit > 0) {
        const user2 = auth.currentUser;
        if (user2) {
          await updateDoc(doc(db, 'users', user2.uid), { referralCredit: 0 });
          setReferralCredit(0);
        }
      }
      alert('Payment successful! Plan: ' + plan.name);
      window.location.href = '/app';
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
      <section id="pricing" className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
          {referralCredit > 0 && (
            <div className="max-w-md mx-auto mb-8 bg-green-500/10 border border-green-500/30 rounded-2xl px-6 py-4 text-center">
              <p className="text-green-400 font-bold text-lg">You have R{referralCredit} referral credit!</p>
              <p className="text-gray-400 text-sm mt-1">This will be automatically deducted from your next payment.</p>
            </div>
          )}
          <p className="text-center text-gray-400 mb-12">3-day free trial - Cancel anytime</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`bg-black rounded-3xl p-8 border transition-all relative ${plan.popular ? 'border-purple-500 shadow-2xl scale-105' : 'border-white/10'} ${plan.bestValue ? 'border-emerald-500' : ''}`}
              >
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-6 py-1 rounded-full">MOST POPULAR</div>}
                {plan.bestValue && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-6 py-1 rounded-full">BEST VALUE</div>}

                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-6xl font-bold">{referralCredit > 0 ? 'R' + Math.max(0, plan.price - referralCredit) : plan.billing.split('/')[0]}</span>
                  {referralCredit > 0 && <span className="ml-2 text-lg text-gray-500 line-through">R{plan.price}</span>}
                </div>
                <p className="text-gray-400 text-sm">{plan.billing}</p>
                {referralCredit > 0 && <p className="text-green-400 text-xs mt-1">R{referralCredit} referral discount applied!</p>}

                <div className="my-8 space-y-3 text-sm">
                  <p><strong>Devices:</strong> {plan.devices}</p>
                  <p><strong>Quality:</strong> {plan.quality}</p>
                  <p className="text-purple-400">+R20/month per extra device</p>
                </div>

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={() => createOrder(plan)}
                  onApprove={(data, actions) => onApprove(data, actions, plan)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PayPalScriptProvider>
  );
};

export default PricingSection;
