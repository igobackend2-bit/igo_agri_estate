import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Search, Info } from 'lucide-react';
import AIInvestmentReport from '../components/property/AIInvestmentReport';
import { useProperties } from '../hooks/useProperties';
import type { Property } from '../types';

const AIReportPage: React.FC = () => {
  const { publicProperties } = useProperties();
  const [selectedProperty, setSelectedProperty] = React.useState<Property | undefined>(publicProperties[0]);

  React.useEffect(() => {
    if (publicProperties.length > 0 && !selectedProperty) {
      setSelectedProperty(publicProperties[0]);
    }
  }, [publicProperties, selectedProperty]);

  if (publicProperties.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center">
        <p className="text-text-muted">No estates available for analysis.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block"
          >
            Institutional Advisory
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            AI Land <span className="text-secondary italic">Price Report</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-xl max-w-2xl mx-auto"
          >
            Get a comprehensive investment audit including land score, sentiment analysis, and risk profiling powered by IGO Agri Tech.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Property Selector */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Search size={20} className="text-secondary" />
                <span>Select Estate</span>
              </h3>
               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 {publicProperties.map((prop) => (
                   <button
                     key={prop.id}
                     onClick={() => setSelectedProperty(prop)}
                     className={`w-full text-left p-4 rounded-2xl border transition-all ${
                       selectedProperty?.id === prop.id 
                         ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' 
                         : 'border-black/5 hover:border-secondary/30'
                     }`}
                   >
                     <p className="font-bold text-primary text-sm mb-1">{prop.title}</p>
                     <p className="text-[10px] text-text-muted uppercase tracking-widest">{prop.location}</p>
                   </button>
                 ))}
               </div>
            </div>

            <div className="bg-primary p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <Info className="text-secondary mb-4" size={24} />
               <h4 className="font-bold mb-2">How it works</h4>
               <p className="text-white/60 text-xs leading-relaxed font-light">
                 Our AI engine analyzes 30+ parameters including soil health, water table, legal title history, and regional appreciation trends to generate your advisory report.
               </p>
            </div>
          </div>

          {/* Report Display */}
          <div className="lg:col-span-8">
            {selectedProperty && <AIInvestmentReport property={selectedProperty} />}
            
            <div className="mt-12 p-8 bg-secondary/5 rounded-[40px] border border-secondary/10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Need a detailed site audit?</h4>
                    <p className="text-sm text-text-muted">Talk to our experts for a personalized 1-on-1 walkthrough.</p>
                  </div>
               </div>
               <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-secondary transition-all flex items-center space-x-2 shadow-xl shadow-primary/20">
                  <span>Contact Advisor</span>
                  <ArrowRight size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReportPage;
