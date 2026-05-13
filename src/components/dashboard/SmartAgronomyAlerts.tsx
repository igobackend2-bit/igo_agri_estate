import React from 'react';
import { Bell, Droplets, ThermometerSun, Sprout, Tractor, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const alerts = [
  {
    id: 1,
    type: 'success',
    icon: <Tractor size={18} />,
    title: 'Harvesting Initiated',
    message: 'Contractors have begun harvesting the North-East sector of Mysore Estate.',
    time: '2 hours ago',
    estate: 'Mysore Estate'
  },
  {
    id: 2,
    type: 'warning',
    icon: <Droplets size={18} />,
    title: 'Irrigation Adjusted',
    message: 'Soil moisture dropped below 30%. Automated drip irrigation increased by 15%.',
    time: '5 hours ago',
    estate: 'Nashik Vineyard'
  },
  {
    id: 3,
    type: 'danger',
    icon: <ThermometerSun size={18} />,
    title: 'Heatwave Alert',
    message: 'Temperatures expected to exceed 38°C tomorrow. Shade netting deployed.',
    time: '1 day ago',
    estate: 'Nashik Vineyard'
  },
  {
    id: 4,
    type: 'info',
    icon: <Sprout size={18} />,
    title: 'Drone Survey Complete',
    message: 'NDVI scan shows 98% crop health. No signs of pest infestation detected.',
    time: '2 days ago',
    estate: 'Mysore Estate'
  }
];

const SmartAgronomyAlerts: React.FC = () => {
  return (
    <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold flex items-center">
          <Bell size={24} className="text-primary mr-3" />
          Agronomy Alerts
        </h3>
        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Live Feed</span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-3xl border transition-all hover:shadow-md cursor-pointer ${
              alert.type === 'success' ? 'bg-green-50 border-green-100 hover:border-green-300' :
              alert.type === 'warning' ? 'bg-orange-50 border-orange-100 hover:border-orange-300' :
              alert.type === 'danger' ? 'bg-red-50 border-red-100 hover:border-red-300' :
              'bg-blue-50 border-blue-100 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                alert.type === 'success' ? 'bg-green-200 text-green-700' :
                alert.type === 'warning' ? 'bg-orange-200 text-orange-700' :
                alert.type === 'danger' ? 'bg-red-200 text-red-700' :
                'bg-blue-200 text-blue-700'
              }`}>
                {alert.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{alert.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                    {alert.time}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  {alert.message}
                </p>
                <span className="text-xs font-semibold text-gray-500 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  {alert.estate}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-4 text-sm font-bold text-primary border border-black/5 rounded-2xl hover:bg-primary/5 transition-colors">
        View Complete Alert History
      </button>
    </div>
  );
};

export default SmartAgronomyAlerts;
