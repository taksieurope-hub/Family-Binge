import React, { useState, useEffect } from 'react';
import { Play, Radio, ChevronRight, Loader2, Globe, Search } from 'lucide-react';
import { liveTVAPI } from '../services/api';

const LiveTVSection = ({ onPlayChannel }) => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await liveTVAPI.getCategories();
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const res = await liveTVAPI.getChannels(activeCategory.toLowerCase());
        setChannels(res.data.channels || []);
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, [activeCategory]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await liveTVAPI.search(searchQuery);
      setChannels(res.data.channels || []);
      setActiveCategory('');
    } catch (error) {
      console.error('Error searching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels;

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Live TV</h2>
              <p className="text-gray-400">220+ channels streaming 24/7 worldwide</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Channels Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => onPlayChannel(channel)}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                {/* Live Badge */}
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Channel Logo */}
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="hidden items-center justify-center w-full h-full">
                    <Globe className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Channel Info */}
                <div className="text-center">
                  <p className="text-white font-semibold text-sm truncate">{channel.name}</p>
                  <p className="text-gray-400 text-xs">{channel.country}</p>
                  <p className="text-purple-400 text-xs mt-1">CH {channel.number}</p>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No channels found</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '220+', label: 'Live Channels' },
            { value: '60K+', label: 'Movies & Series' },
            { value: '4K', label: 'Ultra HD Quality' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-colors"
            >
              <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {stat.value}
              </p>
              <p className="text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveTVSection;
