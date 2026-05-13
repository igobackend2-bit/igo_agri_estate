import React from 'react';
import { motion } from 'framer-motion';

// Mock data for the candlestick chart
const data = Array.from({ length: 30 }).map((_, i) => {
  const base = 100 + Math.sin(i * 0.5) * 20 + i * 2;
  const open = base + (Math.random() - 0.5) * 10;
  const close = open + (Math.random() - 0.5) * 15;
  const high = Math.max(open, close) + Math.random() * 10;
  const low = Math.min(open, close) - Math.random() * 10;
  return { open, close, high, low };
});

const CandlestickChart: React.FC = () => {
  const max = Math.max(...data.map(d => d.high)) + 10;
  const min = Math.min(...data.map(d => d.low)) - 10;
  const range = max - min;

  return (
    <div className="w-full h-64 flex items-end justify-between px-2 pb-8 pt-4 relative border-b border-l border-white/10">
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-px bg-white/5 relative">
            <span className="absolute -left-10 -top-3 text-[10px] text-white/40">
              ₹{(max - (range / 4) * i).toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 w-full flex justify-between text-[10px] text-white/40 px-2">
        <span>09:00 AM</span>
        <span>12:00 PM</span>
        <span>03:00 PM</span>
        <span>Close</span>
      </div>

      <div className="flex w-full h-full items-end justify-between space-x-1 relative z-10">
        {data.map((d, i) => {
          const isUp = d.close >= d.open;
          const color = isUp ? 'bg-secondary' : 'bg-red-500';
          
          const highPos = ((max - d.high) / range) * 100;
          const lowPos = ((max - d.low) / range) * 100;
          const openPos = ((max - d.open) / range) * 100;
          const closePos = ((max - d.close) / range) * 100;
          
          const top = Math.min(openPos, closePos);
          const height = Math.abs(openPos - closePos);
          
          return (
            <div key={i} className="relative flex-1 flex flex-col items-center group h-full cursor-crosshair">
              {/* Wick */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: `${lowPos - highPos}%` }}
                transition={{ delay: i * 0.02 }}
                className={`absolute w-px ${color} opacity-50`}
                style={{ top: `${highPos}%` }}
              />
              {/* Body */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: `${Math.max(height, 1)}%` }}
                transition={{ delay: i * 0.02 }}
                className={`absolute w-full max-w-[8px] rounded-sm ${color} group-hover:brightness-125`}
                style={{ top: `${top}%` }}
              />
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-white text-black text-[10px] p-2 rounded-lg pointer-events-none z-50 whitespace-nowrap shadow-xl">
                O: {d.open.toFixed(1)}<br/>
                C: {d.close.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandlestickChart;
