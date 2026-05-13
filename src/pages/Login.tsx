import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, RefreshCcw, Lock, Eye, EyeOff } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type AuthMode = 'login' | 'signup' | 'otp';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        if (!user && email && password) {
          user = { email, password, name: email.split('@')[0], profileType: 'investor' };
          localUsers.push(user);
          localStorage.setItem('igo.users', JSON.stringify(localUsers));
        }
        if (user) {
          localStorage.setItem('igo.cx.email', email);
          localStorage.setItem('igo.cx.name', user.name || '');
          localStorage.setItem('igo.cx.profileType', user.profileType || 'investor');
          window.dispatchEvent(new Event('igo:customer-auth'));
          setMessage({ type: 'success', text: 'Login successful!' });
          setTimeout(() => navigate('/profile'), 1000);
        } else {
          setMessage({ type: 'error', text: 'Invalid email or password' });
        }
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Login successful!' });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isSupabaseConfigured) {
      const devOtp = String(Math.floor(100000 + Math.random() * 900000));
      localStorage.setItem('igo.cx.pendingEmail', email);
      localStorage.setItem('igo.cx.devOtp', devOtp);
      setMode('otp');
      setMessage({ type: 'success', text: `Dev OTP: ${devOtp}. Check console for dev mode.` });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/profile` }
    });

    if (error) {
      setMessage({ type: 'error', text: `Unable to send OTP: ${error.message}` });
    } else {
      setMode('otp');
      setMessage({ type: 'success', text: 'OTP sent to your email!' });
    }
    setLoading(false);
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
          localStorage.setItem('igo.cx.email', email);
          localStorage.removeItem('igo.cx.pendingEmail');
          localStorage.removeItem('igo.cx.devOtp');
          window.dispatchEvent(new Event('igo:customer-auth'));
          setMessage({ type: 'success', text: 'Login successful!' });
          setTimeout(() => navigate('/profile'), 1000);
        } else {
          setMessage({ type: 'error', text: 'Invalid OTP. Please check and try again.' });
        }
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Login successful!' });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setMessage(null);
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 -z-10"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-8 glass rounded-[32px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-xl">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-3xl mb-2 font-black text-primary">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-text-muted text-sm">
            {mode === 'login' ? 'Sign in to access your investor dashboard.' :
             mode === 'signup' ? 'Start your agri-investment journey today.' :
             'Enter the code sent to your email'}
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Mode Switcher */}
        {mode === 'otp' ? (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-white border border-black/10 rounded-2xl py-4 px-4 text-center text-3xl font-bold tracking-[1rem] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <p className="text-xs text-text-muted mt-3 text-center">
                Code sent to <strong>{email}</strong>
              </p>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50">
              {loading ? <RefreshCcw className="animate-spin" /> : <span>Verify & Continue</span>}
            </button>

            <button type="button" onClick={() => switchMode('login')} className="w-full text-sm text-text-muted hover:text-primary transition-colors py-2">
              Use different email
            </button>
          </form>
        ) : mode === 'login' ? (
          <motion.form key="login-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-muted">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-secondary hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50">
              {loading ? <RefreshCcw className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={20} /></>}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center border-t border-black/10"></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-text-muted">Or continue with</span>
              </div>
            </div>

            <button type="button" onClick={() => { setEmail(''); setMode('otp'); }} className="w-full border border-black/10 py-3 rounded-2xl font-bold text-sm text-primary hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Mail size={18} />
              Send OTP instead
            </button>
            <Link to="/signup" className="block w-full text-center border border-black/10 py-3 rounded-2xl font-bold text-sm text-primary hover:bg-gray-50 transition-all">
              Create New Account
            </Link>
          </motion.form>
        ) : (
          <motion.form key="signup-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50">
              {loading ? <RefreshCcw className="animate-spin" /> : <><span>Send OTP to Email</span><ArrowRight size={20} /></>}
            </button>

            <button type="button" onClick={() => switchMode('login')} className="w-full text-sm text-text-muted hover:text-primary transition-colors py-2">
              Back to Sign In
            </button>
          </motion.form>
        )}
      </motion.div>

      {/* Footer Links */}
      <div className="absolute bottom-6 text-center w-full text-xs text-text-muted">
        <p>By continuing, you agree to our <Link to="/policy" className="text-secondary hover:underline">Terms of Service</Link> and <Link to="/policy" className="text-secondary hover:underline">Privacy Policy</Link></p>
      </div>
    </div>
  );
};

export default Login;
