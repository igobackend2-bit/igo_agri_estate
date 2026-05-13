import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, RefreshCcw, Lock, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type AuthMode = 'login' | 'signup' | 'otp' | 'set_password' | 'success';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!isSupabaseConfigured) {
        const localUsers = JSON.parse(localStorage.getItem('igo.users') || '[]');
        let user = localUsers.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem('igo.cx.email', email);
          localStorage.setItem('igo.cx.name', user.name || '');
          localStorage.setItem('igo.cx.profileType', user.profileType || 'investor');
          window.dispatchEvent(new Event('igo:customer-auth'));
          setMode('success');
          setTimeout(() => navigate('/profile'), 2000);
        } else {
          setMessage({ type: 'error', text: 'Invalid email or password. New users should use OTP first.' });
        }
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMode('success');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    setLoading(true);
    setMessage(null);

    // Force real-time Supabase OTP if credentials are present
    if (!isSupabaseConfigured) {
      const devOtp = String(Math.floor(100000 + Math.random() * 900000));
      localStorage.setItem('igo.cx.pendingEmail', email);
      localStorage.setItem('igo.cx.devOtp', devOtp);
      setMode('otp');
      setMessage({ type: 'success', text: `Access code sent. For demo: ${devOtp}` });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { 
          emailRedirectTo: `${window.location.origin}/profile`,
          shouldCreateUser: true
        }
      });

      if (error) throw error;
      
      setMode('otp');
      setMessage({ 
        type: 'success', 
        text: 'A 6-digit security code has been sent to your email. Please check your inbox and spam folder.' 
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: `Authentication failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!isSupabaseConfigured) {
        const pendingEmail = localStorage.getItem('igo.cx.pendingEmail');
        const devOtp = localStorage.getItem('igo.cx.devOtp');
        if (pendingEmail === email && devOtp === otp) {
          const localUsers = JSON.parse(localStorage.getItem('igo.users') || '[]');
          const userExists = localUsers.some((u: any) => u.email === email);
          
          if (!userExists) {
            setMode('set_password');
            setMessage({ type: 'success', text: 'Identity verified. Now secure your account with a password.' });
          } else {
            localStorage.setItem('igo.cx.email', email);
            window.dispatchEvent(new Event('igo:customer-auth'));
            setMode('success');
            setTimeout(() => navigate('/profile'), 2000);
          }
        } else {
          setMessage({ type: 'error', text: 'Invalid OTP. Please check and try again.' });
        }
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      if (error) throw error;
      
      setMode('success');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    setLoading(true);
    const localUsers = JSON.parse(localStorage.getItem('igo.users') || '[]');
    const newUser = { 
      email, 
      password, 
      name: email.split('@')[0], 
      profileType: 'investor',
      created_at: new Date().toISOString()
    };
    localUsers.push(newUser);
    localStorage.setItem('igo.users', JSON.stringify(localUsers));
    localStorage.setItem('igo.cx.email', email);
    localStorage.setItem('igo.cx.name', newUser.name);
    
    window.dispatchEvent(new Event('igo:customer-auth'));
    setMode('success');
    setTimeout(() => navigate('/profile'), 2000);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setMessage(null);
    setOtp('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/login-bg.png" 
          alt="Agricultural Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-lg p-10 bg-white/10 backdrop-blur-xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20 relative z-10 mx-6 my-20"
      >
        <AnimatePresence mode="wait">
          {mode === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden border border-white/20 p-2">
                  <img src="/images/logo.png" alt="IGO Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-primary mb-4 tracking-tighter uppercase">Authorized</h2>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Redirecting to institutional dashboard...</p>
            </motion.div>
          ) : (
            <motion.div key="form-container" exit={{ opacity: 0, scale: 0.95 }}>
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden border border-white/20 p-2">
                  <img src="/images/logo.png" alt="IGO Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-4xl mb-2 font-black text-white tracking-tighter uppercase leading-none">
                  {mode === 'login' ? 'Investor Access' : 
                   mode === 'signup' ? 'Join Network' : 
                   mode === 'otp' ? 'Verify Identity' : 
                   'Secure Account'}
                </h2>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                  {mode === 'login' ? 'Institutional Grade Agri-Investment' :
                   mode === 'signup' ? 'Initialize your estate portfolio' :
                   mode === 'otp' ? 'Check your inbox for access code' :
                   'Protect your portfolio with a password'}
                </p>
              </div>

              {message && (
                <div className={`p-5 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {message.text}
                </div>
              )}

              {mode === 'otp' ? (
                <form onSubmit={handleVerifyOTP} className="space-y-8">
                  <div className="text-center">
                    <label className="block text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Security Token</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full bg-white/10 border border-white/20 rounded-[32px] py-6 px-4 text-center text-5xl font-black tracking-[1rem] focus:ring-4 focus:ring-secondary/30 focus:border-secondary outline-none transition-all text-white placeholder:text-white/20"
                    />
                    <div className="mt-6 p-4 bg-white/5 rounded-2xl inline-block">
                        <p className="text-[10px] text-white font-black uppercase tracking-widest">
                          Sent to: <span className="text-secondary">{email}</span>
                        </p>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 group">
                    {loading ? <RefreshCcw className="animate-spin" /> : <><span>Grant Access</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>

                  <button type="button" onClick={() => switchMode('signup')} className="w-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
                    Wrong Contact Info? Go Back
                  </button>
                </form>
              ) : mode === 'set_password' ? (
                <form onSubmit={handleCreatePassword} className="space-y-6">
                   <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3 ml-2">Master Password</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                        <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
                          className="w-full bg-white/10 border border-white/20 rounded-[24px] py-6 pl-16 pr-14 focus:ring-4 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-bold text-white placeholder:text-white/40" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3 ml-2">Re-type Password</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Verify credentials"
                          className="w-full bg-white/10 border border-white/20 rounded-[24px] py-6 pl-16 pr-6 focus:ring-4 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-bold text-white placeholder:text-white/40" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-secondary text-primary py-6 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4">
                    {loading ? <RefreshCcw className="animate-spin" /> : <><span>Authorize Profile</span><ShieldCheck size={20} /></>}
                  </button>
                </form>
              ) : mode === 'login' ? (
                <div className="space-y-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3 ml-2">Registered Email</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="investor@domain.com"
                          className="w-full bg-white/10 border border-white/20 rounded-[24px] py-6 pl-16 pr-4 focus:ring-4 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-bold text-white placeholder:text-white/40" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3 ml-2">Secure Password</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                        <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                          className="w-full bg-white/10 border border-white/20 rounded-[24px] py-6 pl-16 pr-14 focus:ring-4 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-bold text-white placeholder:text-white/40" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                       <button type="button" onClick={() => switchMode('signup')} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">Instant OTP Access</button>
                       <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary">Forgot Key?</Link>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-[0_20px_40px_-10px_rgba(10,50,40,0.3)] flex items-center justify-center gap-4 disabled:opacity-50">
                      {loading ? <RefreshCcw className="animate-spin" /> : <><span>Enter Portal</span><ArrowRight size={20} /></>}
                    </button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-transparent px-6 text-white/40">First Time Visit?</span></div>
                  </div>

                  <button type="button" onClick={() => switchMode('signup')} className="w-full border-2 border-white/10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest text-white hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3">
                    <UserPlus size={16} />
                    Onboard via OTP
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendOTP} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3 ml-2">Identity Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@domain.com"
                        className="w-full bg-white/10 border border-white/20 rounded-[24px] py-6 pl-16 pr-4 focus:ring-4 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-bold text-white placeholder:text-white/40" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50">
                    {loading ? <RefreshCcw className="animate-spin" /> : <><span>Generate Access Code</span><ArrowRight size={20} /></>}
                  </button>

                  <button type="button" onClick={() => switchMode('login')} className="w-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
                    Already a Member? Login with Password
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-10 flex flex-col items-center gap-4">
        <div className="flex gap-8 opacity-60">
          <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px]">
            <ShieldCheck size={14} /> Encrypted
          </div>
          <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px]">
             Institutional Tier
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">IGO Quantum Security Protocol v4.0</p>
      </div>
    </div>
  );
};

export default Login;
