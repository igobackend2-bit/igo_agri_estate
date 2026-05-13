import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Search, Eye, ArrowRight } from 'lucide-react';
import { getLocalVideos, subscribeLocalSync, VIDEO_SYNC_EVENT } from '../lib/localSync';

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState(getLocalVideos());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    return subscribeLocalSync(VIDEO_SYNC_EVENT, () => setVideos(getLocalVideos()));
  }, []);

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-32 bg-[#F8FAFC] min-h-screen">
      <div className="container-pro">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
            >
              Virtual Site Visits
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-lg text-primary mb-6"
            >
              Trending <span className="text-secondary italic font-serif">Footage</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-text-muted leading-relaxed"
            >
              Explore prime estates through drone audits, 360° virtual tours, and on-ground project updates.
            </motion.p>
          </div>
          
          <div className="w-full md:w-80 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-[24px] py-4 pl-14 pr-6 focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {filteredVideos.map((vid, i) => (
            <motion.button
              type="button"
              onClick={() => vid.url ? window.open(vid.url, '_blank', 'noopener,noreferrer') : undefined}
              key={vid.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative aspect-video rounded-[48px] overflow-hidden group cursor-pointer shadow-2xl text-left border border-white/40"
            >
              <img 
                src={vid.thumb} 
                alt={vid.title} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/properties/polyhouse.png';
                }}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[2s]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                  <Play className="text-white fill-white ml-2" size={32} />
                </div>
              </div>
              
              <div className="absolute bottom-12 left-12 right-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-secondary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">Trending</span>
                  <div className="flex items-center text-white/60 text-[10px] font-black uppercase tracking-widest">
                    <Eye size={12} className="mr-1.5" /> {vid.views} Views
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{vid.title}</h3>
                <div className="flex items-center text-secondary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                  Watch Now <ArrowRight size={14} className="ml-2" />
                </div>
              </div>
            </motion.button>
          ))}
          
          {filteredVideos.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[48px] border border-black/5 shadow-inner">
              <TrendingUp className="mx-auto mb-6 text-primary/10" size={64} />
              <p className="text-xl text-text-muted font-light">No videos found matching your request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
