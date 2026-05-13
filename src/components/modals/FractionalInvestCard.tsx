import React, { useState } from 'react';
import { PieChart, TrendingUp, DollarSign, ArrowRight, Info } from 'lucide-react';

interface FractionalInvestCardProps {
  propertyPrice: string; // e.g., "1.2 Cr"
  roi: string;
}

const FractionalInvestCard: React.FC<FractionalInvestCardProps> = ({ propertyPrice, roi }) => {
  const [shares, setShares] = useState(10); // 10% default
  const [confirmed, setConfirmed] = useState(false);
  
  // Convert price string to number for calculation (simplified)
  const baseValue = parseFloat(propertyPrice) * 10000000; // Assuming Cr to INR
  const shareValue = (baseValue * (shares / 100));
  
  return (
    <div className="bg-primary text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold flex items-center">
              <PieChart size={24} className="text-secondary mr-2" />
              Fractional Invest
            </h3>
            <p className="text-white/60 text-sm mt-1">Co-own this estate via smart contract</p>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
            Live
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Your Ownership Stake</p>
              <p className="text-4xl font-bold text-secondary">{shares}%</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Investment Amount</p>
              <p className="text-2xl font-bold">₹ {(shareValue / 100000).toFixed(2)} L</p>
            </div>
          </div>
          
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={shares} 
            onChange={(e) => setShares(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-secondary"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-2 font-bold">
            <span>1% (MIN)</span>
            <span>100% (FULL OWNERSHIP)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="flex items-center text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              <TrendingUp size={14} className="mr-1" /> Est. Annual Return
            </div>
            <p className="text-xl font-bold">{roi}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="flex items-center text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              <DollarSign size={14} className="mr-1" /> Projected Income
            </div>
            <p className="text-xl font-bold text-secondary">
              ₹ {((shareValue * (parseFloat(roi) / 100)) / 100000).toFixed(2)} L <span className="text-xs text-white/60 font-normal">/yr</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setConfirmed(true)}
          className="w-full bg-secondary text-white py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all flex items-center justify-center space-x-2 group"
        >
          <span>{confirmed ? 'Smart Contract Request Sent' : 'Purchase Smart Contract'}</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-[10px] text-white/40 mt-4 flex items-center justify-center">
          <Info size={12} className="mr-1" />
          Secured by Polygon Blockchain. Read terms before investing.
        </p>
      </div>
    </div>
  );
};

export default FractionalInvestCard;
