import React from 'react';
import { Check, Star, Smartphone, Tv } from 'lucide-react';
import { pricingPlans } from '../data/mockData';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-[#141414]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#46d369]/10 text-[#46d369] rounded text-sm font-medium mb-4 border border-[#46d369]/20">
            3-DAY FREE TRIAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Choose Your Plan
          </h2>
          <p className="text-[#757575] text-base max-w-xl mx-auto">
            Start with a 3-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Device info banner */}
        <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
          <div className="flex items-center gap-2 text-[#bcbcbc] text-sm">
            <Tv className="w-4 h-4 text-[#e50914]" />
            <span>Every plan includes 1 TV device</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2 text-[#bcbcbc] text-sm">
            <Smartphone className="w-4 h-4 text-[#e50914]" />
            <span>+ 1 phone as standard</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="text-[#bcbcbc] text-sm">
            <span>Add extra devices for <strong className="text-white">R20/month</strong> each</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded p-6 transition-all duration-200 hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-[#e50914] shadow-xl shadow-[#e50914]/20'
                  : 'bg-[#222] border border-white/10 hover:border-white/25'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5c518] text-black text-xs font-bold rounded-full">
                    <Star className="w-3 h-3 fill-black" /> MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className={`text-xs mb-4 ${plan.popular ? 'text-white/70' : 'text-[#757575]'}`}>{plan.devices}</p>

              <div className="mb-5">
                <span className="text-3xl font-black text-white">R{plan.price}</span>
                <span className={`text-sm ml-1 ${plan.popular ? 'text-white/70' : 'text-[#757575]'}`}>/ month</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-white/20' : 'bg-[#e50914]/20'}`}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-white' : 'text-[#bcbcbc]'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-2.5 rounded text-sm font-bold transition-colors ${
                plan.popular
                  ? 'bg-white hover:bg-white/90 text-[#e50914]'
                  : 'bg-[#e50914] hover:bg-[#f40612] text-white'
              }`}>
                Start Free Trial
              </button>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 text-center">
          <p className="text-[#757575] text-sm mb-4">Accepted payment methods</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['Visa', 'Mastercard', 'PayPal'].map(method => (
              <div key={method} className="px-5 py-2 bg-white/5 border border-white/10 rounded text-[#bcbcbc] text-sm font-medium hover:bg-white/10 transition-colors">
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
