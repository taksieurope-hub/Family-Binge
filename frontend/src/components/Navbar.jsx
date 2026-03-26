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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0" onClick={() => setActiveSection('home')}>
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
                onClick={() => setActiveSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right Actions */}
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
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {[{ icon: User, label: 'My Account' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
                    <button key={label} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm">
                      <Icon className="w-4 h-4" />{label}
                    </button>
                  ))}
                  <div className="border-t border-white/10" />
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm">Sign Out</button>
                </div>
              )}
            </div>

            <Button onClick={() => setActiveSection('pricing')} className="hidden sm:flex bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white border-0 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all">
              Free Trial
            </Button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div ref={searchRef} className="pb-4 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies, series, channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all text-sm"
                autoFocus
              />
              {searching && <Loader2 className="absolute right-12 w-4 h-4 text-purple-400 animate-spin" />}
              <button onClick={handleSearchClose} className="absolute right-3 p-1 text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-gray-950/98 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-md">
                <div className="px-4 py-2 border-b border-white/5">
                  <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">{searchResults.length} Results</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.slice(0, 10).map((item) => (
                    <div key={`${item.type}-${item.id}`} onClick={() => handleResultClick(item)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 cursor-pointer transition-colors border-b border-white/5 last:border-0 group">
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 ring-1 ring-white/10">
                        {item.poster ? (
                          <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Film className="w-5 h-5 text-gray-600" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded text-purple-400 text-xs font-medium">
                            {item.type === 'series' ? 'Series' : 'Movie'}
                          </span>
                          <span className="text-gray-500 text-xs">{item.year}</span>
                          {item.rating > 0 && <span className="text-yellow-500 text-xs">★ {item.rating}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResults && searchResults.length === 0 && searchQuery.trim() && !searching && (
              <div className="absolute left-0 right-0 mt-2 bg-gray-950/98 border border-white/10 rounded-xl p-8 text-center backdrop-blur-md z-50">
                <Film className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No results for <span className="text-white">"{searchQuery}"</span></p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col bg-gray-950/95 backdrop-blur-md rounded-2xl border border-white/8 overflow-hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-5 py-3.5 text-left font-medium transition-colors border-b border-white/5 last:border-0 ${
                    activeSection === item.id ? 'text-white bg-purple-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                </button>
              ))}
              <div className="p-4 border-t border-white/5">
                <Button onClick={() => { setActiveSection('pricing'); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white border-0 font-semibold rounded-xl">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;