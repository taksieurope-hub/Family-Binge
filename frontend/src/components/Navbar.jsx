import React, { useState, useEffect, useRef } from 'react';
import { Tv, Search, X, Loader2, Film, Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import { searchAPI } from '../services/api';

const Navbar = ({ activeSection, setActiveSection, onSelectContent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'pricing', label: 'Pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) { setShowResults(false); }
      if (profileRef.current && !profileRef.current.contains(e.target)) { setProfileOpen(false); }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowResults(false); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchAPI.searchAll(searchQuery);
        setSearchResults(res.data.items || []);
        setShowResults(true);
      } catch (e) { console.error(e); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (item) => {
    onSelectContent(item);
    setSearchQuery(''); setSearchResults([]); setShowResults(false); setSearchOpen(false);
  };

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); setShowResults(false); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-purple-500/10 shadow-lg shadow-black/50'
        : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-10 h-16 md:h-[68px]">

        {/* Logo */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <button onClick={() => setActiveSection('home')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              familybinge<span className="grad-text">TV</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'text-white bg-white/5'
                    : 'text-[#8b8aa0] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: 'rgba(26,26,36,0.95)', borderColor: 'rgba(168,85,247,0.3)' }}>
                <Search className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search movies, series..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-44 md:w-56 placeholder-[#8b8aa0]"
                />
                {searching && <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />}
                <button onClick={closeSearch}><X className="w-4 h-4 text-[#8b8aa0] hover:text-white" /></button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-[#8b8aa0] hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Dropdown */}
            {showResults && (
              <div
                className="absolute top-full right-0 mt-2 w-80 md:w-[420px] rounded-xl overflow-hidden z-[60]"
                style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(168,85,247,0.1)' }}
              >
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-purple-500/10">
                      <span className="text-[#8b8aa0] text-xs uppercase tracking-widest">{searchResults.length} results</span>
                    </div>
                    <div className="max-h-[65vh] overflow-y-auto">
                      {searchResults.slice(0, 12).map(item => (
                        <div
                          key={`${item.type}-${item.id}`}
                          onClick={() => handleResultClick(item)}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 last:border-0 hover:bg-purple-500/10"
                        >
                          <div className="w-14 h-20 rounded-lg overflow-hidden bg-[#1a1a24] flex-shrink-0 border border-purple-500/10">
                            {item.poster ? (
                              <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Film className="w-6 h-6 text-[#8b8aa0]" /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="badge badge-grad text-[10px] px-2 py-0.5">{item.type === 'series' ? 'Series' : 'Movie'}</span>
                              <span className="text-[#8b8aa0] text-xs">{item.year}</span>
                              {item.rating > 0 && <span className="text-yellow-400 text-xs font-medium">★ {item.rating}</span>}
                            </div>
                            {item.genres?.length > 0 && (
                              <p className="text-[#8b8aa0] text-xs mt-1 truncate">{item.genres.slice(0,2).join(' · ')}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : searchQuery.trim() && !searching ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[#8b8aa0] text-sm">No results for "<span className="text-white">{searchQuery}</span>"</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Bell */}
          <button className="hidden sm:flex p-2.5 rounded-xl text-[#8b8aa0] hover:text-white hover:bg-white/5 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-pink-500" />
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                G
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8b8aa0] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
                {[{ icon: User, label: 'Account' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-3 px-4 py-3 text-[#8b8aa0] hover:text-white hover:bg-purple-500/10 transition-colors text-sm">
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
                <div className="border-t border-purple-500/10" />
                <button className="w-full flex items-center gap-3 px-4 py-3 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Free Trial button */}
          <button
            onClick={() => setActiveSection('pricing')}
            className="hidden sm:flex btn-grad px-4 py-2 rounded-xl text-sm text-white font-semibold"
          >
            Free Trial
          </button>

          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-[#8b8aa0] hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden mx-4 mb-3 rounded-xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.2)' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setMobileOpen(false); }}
              className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors border-b border-purple-500/10 last:border-0 ${
                activeSection === item.id ? 'text-white bg-purple-500/10' : 'text-[#8b8aa0] hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="p-4 border-t border-purple-500/10">
            <button
              onClick={() => { setActiveSection('pricing'); setMobileOpen(false); }}
              className="w-full btn-grad py-2.5 rounded-xl text-sm text-white font-semibold"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
