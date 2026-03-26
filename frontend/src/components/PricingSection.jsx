import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from './ui/button';

const pricingPlans = [
  {
    id: 1,
    name: "Basic",
    price: "99",
    period: "1 month",
    devices: "1 TV + 1 Phone",
    popular: false,
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "HD Quality",
      "1 TV device + 1 Phone",
      "+R20/month per extra device"
    ]
  },
  {
    id: 2,
    name: "Standard",
    price: "249",
    period: "3 months (˜ R83/month)",
    devices: "1 TV + 1 Phone (Upgraded)",
    popular: true,
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "Full HD Quality",
      "1 TV devices + 1 Phones (Upgraded)",
      "+R20/month per extra device"
    ]
  },
  {
    id: 3,
    name: "Premium (The High Roller)",
    price: "399",
    period: "6 months (˜ R66/month)",
    devices: "2 TV + 2 Phones (Upgraded)",
    popular: false,
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "4K Quality",
      "2 TV devices + 2 Phones (Upgraded)",
      "+R20/month per extra device"
    ]
  },
  {
    id: 4,
    name: "Annual (The Best Value) Family",
    price: "599",
    period: "12 months (˜ R50/month)",
    devices: "5 TV + 5 Phones (Ultimate Family Plan)",
    popular: false,
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "4K Quality",
      "5 TV devices + 5 Phones",
      "Best value — save R589/yr",
      "Priority support (Included)"
    ]
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-600/20 text-green-400 rounded-full text-sm font-medium mb-4">
            START FREE TRIAL
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-br from-green-500 to-blue-500 shadow-lg shadow-green-500/30'
                  : 'bg-zinc-900 border border-white/10 hover:border-green-500/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R{plan.price}</span>
                <span className="text-gray-400 ml-2">/{plan.period}</span>
              </div>

              <p className="text-green-400 mb-6">{plan.devices}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="w-full py-6 text-lg font-semibold bg-white text-black hover:bg-gray-100">
                Start Free Trial
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
