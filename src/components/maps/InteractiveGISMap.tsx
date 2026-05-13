import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Map as MapIcon, Droplets, Leaf, Navigation } from 'lucide-react';

const InteractiveGISMap: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'terrain' | 'ndvi' | 'water'>('terrain');
  const [notice, setNotice] = useState('');

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  };

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-lg border border-black/5 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold font-serif mb-1">Interactive GIS Intelligence</h3>
          <p className="text-text-muted text-sm">Advanced 3D terrain and agronomy layers</p>
        </div>
        <div className="flex space-x-2 bg-gray-50 p-1.5 rounded-2xl border border-black/5">
          <button 
            onClick={() => setActiveLayer('terrain')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${activeLayer === 'terrain' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-black'}`}
          >
            <MapIcon size={16} /> <span className="hidden md:inline">3D Terrain</span>
          </button>
          <button 
            onClick={() => setActiveLayer('ndvi')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${activeLayer === 'ndvi' ? 'bg-white shadow-sm text-green-600' : 'text-text-muted hover:text-black'}`}
          >
            <Leaf size={16} /> <span className="hidden md:inline">NDVI Health</span>
          </button>
          <button 
            onClick={() => setActiveLayer('water')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${activeLayer === 'water' ? 'bg-white shadow-sm text-blue-500' : 'text-text-muted hover:text-black'}`}
          >
            <Droplets size={16} /> <span className="hidden md:inline">Water Rights</span>
          </button>
        </div>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 group">
        {/* Simulated Map Layer using an image */}
        <motion.img 
          key={activeLayer}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={
            activeLayer === 'terrain' 
              ? 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80' 
              : activeLayer === 'ndvi'
              ? 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80'
              : 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80'
          }
          className={`w-full h-full object-cover ${activeLayer === 'ndvi' ? 'hue-rotate-90 saturate-200 contrast-150' : ''} ${activeLayer === 'water' ? 'hue-rotate-180 brightness-90' : ''}`}
          alt="GIS Map Layer"
        />

        {/* Map UI Overlay Elements */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => showNotice(`Layer active: ${activeLayer}`)}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
            aria-label="Show active GIS layer"
          >
            <Layers size={18} />
          </button>
          <button
            onClick={() => showNotice('Route pinned from Mysuru city center')}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
            aria-label="Show navigation route"
          >
            <Navigation size={18} />
          </button>
        </div>

        {/* Simulated Boundaries */}
        <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-3xl pointer-events-none m-8 mix-blend-overlay"></div>
        
        {/* Layer Legend */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center space-x-6 border border-black/5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-text-muted">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Estate Boundary</span>
          </div>
          {activeLayer === 'water' && (
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-text-muted">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Irrigation Hub</span>
            </div>
          )}
        </div>

        {notice && (
          <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
            {notice}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGISMap;
