import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Film, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { searchAPI } from '../services/api';

const Navbar = ({ activeSection, setActiveSection, onSelectContent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'TV Shows' },
    { id: 'pricing', label: 'Plans' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
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
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (item) => {
    onSelectContent(item);
    // Clear search completely
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSearchOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 h-16 md:h-[68px]">
        {/* Logo */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <button
            onClick={() => setActiveSection('home')}
            className="text-[#e50914] font-black text-2xl md:text-3xl tracking-tighter select-none"
            style={{ fontFamily: 'Impact, "Arial Narrow", Arial, sans-serif', letterSpacing: '-1px' }}
          >
            familybinge
          </button>
          <div className="hidden md:flex items-center gap-5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`text-sm transition-colors ${activeSection === item.id ? 'text-white font-medium' : 'text-[#e5e5e5] hover:text-white/70'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-black/90 border border-white/40 px-3 py-1.5 rounded">
                <Search className="w-4 h-4 text-white flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-48 md:w-64 placeholder-white/50"
                />
                {searching && <Loader2 className="w-4 h-4 text-white animate-spin flex-shrink-0" />}
                <button onClick={closeSearch}>
                  <X className="w-4 h-4 text-white/70 hover:text-white" />
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-1 hover:text-white/70 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Search results dropdown - fully opaque */}
            {showResults && (
              <div className="absolute top-full right-0 mt-2 w-80 md:w-[420px] bg-[#141414] border border-white/15 shadow-2xl rounded z-[60]" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.9)' }}>
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <span className="text-[#757575] text-xs uppercase tracking-widest">{searchResults.length} results</span>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto">
                      {searchResults.slice(0, 12).map(item => (
                        <div
                          key={`${item.type}-${item.id}`}
                          onClick={() => handleResultClick(item)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/8 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Bigger poster */}
                          <div className="w-14 h-20 rounded overflow-hidden bg-[#2f2f2f] flex-shrink-0">
                            {item.poster ? (
                              <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-6 h-6 text-[#757575]" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[#e50914] text-xs font-medium">{item.type === 'series' ? 'Series' : 'Movie'}</span>
                              <span className="text-[#757575] text-xs">{item.year}</span>
                              {item.rating > 0 && <span className="text-[#46d369] text-xs font-medium">{item.rating}★</span>}
                            </div>
                            {item.genres?.length > 0 && (
                              <p className="text-[#757575] text-xs mt-0.5 truncate">{item.genres.slice(0,2).join(' · ')}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : searchQuery.trim() && !searching ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[#757575] text-sm">No results for "<span className="text-white">{searchQuery}</span>"</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <button className="hidden sm:flex p-1 hover:text-white/70 transition-colors relative">
            <Bell className="w-5 h-5 text-white" />
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1">
              <div className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center text-white font-bold text-sm">G</div>
              <ChevronDown className={`w-3 h-3 text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#181818] border border-white/10 shadow-2xl rounded overflow-hidden">
                {[{ icon: User, label: 'Account' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-3 px-4 py-3 text-[#e5e5e5] hover:text-white hover:bg-white/5 transition-colors text-sm">
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
                <div className="border-t border-white/10" />
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[#e5e5e5] hover:text-white hover:bg-white/5 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile nav */}
          <div className="md:hidden flex items-center gap-3">
            {navItems.slice(1).map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`text-xs transition-colors ${activeSection === item.id ? 'text-white font-medium' : 'text-[#e5e5e5]'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
