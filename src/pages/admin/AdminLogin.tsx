import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { getLocalSettings } from '../../lib/localSync';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === getLocalSettings().adminPassword) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid administrative credentials');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-secondary rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-secondary/20">
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Institutional <br /><span className="text-secondary italic">Access</span></h1>
          <p className="text-white/40 text-sm font-light">IGO Agriestates Administration Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors">
              <User size={20} />
            </div>
            <input 
              type="text" 
              defaultValue="administrator" 
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 text-white text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none transition-all cursor-not-allowed"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Security Key"
              className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 text-white text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-white/10"
              autoFocus
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full bg-secondary text-primary py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:bg-white transition-all shadow-xl shadow-secondary/10"
          >
            <span>Authorize Portal</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <div className="flex items-center justify-center space-x-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
