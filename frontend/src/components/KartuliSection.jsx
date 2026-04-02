import React, { useState, useEffect, useRef } from 'react';
import { Film, Tv, Loader2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { georgianAPI } from '../services/api';

const ContentRow = ({ title, icon: Icon, items, onSelectContent, loading, accent }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });

  if (loading) return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${accent}/30 rounded-lg`}><Icon className={`w-5 h-5 ${accent.replace('bg-', 'text-')}`} /></div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
    </div>
  );

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${accent}/30 rounded-lg`}><Icon className={`w-5 h-5 ${accent.replace('bg-', 'text-')}`} /></div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white" /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {items.map(item => (
          <div key={`${item.type}-${item.id}`} onClick={() => onSelectContent(item)} className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-105">
              {item.poster
                ? <img src={item.poster} alt={item.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
                : <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center"><Film className="w-8 h-8 text-gray-600" /></div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-white text-xs font-bold">{item.rating}</span></div>
              </div>
            </div>
            <p className="text-white text-sm font-semibold truncate">{item.title}</p>
            <p className="text-gray-400 text-xs">{item.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const KartuliSection = ({ onSelectContent }) => {
  const [geoMovies, setGeoMovies] = useState([]);
  const [geoSeries, setGeoSeries] = useState([]);
  const [ruMovies, setRuMovies] = useState([]);
  const [ruSeries, setRuSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const handleWatch = (item) => {
    const query = encodeURIComponent(item.title);
    window.open('https://www.google.com/search?q=' + query + '+watch+online+georgian', '_blank');
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [gm, gs, rm, rs] = await Promise.all([
          georgianAPI.getMovies(),
          georgianAPI.getSeries(),
          georgianAPI.getRussianMovies(),
          georgianAPI.getRussianSeries(),
        ]);
        setGeoMovies(gm.data.items || []);
        setGeoSeries(gs.data.items || []);
        setRuMovies(rm.data.items || []);
        setRuSeries(rs.data.items || []);
      } catch (e) {
        console.error('Kartuli load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'geo', label: 'Georgian' },
    { id: 'ru', label: 'Russian' },
  ];

  return (
    <div className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-600 to-orange-500 p-3 rounded-xl shadow-lg">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Kartuli</h2>
            <p className="text-gray-400 text-sm">Georgian and Russian movies, series and content</p>
          </div>
        </div>
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {(activeTab === 'all' || activeTab === 'geo') && (
          <>
            <ContentRow title="Georgian Movies" icon={Film} items={geoMovies} onSelectContent={handleWatch} loading={loading} accent="bg-red-600" />
            <ContentRow title="Georgian Series" icon={Tv} items={geoSeries} onSelectContent={handleWatch} loading={loading} accent="bg-red-600" />
          </>
        )}
        {(activeTab === 'all' || activeTab === 'ru') && (
          <>
            <ContentRow title="Russian Movies" icon={Film} items={ruMovies} onSelectContent={handleWatch} loading={loading} accent="bg-orange-600" />
            <ContentRow title="Russian Series" icon={Tv} items={ruSeries} onSelectContent={handleWatch} loading={loading} accent="bg-orange-600" />
          </>
        )}
        {!loading && geoMovies.length === 0 && geoSeries.length === 0 && ruMovies.length === 0 && ruSeries.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No content available right now</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KartuliSection;
