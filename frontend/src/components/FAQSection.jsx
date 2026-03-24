import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqData } from '../data/mockData';

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState(faqData[0].category);
  const [openQuestion, setOpenQuestion] = useState(null);

  const currentCategory = faqData.find(cat => cat.category === activeCategory);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            <span className="text-purple-400 font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            You Bring the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Question
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            We deliver the answer
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {faqData.map((category) => (
            <button
              key={category.category}
              onClick={() => {
                setActiveCategory(category.category);
                setOpenQuestion(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {currentCategory?.questions.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
            >
              <button
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                    openQuestion === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openQuestion === index && (
                <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                  <div className="h-px bg-white/10 mb-4" />
                  <p className="text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Contact our support team
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
