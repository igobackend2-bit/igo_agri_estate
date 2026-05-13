import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sprout, Globe, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { language, setLanguage, languages } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5">
      <nav 
        className={`w-full transition-all duration-500 flex items-center justify-center ${
          isScrolled ? 'py-3 shadow-md' : 'py-6'
        }`}
      >
        <div className="container-pro w-full flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group shrink-0">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-2 shadow-md transition-transform group-hover:scale-105 border border-black/5 overflow-hidden">
               <img src="/images/logo.png" alt="IGO Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tight text-primary uppercase font-serif">Agricultural</span>
              <span className="text-[10px] text-[#00814a] font-black uppercase italic tracking-[0.3em] ml-0.5">Estate India</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-12">
            <Link to="/locations" className="text-[11px] font-black uppercase tracking-widest text-primary/70 hover:text-[#00814a] transition-all hover:-translate-y-0.5">Estates</Link>
            <Link to="/about" className="text-[11px] font-black uppercase tracking-widest text-primary/70 hover:text-[#00814a] transition-all hover:-translate-y-0.5">About</Link>
            <Link to="/contact" className="text-[11px] font-black uppercase tracking-widest text-primary/70 hover:text-[#00814a] transition-all hover:-translate-y-0.5">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-black/5 hover:bg-black/10 transition-all text-xs font-bold uppercase tracking-widest text-primary/70">
                <Globe size={16} />
                <span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-40 glass rounded-2xl shadow-xl border border-white/60 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-4 py-3 text-left text-sm font-bold capitalize hover:bg-secondary/10 transition-colors ${language === lang.code ? 'bg-secondary/20 text-secondary' : 'text-primary'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <Link to="/post-property" className="bg-[#3d444d] text-white px-8 py-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/5 hover:shadow-black/20">
              Post Property
            </Link>

            {user ? (
              <Link to="/profile" className="flex items-center gap-2 bg-gray-100 text-primary px-6 py-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                <User size={16} />
                Profile
              </Link>
            ) : (
              <Link to="/login" className="bg-[#00814a] text-white px-6 py-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#006a3d] transition-all shadow-xl shadow-[#00814a]/10">
                Login/Register
              </Link>
            )}
          </div>

          <button 
            className="lg:hidden p-2 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

           {/* Mobile Menu */}
           <AnimatePresence>
             {isMobileMenuOpen && (
               <motion.div
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="absolute top-28 left-6 right-6 glass rounded-[40px] p-10 shadow-2xl border border-white/60 pointer-events-auto"
               >
               <div className="flex flex-col space-y-6">
                 <Link to="/locations" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-primary uppercase tracking-tighter">Estates</Link>
                 <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-primary uppercase tracking-tighter">About</Link>
                 <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-primary uppercase tracking-tighter">Contact</Link>
                   <div className="pt-6 border-t border-black/5 flex flex-col space-y-4">
                     <Link to="/post-property" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#3d444d] text-white py-5 rounded-lg text-center font-black uppercase tracking-widest">
                       Post Property
                     </Link>
                     {user ? (
                       <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#00814a] text-white py-5 rounded-lg text-center font-black uppercase tracking-widest">
                         My Profile
                       </Link>
                     ) : (
                       <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#00814a] text-white py-5 rounded-lg text-center font-black uppercase tracking-widest">
                         Login/Register
                       </Link>
                     )}
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
    </div>
  );
};

export default Navbar;
