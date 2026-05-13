import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Newspaper, Search } from 'lucide-react';
import { getLocalBlogs, subscribeLocalSync, BLOG_SYNC_EVENT } from '../lib/localSync';

const BlogsPage: React.FC = () => {
  const [posts, setPosts] = useState(getLocalBlogs());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    return subscribeLocalSync(BLOG_SYNC_EVENT, () => setPosts(getLocalBlogs()));
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container-pro">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
            >
              Agri-Insights Hub
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-lg text-primary mb-6"
            >
              Market <span className="text-secondary italic font-serif">Intelligence</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-text-muted leading-relaxed"
            >
              Deep dives into Bio-CNG integration, state-wise land laws, and sustainable farming models.
            </motion.p>
          </div>
          
          <div className="w-full md:w-80 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-[24px] py-4 pl-14 pr-6 focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post, i) => (
            <motion.article
              key={post.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] overflow-hidden border border-black/5 shadow-xl group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-black/5">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">
                  <div className="flex items-center"><User size={12} className="mr-1 text-secondary" /> {post.author}</div>
                  <div className="flex items-center"><Calendar size={12} className="mr-1 text-secondary" /> {post.date}</div>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-primary group-hover:text-secondary transition-colors leading-tight line-clamp-2">{post.title}</h3>
                <div className="mt-auto flex items-center font-black text-[10px] uppercase tracking-widest text-primary group-hover:text-secondary transition-all">
                  Read Full Article <ArrowRight size={16} className="ml-3 group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[48px] border border-black/5 shadow-inner">
              <Newspaper className="mx-auto mb-6 text-primary/10" size={64} />
              <p className="text-xl text-text-muted font-light">No articles match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
