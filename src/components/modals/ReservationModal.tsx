import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Property } from '../../types';

interface ReservationModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ property, isOpen, onClose }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const tokenAmount = "₹ 50,000";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b border-black/5 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold">Reserve Estate</h3>
                <p className="text-text-muted mt-1">Property: {property.title}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {step === 'details' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-start space-x-6 mb-8 bg-gray-50 p-6 rounded-3xl border border-black/5">
                    <div className="w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={property.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{property.title}</h4>
                      <p className="text-sm text-text-muted">{property.location}</p>
                      <div className="mt-2 flex items-center text-primary font-bold">
                        <span>{property.price}</span>
                        <span className="mx-2 text-black/10">|</span>
                        <span className="text-secondary">{property.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-black/5">
                      <span className="text-text-muted font-medium">Reservation Token</span>
                      <span className="text-2xl font-bold text-primary">{tokenAmount}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-text-muted font-medium">Platform Fee</span>
                      <span className="text-green-600 font-bold">₹ 0 (Limited Offer)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <ShieldCheck className="text-green-600" size={24} />
                      <span className="text-xs font-bold uppercase tracking-widest text-green-700">100% Refundable</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <Lock className="text-blue-600" size={24} />
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Secure Payment</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep('payment')}
                    className="w-full btn-primary py-5 flex items-center justify-center space-x-3 text-xl shadow-xl shadow-primary/20"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={24} />
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 mb-6">
                    <p className="text-center text-sm font-bold uppercase tracking-widest text-primary mb-2">Total Payable Now</p>
                    <h3 className="text-center text-4xl font-bold text-primary">{tokenAmount}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                      <input type="text" placeholder="Card Number" className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" />
                      <input type="text" placeholder="CVV" className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep('success')}
                    className="w-full btn-primary py-5 flex items-center justify-center space-x-3 text-xl"
                  >
                    <span>Pay {tokenAmount} Securely</span>
                  </button>
                  <button onClick={() => setStep('details')} className="w-full text-text-muted font-bold text-sm uppercase tracking-widest py-2">Go Back</button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                  <h3 className="text-4xl font-bold mb-4">Estate Reserved!</h3>
                  <p className="text-text-muted text-lg mb-8 max-w-sm mx-auto">
                    Your token payment was successful. An IGO advisor will contact you within 24 hours to initiate the legal transfer.
                  </p>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-black/5 mb-8 text-left">
                    <p className="text-xs font-bold uppercase text-text-muted mb-2 tracking-widest">Transaction ID</p>
                    <p className="font-mono text-sm">#IGO-TXN-8829-XL01</p>
                  </div>
                  <button onClick={onClose} className="btn-primary px-12 py-4 rounded-2xl">Close & View Dashboard</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;
