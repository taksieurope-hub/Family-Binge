import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 99,
      billingText: "R99 / 1 month",
      devices: "1 TV + 1 Phone",
      quality: "HD Quality",
      extra: "+R20/month per extra device",
      popular: false
    },
    {
      id: "standard",
      name: "Standard",
      price: 249,
      billingText: "R249 / 3 months (≈ R83/month)",
      devices: "1 TV + 1 Phone (Upgraded)",
      quality: "Full HD Quality",
      extra: "+R20/month per extra device",
      popular: true
    },
    {
      id: "premium",
      name: "Premium (The High Roller)",
      price: 399,
      billingText: "R399 / 6 months (≈ R66/month)",
      devices: "2 TV + 2 Phones (Upgraded)",
      quality: "4K Quality",
      extra: "+R20/month per extra device",
      popular: false
    },
    {
      id: "annual",
      name: "Annual (The Best Value) Family",
      price: 599,
      billingText: "R599 / 12 months (≈ R50/month)",
      devices: "5 TV + 5 Phones",
      quality: "4K Quality",
      extra: "+R20/month per extra device",
      popular: false,
      bestValue: true
    }
  ];

  const createOrder = async (plan) => {
    const res = await fetch('https://family-binge-backend.onrender.com/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.name, amount: plan.price })
    });
    const data = await res.json();
    return data.id;
  };

  const onApprove = async (data) => {
    const res = await fetch(`https://family-binge-backend.onrender.com/api/payment/capture-order/${data.orderID}`, {
      method: 'POST'
    });
    if (res.ok) {
      localStorage.setItem('familybinge_paid', 'true');
      alert('✅ Payment successful! You now have full access.');
      navigate('/app');
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_SANDBOX_CLIENT_ID_HERE" }}>
      <section id="pricing" className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-center text-gray-400 mb-12">3-day free trial • Cancel anytime</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-black rounded-3xl p-8 border transition-all relative ${
                  plan.popular ? 'border-purple-500 shadow-2xl scale-105' : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-6 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-6 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}

                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-6xl font-bold">{plan.billingText.split('/')[0]}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.billingText}</p>

                <div className="my-8 space-y-4 text-sm">
                  <p><span className="font-medium">Devices:</span> {plan.devices}</p>
                  <p><span className="font-medium">Quality:</span> {plan.quality}</p>
                  <p className="text-purple-400">{plan.extra}</p>
                </div>

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={() => createOrder(plan)}
                  onApprove={onApprove}
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