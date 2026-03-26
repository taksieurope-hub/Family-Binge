import React, { useState } from 'react';
import { Check, Star, Tv, Smartphone, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 1,
    name: "Basic",
    tagline: "1 TV + 1 Phone",
    price: 99,
    period: "1 month",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "HD Quality",
      "1 TV device + 1 Phone",
      "+R20/month per extra device",
    ],
    popular: false,
    color: "purple"
  },
  {
    id: 2,
    name: "Standard",
    tagline: "2 TVs + 2 Phones",
    price: 150,
    period: "3 months",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "Full HD Quality",
      "2 TV devices + 2 Phones",
      "+R20/month per extra device",
    ],
    popular: true,
    color: "grad"
  },
  {
    id: 3,
    name: "Premium",
    tagline: "1 TV + 1 Phone",
    price: 300,
    period: "6 months",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "4K Quality",
      "1 TV device + 1 Phone",
      "+R20/month per extra device",
    ],
    popular: false,
    color: "pink"
  },
  {
    id: 4,
    name: "Annual",
    tagline: "1 TV + 1 Phone",
    price: 600,
    period: "12 months",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "4K Quality",
      "1 TV device + 1 Phone",
      "Best value — save R588/yr",
      "Priority support",
    ],
    popular: false,
    color: "purple"
  },
];

const PricingSection = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, #a855f7 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge badge-grad mb-4">3-Day Free Trial</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Choose Your <span className="grad-text">Plan</span>
          </h2>
          <p className="text-[#8b8aa0] text-lg max-w-xl mx-auto">
            Start free for 3 days. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Device info */}
        <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
          {[
            { icon: Tv, text: "Every plan includes 1 TV device" },
            { icon: Smartphone, text: "+ 1 phone included" },
            { icon: Zap, text: "+R20/month per extra device" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
              <Icon className="w-4 h-4" style={{ color: 'var(--purple)' }} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl p-6 transition-all duration-300 cursor-default ${
                plan.popular ? 'scale-105' : hoveredPlan === plan.id ? '-translate-y-1' : ''
              }`}
              style={{
                background: plan.popular
                  ? 'linear-gradient(135deg, #7c3aed, #be185d)'
                  : 'var(--card)',
                border: plan.popular
                  ? 'none'
                  : `1px solid ${hoveredPlan === plan.id ? 'rgba(168,85,247,0.4)' : 'rgba(168,85,247,0.15)'}`,
                boxShadow: plan.popular
                  ? '0 0 40px rgba(168,85,247,0.3), 0 20px 60px rgba(0,0,0,0.5)'
                  : hoveredPlan === plan.id
                    ? '0 0 20px rgba(168,85,247,0.15), 0 10px 40px rgba(0,0,0,0.4)'
                    : '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-black" style={{ background: '#facc15' }}>
                    <Star className="w-3 h-3 fill-black" /> MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-0.5">{plan.name}</h3>
                <p className={`text-xs font-medium ${plan.popular ? 'text-white/70' : 'text-[#8b8aa0]'}`}>
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-white'}`}>R{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-[#8b8aa0]'}`}>/ {plan.period}</span>
                </div>
                {plan.id === 4 && (
                  <p className="text-xs text-yellow-400 mt-1 font-medium">≈ R50/month — best value</p>
                )}
                {plan.id === 3 && (
                  <p className="text-xs text-green-400 mt-1 font-medium">≈ R50/month</p>
                )}
                {plan.id === 2 && (
                  <p className="text-xs text-green-400 mt-1 font-medium">≈ R50/month</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-white/20' : 'bg-purple-500/20'
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.popular ? 'text-white' : 'text-purple-400'}`} />
                    </div>
                    <span className={`text-sm leading-tight ${plan.popular ? 'text-white/90' : 'text-[#8b8aa0]'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  plan.popular
                    ? 'bg-white text-purple-700 hover:bg-white/90'
                    : 'text-white hover:opacity-90'
                }`}
                style={!plan.popular ? { background: 'linear-gradient(135deg, #a855f7, #ec4899)' } : {}}
              >
                Start Free Trial
              </button>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-14 text-center">
          <p className="text-[#8b8aa0] text-sm mb-5">Secure payments via</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['Visa', 'Mastercard', 'PayPal'].map(method => (
              <div
                key={method}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-[#8b8aa0] hover:text-white transition-colors"
                style={{ background: 'var(--card)', border: '1px solid rgba(168,85,247,0.15)' }}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
