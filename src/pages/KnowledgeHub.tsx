import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, Landmark, Droplets, Leaf, FileText, HelpCircle, ChevronRight } from 'lucide-react';

const KnowledgeHub: React.FC = () => {
  const topics = [
    { title: "Legal & Titles", icon: <ShieldCheck className="text-blue-500" />, count: "12 Guides", desc: "Understanding 7/12 extract, RTC, and sale deeds." },
    { title: "Tax Optimization", icon: <Landmark className="text-orange-500" />, count: "8 Guides", desc: "Maximizing benefits under Section 1031 and capital gains." },
    { title: "Sustainable Farming", icon: <Leaf className="text-emerald-500" />, count: "15 Guides", desc: "Regenerative agriculture and organic certification." },
    { title: "Water Management", icon: <Droplets className="text-blue-400" />, count: "6 Guides", desc: "Drip irrigation and rainwater harvesting techniques." }
  ];

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">Educational Resource</span>
          <h1 className="text-5xl md:text-7xl mb-6">Agri <span className="text-secondary italic">Knowledge Hub</span></h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12">Everything you need to know about agricultural investment, legal compliance, and farming excellence.</p>
          
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search for 'Section 1031', 'Title Deed', 'ROI'..." 
              className="w-full bg-white border border-black/5 rounded-[32px] px-8 py-6 text-lg shadow-2xl shadow-primary/5 outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-light"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-[20px] font-bold text-sm">
              Search
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {topics.map((topic, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {topic.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{topic.title}</h3>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">{topic.count}</p>
              <p className="text-sm text-text-muted leading-relaxed mb-6">{topic.desc}</p>
              <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-2 transition-transform">
                Browse Guides <ChevronRight size={16} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-primary p-12 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <FileText size={32} className="text-secondary" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Legal Checklist for New Investors</h2>
              <p className="text-white/60 mb-10 leading-relaxed">Download our comprehensive PDF guide on verifying agricultural land titles in India.</p>
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-secondary hover:text-white transition-all transform hover:scale-105 shadow-xl shadow-black/20">
                Download PDF Guide
              </button>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[50px] border border-black/5 shadow-xl">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                <HelpCircle size={28} />
              </div>
              <h2 className="text-3xl font-bold">Frequently Asked</h2>
            </div>
            <div className="space-y-6">
              {[
                "Is agricultural land a safe investment?",
                "Can non-farmers buy agricultural land?",
                "What is the average ROI for managed timber?"
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                  <span className="font-bold text-primary group-hover:text-secondary">{q}</span>
                  <ChevronRight size={20} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;
