import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import { getLocalBlogs, getLocalVideos, subscribeLocalSync, BLOG_SYNC_EVENT, VIDEO_SYNC_EVENT } from '../lib/localSync';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState(getLocalBlogs());
  const [videos, setVideos] = useState(getLocalVideos());

  useEffect(() => {
    const unsubBlogs = subscribeLocalSync(BLOG_SYNC_EVENT, () => setPosts(getLocalBlogs()));
    const unsubVideos = subscribeLocalSync(VIDEO_SYNC_EVENT, () => setVideos(getLocalVideos()));
    return () => {
      unsubBlogs();
      unsubVideos();
    };
  }, []);

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block"
          >
            Agri-Insights
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl mb-6"
          >
            Blogs & <span className="text-secondary italic">Trending Videos</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto"
          >
            Stay updated with the latest market trends, farming technology, and investment strategies.
          </motion.p>
        </div>

        {/* Trending Videos */}
        <section id="videos" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="text-secondary" />
            <h2 className="text-3xl font-bold">Trending Videos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((vid, i) => (
              <motion.button
                type="button"
                onClick={() => vid.url ? window.open(vid.url, '_blank', 'noopener,noreferrer') : undefined}
                key={vid.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-video rounded-[40px] overflow-hidden group cursor-pointer shadow-xl text-left"
              >
                <img 
                  src={vid.thumb} 
                  alt={vid.title} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/properties/polyhouse.png';
                  }}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[2s]" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all">
                    <Play className="text-white fill-white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl font-bold text-white mb-1">{vid.title}</h3>
                  <p className="text-white/60 text-sm">{vid.views} views • Trending Now</p>
                </div>
              </motion.button>
            ))}
            {videos.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-white rounded-[40px] border border-black/5 text-text-muted">
                No videos available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* Latest Articles */}
        <section id="blogs" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <button className="text-primary font-bold border-b-2 border-primary">View All Posts</button>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {posts.map((post, i) => (
              <motion.article
                key={post.id} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-8 group cursor-pointer"
              >
                <div className="w-full md:w-1/2 aspect-square rounded-[32px] overflow-hidden shadow-lg">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">{post.category}</span>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary transition-colors leading-tight">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-text-muted mb-6">
                    <div className="flex items-center"><User size={14} className="mr-1" /> {post.author}</div>
                    <div className="flex items-center"><Calendar size={14} className="mr-1" /> {post.date}</div>
                  </div>
                  <div className="flex items-center font-bold text-primary group-hover:translate-x-2 transition-transform">
                    Read More <ArrowRight size={18} className="ml-2" />
                  </div>
                </div>
              </motion.article>
            ))}
            {posts.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-white rounded-[40px] border border-black/5 text-text-muted">
                No articles available at the moment.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
