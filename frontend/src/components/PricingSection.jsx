import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { pricingPlans } from '../data/mockData';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-600/20 text-green-400 rounded-full text-sm font-medium mb-4">
            START FREE TRIAL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Favorite Plan
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            But first, enjoy our 7-days FREE TRIAL. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 hover:border-purple-500/50'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                    <Star className="w-3 h-3 fill-black" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-300 ml-2">/ {plan.currency}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-purple-600/30'
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className={plan.popular ? 'text-white' : 'text-gray-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full py-6 text-lg font-semibold ${
                  plan.popular
                    ? 'bg-white hover:bg-gray-100 text-purple-600'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } border-0 transition-colors`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Trusted payment methods</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['Visa', 'Mastercard', 'M-Pesa', 'PayPal'].map((method) => (
              <div
                key={method}
                className="px-6 py-3 bg-white/5 rounded-lg text-gray-300 font-medium hover:bg-white/10 transition-colors"
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Reseller CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8 sm:p-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <span className="text-yellow-500 font-semibold">BOOST YOUR EARNINGS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Want to Become a Reseller?
          </h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Operate from the convenience of your home. Write to us and start your venture with Waka TV!
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
