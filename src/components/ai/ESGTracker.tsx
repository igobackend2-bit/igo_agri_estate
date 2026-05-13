import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, ShieldCheck, Zap, Droplets, Wind } from 'lucide-react';

interface ESGTrackerProps {
  carbonOffset?: string;
  waterSaved?: string;
  renewableEnergy?: string;
  esgScore?: number;
}

const ESGTracker: React.FC<ESGTrackerProps> = ({
  carbonOffset = "12.5 Tons",
  waterSaved = "450k Liters",
  renewableEnergy = "85%",
  esgScore = 94
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'IGO_ESG_Report_2026.pdf';
    alert('Preparing your Elite ESG Report... The download will begin shortly.');
    setTimeout(() => {
      // In a real app, this would be a real file URL
      console.log('Downloading ESG Report...');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-xl relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-green-500/10 transition-colors duration-700"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
              <Leaf size={20} />
            </div>
            <h3 className="text-3xl font-bold">The Green <span className="text-secondary italic">Ledger</span></h3>
          </div>
          <p className="text-text-muted">Real-time ESG performance and Carbon Sequestration metrics.</p>
        </div>
        
        <div className="bg-primary p-6 rounded-3xl text-white text-center min-w-[160px] shadow-2xl relative">
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary border-4 border-white">
            <ShieldCheck size={16} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">ESG Score</p>
          <p className="text-5xl font-bold leading-none">{esgScore}</p>
          <p className="text-xs font-bold text-secondary mt-2 uppercase tracking-tighter">Elite Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        {[
          { label: 'Carbon Offset', val: carbonOffset, icon: <Globe className="text-secondary" />, sub: 'Annualized' },
          { label: 'Water Savings', val: waterSaved, icon: <Droplets className="text-blue-500" />, sub: 'Smart Irrigation' },
          { label: 'Renewable Power', val: renewableEnergy, icon: <Zap className="text-accent" />, sub: 'Solar Array' },
          { label: 'Biodiversity', val: 'High', icon: <Wind className="text-emerald-600" />, sub: 'Verified Index' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              {item.icon}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{item.label}</p>
            <p className="text-xl font-bold text-primary">{item.val}</p>
            <p className="text-[10px] font-bold text-text-muted/60 mt-1">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-primary text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" opacity="0.3" />
            <path d="M0,60 Q25,40 50,60 T100,60 V100 H0 Z" opacity="0.2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Globe size={32} className="text-secondary animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Net-Zero Commitment</h4>
              <p className="text-white/60 text-sm">Your investment has offset the equivalent of <span className="text-secondary font-bold">1,200 air travel hours</span> this year.</p>
            </div>
          </div>
          <button 
            onClick={handleDownload}
            className="bg-white text-primary px-8 py-3 rounded-2xl font-bold text-sm hover:bg-secondary hover:text-white transition-all transform hover:scale-105"
          >
            Download ESG Report
          </button>
        </div>
      </div>
    </div>
  );
};


export default ESGTracker;
