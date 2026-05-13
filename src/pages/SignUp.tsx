import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Building2, TrendingUp, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type ProfileType = 'investor' | 'seller';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileType: 'investor' as ProfileType,
    agreedToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

     try {
       if (!isSupabaseConfigured) {
         // Store user credentials for local login
         const newUser = {
           email: formData.email,
           password: formData.password,
           name: formData.name,
           profileType: formData.profileType
         };
         const existingUsers = JSON.parse(localStorage.getItem('igo.users') || '[]');
         existingUsers.push(newUser);
         localStorage.setItem('igo.users', JSON.stringify(existingUsers));

         // Set current user session
         localStorage.setItem('igo.cx.email', formData.email);
         localStorage.setItem('igo.cx.name', formData.name);
         localStorage.setItem('igo.cx.profileType', formData.profileType);
         window.dispatchEvent(new Event('igo:customer-auth'));
         setSuccess(true);
         setTimeout(() => navigate('/dashboard'), 1500);
         return;
       }

      // Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            profile_type: formData.profileType
          }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            email: formData.email,
            name: formData.name,
            profile_type: formData.profileType,
            created_at: new Date().toISOString()
          });

        if (profileError) console.warn('Profile creation failed:', profileError);

        setSuccess(true);
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-16 rounded-[48px] text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-primary mb-4">Welcome to IGO!</h2>
          <p className="text-text-muted">Your account has been created successfully. Redirecting you to your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 -z-10"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg p-10 glass rounded-[48px]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <ShieldCheck className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl mb-2 font-black text-primary">Create Account</h2>
          <p className="text-text-muted">Join IGO Agriestates and start your investment journey.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl mb-6 text-sm font-medium bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Profile Type */}
          <div>
            <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, profileType: 'investor' }))}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.profileType === 'investor' ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-primary/30'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.profileType === 'investor' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <TrendingUp size={20} />
                  </div>
                  <span className="font-bold text-primary">Investor</span>
                </div>
                <p className="text-xs text-text-muted">I want to buy and invest in agricultural estates</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, profileType: 'seller' }))}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.profileType === 'seller' ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-primary/30'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.profileType === 'seller' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Building2 size={20} />
                  </div>
                  <span className="font-bold text-primary">Seller</span>
                </div>
                <p className="text-xs text-text-muted">I own agricultural land and want to list it</p>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm text-text-muted leading-relaxed">
              I agree to the <Link to="/policy" className="text-secondary hover:underline">Terms of Service</Link> and <Link to="/policy" className="text-secondary hover:underline">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 hover:bg-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
