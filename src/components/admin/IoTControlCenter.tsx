import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Power, Droplets, Wind, Tractor, MapPin, Zap, ThermometerSun } from 'lucide-react';

const IoTControlCenter: React.FC = () => {
  const [dripIrrigation, setDripIrrigation] = useState(true);
  const [shadeNets, setShadeNets] = useState(false);
  const [activeTab, setActiveTab] = useState<'sensors' | 'fleet'>('sensors');

  return (
    <div className="mt-12 bg-gray-900 text-white rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-2xl">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center space-x-3 mb-2">
              <Zap size={28} className="text-yellow-400" />
              <span>IoT Command Center</span>
            </h2>
            <p className="text-gray-400">Live telemetry and remote actuation for all active estates.</p>
          </div>
          <div className="flex bg-white/10 p-1 rounded-2xl mt-4 md:mt-0">
            <button 
              onClick={() => setActiveTab('sensors')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'sensors' ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sensor Network
            </button>
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'fleet' ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Drone & Fleet
            </button>
          </div>
        </div>

        {activeTab === 'sensors' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { name: 'Soil Moisture', value: '42%', status: 'Optimal', icon: <Droplets />, color: 'text-blue-400' },
                { name: 'Ambient Temp', value: '28°C', status: 'Rising', icon: <ThermometerSun />, color: 'text-orange-400' },
                { name: 'Wind Speed', value: '14 km/h', status: 'Normal', icon: <Wind />, color: 'text-gray-300' },
                { name: 'Soil NPK Level', value: 'High', status: 'Perfect', icon: <Activity />, color: 'text-green-400' },
              ].map((sensor, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-white/10 ${sensor.color}`}>
                      {sensor.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                      Live
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{sensor.value}</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{sensor.name}</p>
                  <p className="text-xs text-gray-500 mt-4">Status: {sensor.status}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6">Remote Actuation</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="font-bold">Drip Irrigation</h4>
                    <p className="text-xs text-gray-400 mt-1">Zone A (Mysore Estate)</p>
                  </div>
                  <button 
                    onClick={() => setDripIrrigation(!dripIrrigation)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors relative ${dripIrrigation ? 'bg-secondary' : 'bg-gray-600'}`}
                  >
                    <motion.div 
                      layout
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                      initial={false}
                      animate={{ x: dripIrrigation ? 24 : 0 }}
                    >
                      <Power size={12} className={dripIrrigation ? 'text-secondary' : 'text-gray-400'} />
                    </motion.div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="font-bold">Shade Nets</h4>
                    <p className="text-xs text-gray-400 mt-1">Vineyard Sector 4</p>
                  </div>
                  <button 
                    onClick={() => setShadeNets(!shadeNets)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors relative ${shadeNets ? 'bg-secondary' : 'bg-gray-600'}`}
                  >
                    <motion.div 
                      layout
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                      initial={false}
                      animate={{ x: shadeNets ? 24 : 0 }}
                    >
                      <Power size={12} className={shadeNets ? 'text-secondary' : 'text-gray-400'} />
                    </motion.div>
                  </button>
                </div>

                <button className="w-full py-4 rounded-xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-colors text-sm">
                  EMERGENCY STOP ALL
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Tractor size={24} className="mr-3 text-secondary" />
                Active Fleet Units
              </h3>
              <button className="bg-secondary/20 text-secondary font-bold px-4 py-2 rounded-xl text-sm border border-secondary/30">
                Deploy New Drone
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { id: 'DRN-X1', type: 'DJI Agras (Spray)', task: 'Applying Organic Fertilizer', battery: '84%', loc: 'Sector 7B' },
                { id: 'DRN-S4', type: 'Multispectral Sensor', task: 'NDVI Mapping Survey', battery: '42%', loc: 'Sector 2A' },
                { id: 'TRC-01', type: 'John Deere Auton', task: 'Deep Plowing', battery: 'Fuel: 60%', loc: 'Sector 9' }
              ].map((unit, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-black/20 rounded-2xl border border-white/5 hover:border-white/20 transition-colors cursor-pointer group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/60 group-hover:text-secondary group-hover:bg-secondary/10 transition-colors">
                      {unit.type.includes('TRC') ? <Tractor size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold">{unit.id} <span className="text-xs text-gray-400 font-normal ml-2">{unit.type}</span></h4>
                      <p className="text-sm text-secondary mt-1">{unit.task}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
                        <span className="flex items-center"><Zap size={10} className="mr-1"/> {unit.battery}</span>
                        <span className="flex items-center"><MapPin size={10} className="mr-1"/> {unit.loc}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IoTControlCenter;
