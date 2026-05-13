import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, AlertTriangle, CheckCircle2, TrendingUp, Info, CloudLightning } from 'lucide-react';

const WeatherRisk: React.FC = () => {
  const [showMatrix, setShowMatrix] = useState(false);
  const forecasts = [
    { day: 'Mon', temp: '32°C', icon: <Sun className="text-accent" />, risk: 'Low' },
    { day: 'Tue', temp: '30°C', icon: <CloudRain className="text-blue-500" />, risk: 'Med' },
    { day: 'Wed', temp: '28°C', icon: <CloudLightning className="text-primary" />, risk: 'High' },
    { day: 'Thu', temp: '31°C', icon: <Sun className="text-accent" />, risk: 'Low' },
    { day: 'Fri', temp: '33°C', icon: <Wind className="text-blue-300" />, risk: 'Low' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-bold flex items-center space-x-2">
            <TrendingUp size={24} className="text-secondary" />
            <span>Weather & Farm Risk Review</span>
          </h3>
          <p className="text-sm text-text-muted mt-1">Short-term weather view to support site visit and crop planning.</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center">
          <CheckCircle2 size={16} className="mr-2" />
          Optimal Growth Window
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-10 relative z-10">
        {forecasts.map((f, i) => (
          <div key={i} className="text-center p-4 rounded-3xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-lg transition-all cursor-default">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">{f.day}</p>
            <div className="flex justify-center mb-2">
              {f.icon}
            </div>
            <p className="font-bold text-primary">{f.temp}</p>
            <div className={`mt-2 text-[8px] font-bold uppercase tracking-tighter ${
              f.risk === 'Low' ? 'text-green-600' : f.risk === 'Med' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {f.risk} Risk
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-start space-x-4 relative z-10">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-orange-100">
          <AlertTriangle size={20} className="text-orange-500" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-orange-800">Thunderstorm Risk Detected (Wed)</h4>
          <p className="text-xs text-orange-700 mt-1 leading-relaxed">
            Field team should review drainage before Wednesday to reduce soil erosion risk in low-lying sections.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between p-4 border-t border-black/5 pt-8 relative z-10">
        <div className="flex items-center space-x-2">
          <Info size={14} className="text-text-muted" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Model Confidence: 94%</span>
        </div>
        <button
          onClick={() => setShowMatrix((value) => !value)}
          className="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
        >
          {showMatrix ? 'Hide Risk Matrix' : 'View Full Risk Matrix'}
        </button>
      </div>

      {showMatrix && (
        <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
          {[
            ['Rainfall', 'Moderate'],
            ['Heat Stress', 'Low'],
            ['Wind Damage', 'Low'],
            ['Pest Pressure', 'Medium'],
            ['Drainage', 'Watch'],
            ['Irrigation', 'Stable'],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-50 border border-black/5 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</p>
              <p className="font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherRisk;
