import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Authentication Required", 
  message = "Please sign in to your account to send requests, book site visits, or access premium estate details." 
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[48px] w-full max-w-lg p-10 relative shadow-2xl border border-white/20"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-text-muted hover:text-primary transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mb-8">
                <Lock size={40} />
              </div>

              <h2 className="text-3xl font-black text-primary mb-4 leading-tight">
                {title}
              </h2>
              
              <p className="text-text-muted text-lg leading-relaxed mb-10 px-4">
                {message}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary-light transition-all shadow-xl shadow-primary/20"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/signup');
                  }}
                  className="bg-secondary text-primary py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-secondary-light transition-all shadow-xl shadow-secondary/20"
                >
                  <UserPlus size={18} />
                  Join Now
                </button>
              </div>

              <div className="mt-10 flex items-center gap-2 text-text-muted">
                <ShieldCheck size={16} className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
