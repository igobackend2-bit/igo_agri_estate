import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Search, Sprout, Landmark } from 'lucide-react';

interface TimelineItem {
  status: 'completed' | 'current' | 'upcoming';
  title: string;
  description: string;
  date?: string;
  icon: React.ReactNode;
}

const PropertyTimeline: React.FC = () => {
  const steps: TimelineItem[] = [
    {
      status: 'completed',
      title: 'Legal Title Verification',
      description: '3-tier audit of mother deed, encumbrance certificates, and revenue records.',
      date: 'Jan 2026',
      icon: <Landmark size={18} />
    },
    {
      status: 'completed',
      title: 'Topographical Survey',
      description: 'DGPS and drone survey to establish precise boundaries and contour mapping.',
      date: 'Feb 2026',
      icon: <Search size={18} />
    },
    {
      status: 'completed',
      title: 'Soil Health Analysis',
      description: 'Lab testing for organic carbon, NPK levels, and suitability for high-value timber.',
      date: 'Mar 2026',
      icon: <Sprout size={18} />
    },
    {
      status: 'current',
      title: 'Land Development',
      description: 'Fencing completion, access roads, and solar-powered irrigation setup.',
      date: 'Ongoing',
      icon: <ShieldCheck size={18} />
    },
    {
      status: 'upcoming',
      title: 'Plantation Commencement',
      description: 'Phased plantation of teak and sandalwood by our professional agri-team.',
      icon: <CheckCircle2 size={18} />
    }
  ];

  return (
    <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-bold">Proof of <span className="text-secondary italic">Trust</span></h3>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100">
          <ShieldCheck size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Verified by IGO Chain</span>
        </div>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex items-start space-x-6 group"
          >
            {/* Timeline Line */}
            {index !== steps.length - 1 && (
              <div className={`absolute left-[1.35rem] top-10 w-[2px] h-[calc(100%+2rem)] ${
                step.status === 'completed' ? 'bg-secondary' : 'bg-black/5'
              }`}></div>
            )}

            {/* Icon Circle */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 ${
              step.status === 'completed' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' :
              step.status === 'current' ? 'bg-primary text-white animate-pulse' :
              'bg-gray-100 text-black/20 border border-black/5'
            }`}>
              {step.icon}
            </div>

            <div className="pt-1">
              <div className="flex items-center space-x-3 mb-1">
                <h4 className={`font-bold ${step.status === 'upcoming' ? 'text-text-muted' : 'text-primary'}`}>
                  {step.title}
                </h4>
                {step.date && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-text-muted px-2 py-0.5 rounded-full">
                    {step.date}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-muted leading-relaxed max-w-md">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10">
        <p className="text-xs text-text-muted italic leading-relaxed">
          *Every milestone in the property development lifecycle is timestamped and verified using our proprietary blockchain-inspired ledger, ensuring immutable proof of sustainable practices and legal transparency.
        </p>
      </div>
    </div>
  );
};

export default PropertyTimeline;
