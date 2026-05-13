import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, Droplets, Sun, Info, Maximize2 } from 'lucide-react';

const SatelliteHeatmap: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'moisture' | 'soil'>('ndvi');
  const [isExpanded, setIsExpanded] = useState(false);

  const layers = [
    { id: 'ndvi', label: 'Vegetation Index', icon: <Activity size={18} />, color: 'bg-green-500' },
    { id: 'moisture', label: 'Water Stress', icon: <Droplets size={18} />, color: 'bg-blue-500' },
    { id: 'soil', label: 'Soil Health', icon: <Sun size={18} />, color: 'bg-orange-500' }
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center space-x-2">
            <Layers size={24} className="text-secondary" />
            <span>Satellite GIS Analyst</span>
          </h3>
          <p className="text-sm text-text-muted mt-1">Simulated real-time multispectral imaging (Sentinel-2).</p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-black/5">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as 'ndvi' | 'moisture' | 'soil')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeLayer === layer.id 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              {layer.icon}
              <span className="hidden md:inline">{layer.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`relative aspect-video rounded-[32px] overflow-hidden border border-black/5 bg-black/5 group ${isExpanded ? 'fixed inset-4 z-[80] bg-black shadow-2xl' : ''}`}>
        {/* Mock Map Image */}
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Farmland Satellite"
          className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
        />

        {/* Dynamic Heatmap Overlays */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 mix-blend-multiply pointer-events-none transition-colors duration-1000 ${
              activeLayer === 'ndvi' ? 'bg-gradient-to-br from-green-600 via-green-400 to-yellow-300' :
              activeLayer === 'moisture' ? 'bg-gradient-to-br from-blue-700 via-blue-300 to-red-400' :
              'bg-gradient-to-br from-orange-800 via-yellow-500 to-green-600'
            }`}
          ></motion.div>
        </AnimatePresence>

        {/* UI Overlays on Map */}
        <div className="absolute top-6 left-6 flex flex-col space-y-3">
          <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Live Feed</span>
          </div>
          <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">
            Resolution: 10m/px
          </div>
        </div>

        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => setIsExpanded((value) => !value)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-white transition-colors"
            aria-label={isExpanded ? 'Collapse satellite map' : 'Expand satellite map'}
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 glass p-4 rounded-2xl max-w-[150px]">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-black/5 pb-1">Legend</p>
          <div className="space-y-2">
            {[
              { label: 'Optimal', color: activeLayer === 'moisture' ? 'bg-blue-500' : 'bg-green-500' },
              { label: 'Stable', color: 'bg-yellow-400' },
              { label: 'Attention', color: 'bg-red-500' }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-start space-x-4 p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Info size={18} className="text-secondary" />
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          The AI model has detected a <span className="font-bold text-primary">3.2% increase in biomass density</span> compared to last month. Regional water stress levels are currently within the optimal threshold for {activeLayer === 'ndvi' ? 'Teak plantation' : 'specialty crops'}.
        </p>
      </div>
    </div>
  );
};

export default SatelliteHeatmap;
