import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

const LegalServices: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container-pro">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Institutional Security</span>
          <h1 className="heading-xl text-primary mb-8">Title Ledger & <br/><span className="text-secondary italic">Legal Diligence</span></h1>
          <p className="text-xl text-text-muted font-light leading-relaxed mb-16 max-w-2xl">
            Secure your agricultural investments with our comprehensive legal framework. From 30-year encumbrance checks to Bio-CNG feasibility.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {[
            { icon: <ShieldCheck size={32} />, title: 'Title Chain Verification', desc: 'Rigorous 30-year audit of EC, Patta, Chitta, and FMB sketches to ensure zero ownership disputes.' },
            { icon: <Scale size={32} />, title: 'Land Use Conversion', desc: 'Expert assistance in converting agricultural land for commercial or Bio-CNG industrial purposes.' },
            { icon: <FileCheck size={32} />, title: 'Sale Deed Drafting', desc: 'Institutional-grade contract drafting protecting both buyer and seller in high-value transactions.' },
            { icon: <AlertCircle size={32} />, title: 'Dispute Resolution', desc: 'Proactive legal mediation and boundary discrepancy resolution prior to listing.' }
          ].map((service, i) => (
            <div key={i} className="glass p-12 rounded-[40px] border-white/60 shadow-xl group hover:border-secondary/30 transition-all">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
              <p className="text-text-muted leading-relaxed font-light">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-primary rounded-[60px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
           <h2 className="text-4xl font-bold mb-6 relative z-10">Request a Legal Audit</h2>
           <p className="text-white/60 mb-10 max-w-xl mx-auto relative z-10">Our institutional legal desk will review your prospective property documents within 48 hours.</p>
           <button className="btn-gold relative z-10">Consult Legal Expert</button>
        </div>
      </div>
    </div>
  );
};

export default LegalServices;
