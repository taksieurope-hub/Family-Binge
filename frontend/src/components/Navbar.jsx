import React, { useState, useEffect, useRef } from 'react';
import { Tv, Menu, X, Search, User, ChevronDown, Loader2, Film, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { searchAPI } from '../services/api';

const Navbar = ({ activeSection, setActiveSection, onSelectContent }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'live-tv', label: 'Live TV' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'download', label: 'Download' },
    { id: 'pricing', label: 'Pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Search functionality (unchanged)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchAPI.searchAll(searchQuery);
        setSearchResults(res.data.items || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (item) => {
    onSelectContent(item);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSearchOpen(false);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0" onClick={() => scrollToSection('home')}>
            <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">familybinge<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">TV</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === item.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right side (search, bell, user, etc.) - unchanged */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!searchOpen && (
              <button onClick={() => setSearchOpen(true)} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Search">
                <Search className="w-5 h-5" />
              </button>
            )}
            <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div ref={userMenuRef} className="hidden sm:block relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* user menu remains the same */}
            </div>

            <Button onClick={() => scrollToSection('pricing')} className="hidden sm:flex bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white border-0 px-4 py-2 text-sm font-semibold rounded-xl">
              Free Trial
            </Button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar and mobile menu - keep your existing code here if you want, but the main fix is above */}

      </div>
    </nav>
  );
};

export default Navbar;