import React from 'react';
import { motion } from 'framer-motion';

const OrderBook: React.FC = () => {
  const asks = [
    { price: '1.28L', amount: 15, total: '19.2L' },
    { price: '1.27L', amount: 42, total: '53.3L' },
    { price: '1.26L', amount: 120, total: '151.2L' },
    { price: '1.25L', amount: 8, total: '10.0L' },
  ].reverse();

  const bids = [
    { price: '1.24L', amount: 55, total: '68.2L' },
    { price: '1.23L', amount: 210, total: '258.3L' },
    { price: '1.22L', amount: 45, total: '54.9L' },
    { price: '1.21L', amount: 12, total: '14.5L' },
  ];

  return (
    <div className="text-sm font-mono text-white">
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 mb-2 border-b border-white/10 pb-2">
        <span>Price (INR)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="space-y-1 mb-4">
        {asks.map((ask, i) => (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={`ask-${i}`} 
            className="flex justify-between relative group cursor-pointer hover:bg-white/5"
          >
            <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${(ask.amount / 210) * 100}%` }}></div>
            <span className="text-red-400 font-bold z-10">{ask.price}</span>
            <span className="z-10 text-white/80">{ask.amount}</span>
            <span className="z-10 text-white/60">{ask.total}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center py-2 border-y border-white/10 mb-4 bg-white/5">
        <span className="text-xl font-bold text-secondary mr-2">1.24L</span>
        <span className="text-xs text-white/60">Spread: 0.01L</span>
      </div>

      <div className="space-y-1">
        {bids.map((bid, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={`bid-${i}`} 
            className="flex justify-between relative group cursor-pointer hover:bg-white/5"
          >
            <div className="absolute left-0 top-0 h-full bg-secondary/10" style={{ width: `${(bid.amount / 210) * 100}%` }}></div>
            <span className="text-secondary font-bold z-10">{bid.price}</span>
            <span className="z-10 text-white/80">{bid.amount}</span>
            <span className="z-10 text-white/60">{bid.total}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
