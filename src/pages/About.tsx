import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Users, Landmark } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container-pro">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <p className="text-[10px] font-black text-[#00814a] uppercase tracking-[0.5em] mb-6">Our Legacy</p>
          <h1 className="text-6xl font-black text-primary uppercase tracking-tighter leading-none mb-8">
            The Institution <br />of <span className="text-secondary italic font-serif">Agricultural Land</span>
          </h1>
          <p className="text-xl text-text-muted font-light leading-relaxed">
            IGO Agriestates is India's premier institutional marketplace for managed farmland and agricultural real estate. We bridge the gap between traditional land ownership and modern investment excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tight">Our Mission</h2>
            <p className="text-text-muted leading-relaxed">
              To democratize agricultural land ownership by providing institutional-grade transparency, scientific agronomy support, and secure title management. We believe land is the ultimate asset, and our goal is to make it productive and profitable for every investor.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#00814a]">15+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Years Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#00814a]">5k+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Acres Managed</div>
              </div>
            </div>
          </div>
          <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
             <img 
               src="/images/team-expert-indian.png" 
               alt="About IGO" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-32">
          {[
            { icon: <ShieldCheck className="text-secondary" />, title: 'Title Security', desc: 'Rigorous 30-year title verification for every asset.' },
            { icon: <Target className="text-secondary" />, title: 'Scientific ROI', desc: 'Data-driven crop projections and yield analysis.' },
            { icon: <Users className="text-secondary" />, title: 'Expert Support', desc: 'Dedicated agronomy and legal desks at your service.' },
            { icon: <Landmark className="text-secondary" />, title: 'Compliance', desc: 'Full adherence to state-specific agricultural laws.' }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-white border border-black/5 rounded-[32px] hover:shadow-xl transition-all">
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-lg font-black text-primary uppercase mb-3">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
