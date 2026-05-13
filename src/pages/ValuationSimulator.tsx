import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MapPin, Maximize, Sprout, ArrowRight, Sparkles, ShieldCheck, PieChart } from 'lucide-react';

const ValuationSimulator: React.FC = () => {
  const [acres, setAcres] = useState(5);
  const [duration, setDuration] = useState(5);
  const [region, setRegion] = useState('Karnataka');
  const [cropType, setCropType] = useState('Teak');
  const [showResult, setShowResult] = useState(false);

  const regions = [
    { name: 'Karnataka', multiplier: 1.15, description: 'High groundwater, ideal for timber.' },
    { name: 'Maharashtra', multiplier: 1.12, description: 'Excellent for vineyards and horticulture.' },
    { name: 'Tamil Nadu', multiplier: 1.18, description: 'Rich soil, perfect for organic farming.' },
    { name: 'Andhra Pradesh', multiplier: 1.10, description: 'Optimal climate for high-yield grains.' }
  ];

  const crops = [
    { name: 'Teak', yield: 18, risk: 'Low' },
    { name: 'Sandalwood', yield: 22, risk: 'Medium' },
    { name: 'Organic Mango', yield: 12, risk: 'Low' },
    { name: 'Pomegranate', yield: 15, risk: 'Medium' }
  ];

  const calculateROI = () => {
    const basePrice = acres * 1500000; // 15L per acre
    const regMultiplier = regions.find(r => r.name === region)?.multiplier || 1;
    const cropYield = crops.find(c => c.name === cropType)?.yield || 10;
    
    const appreciation = basePrice * (Math.pow(1 + 0.12, duration) - 1); // 12% annual appreciation
    const cropReturns = basePrice * (cropYield / 100) * duration * regMultiplier;
    
    return {
      totalInvestment: basePrice,
      projectedValue: basePrice + appreciation,
      cropRevenue: cropReturns,
      totalReturns: appreciation + cropReturns,
      roi: (((appreciation + cropReturns) / basePrice) * 100).toFixed(1)
    };
  };

  const results = calculateROI();

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block"
          >
            Predictive Intelligence
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            AI Estate <span className="text-secondary italic">Valuator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-xl max-w-2xl mx-auto"
          >
            Estimate your future wealth with our machine-learning model trained on regional land appreciation and crop yield patterns.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Inputs Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-xl">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-bold uppercase tracking-widest text-primary mb-4">
                    <Maximize size={18} className="mr-2 text-secondary" />
                    Land Size ({acres} Acres)
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={acres} 
                    onChange={(e) => setAcres(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2 font-bold">
                    <span>1 ACRE</span>
                    <span>50 ACRES</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold uppercase tracking-widest text-primary mb-4">
                    <MapPin size={18} className="mr-2 text-secondary" />
                    Investment Region
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {regions.map((r) => (
                      <button
                        key={r.name}
                        onClick={() => setRegion(r.name)}
                        className={`p-4 rounded-2xl text-sm font-bold transition-all border ${
                          region === r.name 
                            ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                            : 'bg-white text-primary border-black/5 hover:border-primary/30'
                        }`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted mt-3 uppercase tracking-wider italic">
                    {regions.find(r => r.name === region)?.description}
                  </p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold uppercase tracking-widest text-primary mb-4">
                    <Sprout size={18} className="mr-2 text-secondary" />
                    Primary Crop Type
                  </label>
                  <select 
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-primary appearance-none cursor-pointer"
                  >
                    {crops.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.risk} Risk)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold uppercase tracking-widest text-primary mb-4">
                    <TrendingUp size={18} className="mr-2 text-secondary" />
                    Investment Horizon ({duration} Years)
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="25" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2 font-bold">
                    <span>1 YEAR</span>
                    <span>25 YEARS</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowResult(true)}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-light transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Simulate Valuation</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center bg-primary/5 rounded-[40px] border-2 border-dashed border-primary/20 p-12 text-center"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                    <Sparkles size={40} className="text-secondary animate-pulse" />
                  </div>
                  <h3 className="text-2xl mb-4 font-bold">Ready to see your potential?</h3>
                  <p className="text-text-muted max-w-sm">Adjust the parameters on the left and click simulate to run our proprietary valuation algorithm.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Projected Total Returns</p>
                          <h2 className="text-6xl font-bold">₹{(results.totalReturns / 10000000).toFixed(2)} Cr</h2>
                        </div>
                        <div className="bg-secondary px-6 py-2 rounded-full text-sm font-bold flex items-center">
                          {results.roi}% ROI
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm">
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">Land Appreciation</p>
                          <p className="text-2xl font-bold">₹{(results.projectedValue / 10000000).toFixed(2)} Cr</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm">
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Crop Income</p>
                          <p className="text-2xl font-bold">₹{(results.cropRevenue / 100000).toFixed(2)} L</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-lg">
                      <h4 className="flex items-center font-bold text-primary mb-6">
                        <ShieldCheck size={20} className="mr-2 text-secondary" />
                        IGO Assurance
                      </h4>
                      <ul className="space-y-4">
                        {[
                          'Verified Land Titles',
                          'Scientific Soil Management',
                          'Buyback Guarantee Option',
                          '24/7 Security & Monitoring'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-sm text-text-muted">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-lg">
                      <h4 className="flex items-center font-bold text-primary mb-6">
                        <PieChart size={20} className="mr-2 text-secondary" />
                        Portfolio Impact
                      </h4>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Adding this {acres} acre estate in {region} will hedge your portfolio against inflation by <span className="font-bold text-primary">~4.2%</span> annually compared to traditional equity investments.
                      </p>
                      <button className="mt-6 text-primary text-sm font-bold border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors">
                        Download Detailed PDF Report
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ValuationSimulator;
