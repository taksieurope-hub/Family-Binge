import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Play, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Tv className="w-9 h-9 text-purple-500" />
            <span className="text-3xl font-black tracking-tighter">familybinge</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/signup')} className="bg-purple-600 hover:bg-purple-700">Start Free Trial</Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Unlimited Movies,<br />Series &amp; Live TV
          </h1>
          <p className="text-2xl text-gray-400 mb-10">Watch with your whole family. 7 days free.</p>
          
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="text-2xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Start 7-Day Free Trial <ArrowRight className="ml-3" />
          </Button>
        </div>
      </section>

      <div className="py-20 bg-zinc-900 text-center">
        <p className="text-gray-400 text-sm">No credit card required • Cancel anytime</p>
      </div>
    </div>
  );
};

export default LandingPage;