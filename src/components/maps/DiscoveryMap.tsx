import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, Info } from 'lucide-react';

const DiscoveryMap: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-[40px] overflow-hidden border border-black/5 shadow-2xl">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-[#e5e7eb] overflow-hidden">
        <svg viewBox="0 0 1000 600" className="w-full h-full opacity-40">
          <path d="M0,100 L1000,100 M0,200 L1000,200 M0,300 L1000,300 M0,400 L1000,400 M0,500 L1000,500" stroke="#fff" strokeWidth="2" />
          <path d="M100,0 L100,600 M200,0 L200,600 M300,0 L300,600 M400,0 L400,600 M500,0 L500,600" stroke="#fff" strokeWidth="2" />
          <circle cx="200" cy="150" r="100" fill="#d1d5db" />
          <circle cx="700" cy="400" r="150" fill="#d1d5db" />
        </svg>

        {/* Floating Property Pins */}
        {[
          { top: '20%', left: '30%', price: '₹1.2 Cr', title: 'Green Valley' },
          { top: '45%', left: '60%', price: '₹4.5 Cr', title: 'Sunrise Vineyard' },
          { top: '70%', left: '25%', price: '₹3.8 Cr', title: 'Teak Estate' },
          { top: '35%', left: '80%', price: '₹2.1 Cr', title: 'Royal Orchard' }
        ].map((pin, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            style={{ top: pin.top, left: pin.left }}
            className="absolute group"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full mb-1 shadow-lg transform group-hover:scale-110 transition-transform">
                {pin.price}
              </div>
              <div className="w-6 h-6 bg-secondary border-4 border-white rounded-full shadow-lg group-hover:bg-primary transition-colors"></div>
              
              {/* Tooltip */}
              <div className="absolute top-full mt-2 w-40 bg-white p-3 rounded-2xl shadow-2xl border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <p className="text-[10px] font-bold text-primary mb-1">{pin.title}</p>
                <div className="flex items-center text-[8px] text-text-muted">
                  <Navigation size={8} className="mr-1" />
                  <span>Tap to view details</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map UI Elements */}
      <div className="absolute top-8 left-8 flex flex-col space-y-4">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl flex flex-col space-y-2 border border-white/20">
          <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors"><Layers size={20} className="text-primary" /></button>
          <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-secondary"><MapPin size={20} /></button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-[32px] shadow-2xl border border-white/20 max-w-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
            <Info size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-primary">Map Discovery Mode</p>
            <p className="text-[10px] text-text-muted">Viewing 4 active estates near your search area.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryMap;
