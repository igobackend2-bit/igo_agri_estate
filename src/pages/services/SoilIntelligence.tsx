import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplet, Sun, Microscope, TrendingUp } from 'lucide-react';

const SoilIntelligence: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container-pro">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Agronomic Science</span>
          <h1 className="heading-xl text-primary mb-8">Soil <span className="text-secondary italic">Intelligence</span></h1>
          <p className="text-xl text-text-muted font-light leading-relaxed mb-16 max-w-2xl">
            Scientific validation of agricultural assets. We map NPK levels, water table viability, and crop suitability to guarantee ROI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Sprout size={24} />, title: 'NPK Audits', desc: 'Detailed Nitrogen, Phosphorus, and Potassium profiling.' },
            { icon: <Droplet size={24} />, title: 'Water Viability', desc: 'Borewell yield testing and watershed mapping.' },
            { icon: <Sun size={24} />, title: 'Climate Mapping', desc: 'Micro-climate analysis for high-yield horticulture.' }
          ].map((service, i) => (
            <div key={i} className="glass p-10 rounded-[40px] border-white/60 shadow-xl group hover:-translate-y-2 transition-all">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
              <p className="text-text-muted leading-relaxed font-light text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoilIntelligence;
