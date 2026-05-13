import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Sun, Wind, Activity, Zap, Cpu, Bell } from 'lucide-react';

const IoTStatus: React.FC = () => {
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const sensors = [
    { label: 'Soil Moisture', val: '42%', icon: <Droplets className="text-blue-500" />, status: 'Optimal' },
    { label: 'Avg Temp', val: '28°C', icon: <Thermometer className="text-red-500" />, status: 'Stable' },
    { label: 'Solar Flux', val: '850 W/m²', icon: <Sun className="text-accent" />, status: 'High' },
    { label: 'Wind Speed', val: '12 km/h', icon: <Wind className="text-blue-400" />, status: 'Low' },
  ];

  return (
    <div className="bg-primary rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative Circuit Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none">
          <path d="M0,20 L40,20 L50,10 L100,10" strokeWidth="0.2" />
          <path d="M0,80 L60,80 L70,90 L100,90" strokeWidth="0.2" />
          <circle cx="40" cy="20" r="1" fill="white" />
          <circle cx="60" cy="80" r="1" fill="white" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-secondary">
              <Cpu size={24} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">IoT Field Intelligence</h3>
          </div>
          <p className="text-white/60 text-sm">Real-time sensor telemetry from Estate ID: #IG-4290</p>
        </div>
        <div className="flex items-center space-x-4 mt-6 md:mt-0">
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <Activity size={16} className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Network: Active</span>
          </div>
          <button className="relative p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {sensors.map((sensor, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {sensor.icon}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                sensor.status === 'Optimal' ? 'bg-green-500/20 text-green-400' : 
                sensor.status === 'High' ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {sensor.status}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{sensor.label}</p>
            <p className="text-3xl font-bold text-white">{sensor.val}</p>
            
            {/* Tiny Chart Mockup */}
            <div className="mt-4 h-8 flex items-end space-x-1 opacity-20">
              {[1, 2, 3, 4, 5, 6].map(j => (
                <div key={j} className="flex-grow bg-white rounded-t-sm" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/40">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Irrigation Review Scheduled</h4>
            <p className="text-xs text-white/40">Next field check is scheduled in 4h 12m based on soil moisture and weather conditions.</p>
          </div>
        </div>
        <button
          onClick={() => setOverrideEnabled((value) => !value)}
          className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all transform hover:scale-105 ${
            overrideEnabled ? 'bg-secondary text-white' : 'bg-white text-primary hover:bg-secondary hover:text-white'
          }`}
        >
          {overrideEnabled ? 'Override Active' : 'Manual Override'}
        </button>
      </div>
    </div>
  );
};

export default IoTStatus;
