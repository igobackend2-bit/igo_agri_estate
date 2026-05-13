import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const Policy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container-pro max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8">
             <ShieldCheck size={32} />
          </div>
          <h1 className="heading-lg text-primary mb-8">Legal & <span className="text-secondary italic">Privacy Policy</span></h1>
          
          <div className="prose prose-lg text-text-muted font-light leading-relaxed">
            <h3 className="text-2xl font-bold text-primary mt-10 mb-4">1. Data Privacy</h3>
            <p>At IGO Agriestates, we protect your institutional data with the highest cryptographic standards. We do not sell your personal or financial data to third-party brokers.</p>
            
            <h3 className="text-2xl font-bold text-primary mt-10 mb-4">2. Transaction Integrity</h3>
            <p>All property listings are subject to strict KYC and AML regulations. We reserve the right to delist any property found to have disputed titles.</p>
            
            <h3 className="text-2xl font-bold text-primary mt-10 mb-4">3. Brokerage Policy</h3>
            <p>IGO operates on a zero-commission model for direct buyers. Escrow and legal services incur separate, transparent institutional fees.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Policy;
