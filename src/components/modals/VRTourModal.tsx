import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Maximize2, Map, Camera, Info } from 'lucide-react';

interface VRTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
}

const VRTourModal: React.FC<VRTourModalProps> = ({ isOpen, onClose, propertyName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/95 backdrop-blur-xl"
          ></motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-black w-full max-w-6xl aspect-video rounded-[40px] overflow-hidden shadow-2xl relative border border-white/10"
          >
            {/* 360 Viewport (Mock) */}
            <div className="absolute inset-0 group">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90" 
                alt="360 Panoroma"
                className="w-full h-full object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[10s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
            </div>

            {/* UI Overlays */}
            <div className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none">
              <div className="flex justify-between items-start pointer-events-auto">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Live 360° Immersive Mode</span>
                  </div>
                  <h2 className="text-4xl text-white font-bold">{propertyName}</h2>
                  <p className="text-white/60 text-sm mt-1">North-West Sector View</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex justify-between items-end pointer-events-auto">
                <div className="flex space-x-4">
                  {[
                    { icon: <RotateCw size={20} />, label: 'Auto-Rotate' },
                    { icon: <Camera size={20} />, label: 'Snapshot' },
                    { icon: <Map size={20} />, label: 'Minimap' }
                  ].map((btn, i) => (
                    <button key={i} className="flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-primary rounded-2xl font-bold text-sm transition-all backdrop-blur-md">
                      {btn.icon}
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl max-w-xs text-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <Info size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Active Point of Interest</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">
                    This sector features our high-yield Teak rows. Planted in 2022 with smart drip irrigation sensors.
                  </p>
                </div>
              </div>
            </div>

            {/* Interaction Hints */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div 
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex flex-col items-center opacity-40"
              >
                <div className="w-16 h-1 bg-white rounded-full mb-2"></div>
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">Drag to Explore</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VRTourModal;
