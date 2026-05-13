import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Landmark, Map } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Total Properties', val: '1412+', icon: <Home className="text-secondary" /> },
    { label: 'Expert Developers', val: '7+', icon: <Users className="text-secondary" /> },
    { label: 'Modern Townships', val: '4+', icon: <Landmark className="text-secondary" /> },
    { label: 'Prime Locations', val: '12+', icon: <Map className="text-secondary" /> }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[40px] bg-background border border-black/5 text-center group hover:bg-primary hover:text-white transition-all duration-500"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-white/10 transition-colors">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2 tracking-tight">{stat.val}</h3>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
