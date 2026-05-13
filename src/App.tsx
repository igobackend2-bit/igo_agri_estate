import {
  MapPin, Star, ArrowRight, Zap, TrendingUp, Sprout, ShieldCheck, CheckCircle2,
  LayoutGrid, Newspaper, PlayCircle, Users, Calculator
} from 'lucide-react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import type { Property } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AIAssistant from './components/ai/AIAssistant';
import { AnimatePresence } from 'framer-motion';
import StatsSection from './components/home/StatsSection';
import PropertyCard from './components/PropertyCard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import PostRequirement from './pages/PostRequirement';
import PropertyDetails from './pages/PropertyDetails';
import ValuationSimulator from './pages/ValuationSimulator';
import TaxOptimizer from './pages/TaxOptimizer';
import Marketplace from './pages/Marketplace';
import PostProperty from './pages/PostProperty';
import Blog from './pages/Blog';
import KnowledgeHub from './pages/KnowledgeHub';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import PropertyForm from './pages/admin/PropertyForm';
import InvestorDashboard from './pages/dashboard/InvestorDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AIReportPage from './pages/AIReportPage';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
// import GlobalBackground from './components/3d/GlobalBackground';
import LegalServices from './pages/services/LegalServices';
import SoilIntelligence from './pages/services/SoilIntelligence';
import Policy from './pages/Policy';
import { locations } from './data/locationEstates';
import { submitLead } from './lib/leadsService';
import LiveChatWidget from './components/LiveChatWidget';
import { useProperties } from './hooks/useProperties';
import { useEffect, useMemo, useState } from 'react';
import { getLocalSettings, SETTINGS_SYNC_EVENT, subscribeLocalSync } from './lib/localSync';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { publicProperties } = useProperties();
  const recentlyAdded = useMemo(() => 
    [...publicProperties]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 3),
    [publicProperties]
  );

  return (
    <main className="bg-background">
      <Hero />
        <div className="container-pro relative z-20 -mt-24">
          <StatsSection />
        </div>

        {/* Location Quick Links */}
        <section className="py-16 bg-background">
          <div className="container-pro">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Explore by Corridor</span>
                <h2 className="text-3xl font-black text-primary">Popular Estate Locations</h2>
              </div>
              <Link to="/locations" className="hidden md:flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-sm hover:underline">
                View All Locations <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {locations.map(loc => (
                <Link
                  key={loc.id}
                  to={`/locations?location=${loc.id}`}
                  className="group bg-white rounded-3xl p-6 border border-black/5 hover:border-secondary hover:shadow-xl transition-all text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:text-primary transition-colors">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-bold text-primary mb-1">{loc.name}</h3>
                  <p className="text-xs text-text-muted">{loc.estateCount} Estates</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background border-b border-black/5">
        <div className="container-pro">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-start">
            <div>
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Premium Estates in Tamil Nadu</span>
              <h2 className="heading-lg text-primary">Verified Agricultural <br /><span className="text-secondary italic">Land Investments</span></h2>
              <p className="text-lg text-text-muted font-light leading-relaxed mt-6">
                From Mahabalipuram's teak plantations to Chennai's vertical farms — discover handpicked estates with clear titles, managed support, and transparent returns.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { title: 'Browse by Location', desc: 'Explore estates in Mahabalipuram, Chennai, Maduranthagam, Kanchipuram & more.', icon: <MapPin className="text-secondary" />, link: '/locations' },
                { title: 'Investment Calculator', desc: 'Estimate EMI, rental yield, and crop returns per estate.', icon: <Calculator className="text-secondary" />, link: '/valuation' },
                { title: 'AI Price Report', desc: 'Get instant valuation based on comparable sales and soil data.', icon: <TrendingUp className="text-secondary" />, link: '/ai-report' },
                { title: 'Talk to Advisor', desc: 'Our location experts match your goals with the right estate corridor.', icon: <Users className="text-secondary" />, link: '/contact' }
              ].map((item) => (
                <Link key={item.title} to={item.link} className="block bg-white border border-black/5 rounded-[28px] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-primary mb-3">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose IGO? */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="container-pro">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Agri Estate Advantage</span>
              <h2 className="heading-lg text-primary">Why Choose <br /><span className="text-secondary italic">Igo Agriestates</span>?</h2>
              <p className="text-lg text-text-muted font-light leading-relaxed mb-12">
                We help customers evaluate agricultural land and convert it into a professionally planned Agri Estate with crop strategy, development budgeting, managed operations, and transparent revenue tracking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: 'Crop Model First', desc: 'Every estate is explained with a practical crop plan and revenue route.', icon: <Sprout className="text-secondary" /> },
                  { title: 'Estate Budgeting', desc: 'Understand setup cost, operating cost, crop cycle, and break-even before deciding.', icon: <LayoutGrid className="text-secondary" /> },
                  { title: 'Managed Farming', desc: 'IGO supports farm development, labour coordination, crop monitoring, and reporting.', icon: <Users className="text-secondary" /> },
                  { title: 'Document Clarity', desc: 'Land purchase is supported with title, survey, tax, water, and registration checks.', icon: <CheckCircle2 className="text-secondary" /> }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold text-primary mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-sm text-text-muted leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/10 blur-[100px] rounded-full z-0"></div>
              <img
                src="/images/team-expert-indian.png"
                alt="Professional Team"
                className="rounded-[60px] shadow-2xl relative z-10 w-full border border-white/40"
              />
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-[40px] shadow-2xl z-20 border-white/60">
                <div className="text-5xl font-black text-primary mb-1">15+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Years of Agri Expertise</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agri Estate Categories */}
      <section className="section-padding bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
        <div className="container-pro">
          <div className="max-w-3xl mb-24">
            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Agri Estate Models</span>
            <h2 className="heading-lg text-white">Land Into <br /><span className="text-secondary italic">Farm Income</span></h2>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              Estate-format agriculture models designed around real crops, water access, market linkage, and owner reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Protected Cultivation', desc: 'Shade net and polyhouse vegetable models for high-value recurring harvests.', img: '/images/properties/polyhouse.png', icon: <Sprout />, filter: 'Protected', location: 'Kanchipuram' },
              { title: 'Horticulture Orchards', desc: 'Fruit plantation estates with drip irrigation, staged harvest, and managed sales potential.', img: '/images/properties/mango-orchard.png', icon: <TrendingUp />, filter: 'Horticulture', location: 'Maduranthagam' },
              { title: 'Agroforestry Farms', desc: 'Timber, spice, and intercrop models for long-term land value and farm income.', img: '/images/properties/teak-estate.png', icon: <Zap />, filter: 'Open Field', location: 'Mahabalipuram' }
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/listings?category=${encodeURIComponent(cat.filter)}&location=${encodeURIComponent(cat.location.toLowerCase())}`}
                className="group relative h-[600px] rounded-[48px] overflow-hidden cursor-pointer shadow-2xl bg-black block"
              >
                <motion.div whileHover={{ y: -15 }} className="w-full h-full">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
                  <div className="absolute bottom-12 left-10 right-10">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20 group-hover:bg-secondary group-hover:border-secondary transition-all">
                      {cat.icon}
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-4 leading-tight uppercase tracking-tighter">{cat.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">{cat.desc}</p>
                    <div className="flex items-center text-white font-bold text-[10px] uppercase tracking-[0.2em] group/btn">
                      View in {cat.location} <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-3 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="section-padding bg-background border-b border-black/5">
        <div className="container-pro">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="max-w-xl">
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Ready for Planning</span>
              <h2 className="heading-lg mb-0 text-primary">New Agri <span className="text-secondary italic">Estates</span></h2>
            </div>
            <Link to="/locations" className="flex items-center text-primary font-black uppercase tracking-widest text-[11px] hover:text-secondary transition-colors">
              Explore Premium Estates <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {recentlyAdded.map((prop: Property) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Cities & Knowledge */}
      <section className="section-padding bg-background relative">
        <div className="container-pro">
          <div className="grid lg:grid-cols-12 gap-20">
            {/* Trending Cities */}
            <div className="lg:col-span-7">
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Growth Corridors</span>
              <h2 className="heading-lg text-primary mb-12 leading-none">Trending <br /><span className="text-secondary italic">Agri-Cities</span></h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: 'Mysore Corridors', stats: '15% YoY Growth', img: '/images/cities/mysore.png', id: 'mysore' },
                  { name: 'Nashik Vineyards', stats: 'Managed High Yield', img: '/images/cities/nashik.png', id: 'nashik' },
                  { name: 'Coimbatore Hubs', stats: 'Top Industrial Agri', img: '/images/cities/coimbatore.png', id: 'coimbatore' },
                  { name: 'Telangana Belt', stats: 'Bio-CNG Pioneer', img: '/images/cities/telangana.png', id: 'telangana' }
                ].map((city, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }} 
                    onClick={() => navigate(`/locations?location=${city.id}`)}
                    className="flex items-center space-x-6 p-4 rounded-[32px] hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-[24px] overflow-hidden shadow-lg border border-black/5 flex-shrink-0">
                      <img src={city.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={city.name} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-primary mb-1 tracking-tight">{city.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{city.stats}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Knowledge Hub */}
            <div className="lg:col-span-5 bg-primary rounded-[60px] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Knowledge Hub</span>
              <h2 className="text-4xl font-bold mb-10 leading-tight">Investment <br /><span className="text-secondary italic">Intelligence</span></h2>

              <div className="space-y-8 relative z-10">
                <Link to="/blog#videos" className="block p-6 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                      <PlayCircle size={20} />
                    </div>
                    <h5 className="font-bold text-lg">Trending Videos</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Watch virtual site visits and drone audits of our prime estates.</p>
                </Link>

                <Link to="/blog#blogs" className="block p-6 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                      <Newspaper size={20} />
                    </div>
                    <h5 className="font-bold text-lg">Market Blogs</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Deep dives into Bio-CNG integration and state-wise land laws.</p>
                </Link>

                <Link to="/knowledge-hub" className="btn-gold w-full py-5 rounded-[24px]">
                  Explore Masterclass
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Acquisition Desk */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="container-pro">
          <div className="bg-primary rounded-[80px] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_48px_96px_-24px_rgba(2,44,34,0.3)] border border-white/5">
            <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Direct Acquisition</span>
                <h2 className="heading-lg mb-10 leading-tight text-white">Can't find your <br /><span className="text-secondary italic font-serif">Ideal Estate?</span></h2>
                <p className="text-white/50 text-xl mb-12 leading-relaxed font-light">
                  Our institutional desk will source off-market lands tailored to your specific NPK requirements and ROI goals.
                </p>
                <div className="flex flex-wrap gap-10">
                  <div className="flex items-center space-x-4">
                    <ShieldCheck size={28} className="text-secondary" />
                    <span className="font-bold text-sm tracking-wide">Verified Titles</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Zap size={28} className="text-secondary" />
                    <span className="font-bold text-sm tracking-wide">Quick Onboarding</span>
                  </div>
                </div>
              </div>

              <div className="glass-dark p-12 rounded-[56px] border-white/10">
                 <form
                   className="space-y-8"
                   onSubmit={async (e) => {
                     e.preventDefault();
                     const form = e.currentTarget as HTMLFormElement;
                     const category = form.elements.namedItem('category') as HTMLSelectElement;
                     const state = form.elements.namedItem('state') as HTMLSelectElement;
                     const size = form.elements.namedItem('size') as HTMLInputElement;
                     const result = await submitLead({
                       type: 'requirement',
                       name: 'Institutional Inquiry',
                       phone: 'Captured via Desk',
                       asset_category: category?.value,
                       preferred_state: state?.value,
                       investment_size: size?.value
                     });
                     if (result.success) alert('Institutional Requirement Submitted. Our Desk will contact you shortly.');
                   }}
                 >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Asset Category</label>
                      <select name="category" className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 px-6 text-sm font-bold outline-none focus:border-secondary transition-colors cursor-pointer appearance-none text-white">
                        <option className="bg-primary">Horticulture</option>
                        <option className="bg-primary">Plantation</option>
                        <option className="bg-primary">Livestock</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Preferred State</label>
                      <select name="state" className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 px-6 text-sm font-bold outline-none focus:border-secondary transition-colors cursor-pointer appearance-none text-white">
                        <option className="bg-primary">Karnataka</option>
                        <option className="bg-primary">Maharashtra</option>
                        <option className="bg-primary">Tamil Nadu</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Investment Size (Cr)</label>
                    <input name="size" type="text" placeholder="e.g. 5.5" className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 px-6 text-sm font-bold outline-none focus:border-secondary transition-colors placeholder:text-white/20 text-white" />
                  </div>
                  <button type="submit" className="w-full btn-gold border-none py-6 shadow-2xl shadow-secondary/20 uppercase tracking-[0.2em] text-[12px] font-black">
                    Submit Requirement
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="container-pro">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Trust</span>
            <h2 className="heading-lg text-primary">What Customers <span className="text-secondary italic">Love & Review</span></h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Rahul Sharma", role: "Coffee Planter", quote: "IGO AGRI ESTATES made my dream of owning a managed vineyard come true with scientific soil audits." },
              { name: "Anita Desai", role: "HNWI Investor", quote: "The transparency in legal chain verification is what sets Igo apart from any traditional broker." },
              { name: "Vikram Reddy", role: "Estate Owner", quote: "Sold my horticulture asset in record time without any commission overhead. Truly revolutionary." }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-12 rounded-[56px] text-left border-black/5 hover:border-secondary/20 transition-all group shadow-xl"
              >
                <div className="flex text-secondary mb-8 space-x-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="currentColor" />)}
                </div>
                <p className="text-xl italic mb-10 text-primary font-serif leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-primary rounded-[20px] flex items-center justify-center font-black text-secondary text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-primary">{t.name}</h5>
                    <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-black">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

import { trackVisit } from './lib/trackingService';

function App() {
  const location = useLocation();
  const [settings, setSettings] = useState(getLocalSettings);

  useEffect(() => {
    // Track page views on route change
    trackVisit();
  }, [location.pathname]);

  useEffect(() => {
    return subscribeLocalSync(SETTINGS_SYNC_EVENT, () => setSettings(getLocalSettings()));
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        {/* <GlobalBackground /> */}
        <div className="min-h-screen relative font-sans selection:bg-secondary/30">
          <Navbar />
           <AnimatePresence mode="wait">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/locations" element={<Listings />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/post-requirement" element={<PostRequirement />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/valuation" element={<ValuationSimulator />} />
              <Route path="/ai-report" element={<AIReportPage />} />
              <Route path="/tax-optimizer" element={<TaxOptimizer />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/post-property" element={<PostProperty />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/knowledge-hub" element={<KnowledgeHub />} />
              <Route path="/dashboard" element={<ProtectedRoute><InvestorDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/new" element={<AdminProtectedRoute><PropertyForm /></AdminProtectedRoute>} />
              <Route path="/admin/edit/:id" element={<AdminProtectedRoute><PropertyForm /></AdminProtectedRoute>} />
              <Route path="/services/legal" element={<LegalServices />} />
              <Route path="/services/soil" element={<SoilIntelligence />} />
              <Route path="/policy" element={<Policy />} />
              </Routes>
           </AnimatePresence>

          {settings.enableAI && <AIAssistant />}
          {settings.enableChat && <LiveChatWidget />}

          {/* Institutional Footer */}
          <footer className="bg-primary text-white pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
            <div className="container-pro relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
                <div className="lg:col-span-5">
                  <Link to="/" className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary font-black text-2xl">I</div>
                    <div className="flex flex-col -space-y-1">
                      <span className="font-black text-xl tracking-tight text-white uppercase">Igo Agri</span>
                      <span className="text-[11px] text-secondary font-black uppercase italic tracking-[0.2em]">Estates</span>
                    </div>
                  </Link>
                  <p className="text-white/40 text-lg max-w-md mb-12 leading-relaxed font-light">
                    Defined by transparency, driven by technology. IGO Agriestates is the institutional standard for sustainable land investments.
                  </p>
                  <div className="flex space-x-5">
                    {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map(social => (
                      <button key={social} className="w-14 h-14 border border-white/10 rounded-[20px] flex items-center justify-center hover:bg-secondary hover:text-primary transition-all text-xs font-black uppercase tracking-widest hover:border-secondary shadow-lg">
                        {social[0]}
                      </button>
                    ))}
                  </div>
                </div>

                 <div className="lg:col-span-3">
                   <h5 className="font-black mb-10 uppercase tracking-[0.4em] text-secondary text-[10px]">Asset Portals</h5>
                   <ul className="space-y-6 text-white/50 text-sm font-black uppercase tracking-widest">
                     <li><Link to="/locations" className="hover:text-secondary transition-colors">Browse Estates</Link></li>
                     <li><Link to="/valuation" className="hover:text-secondary transition-colors">Investment Calculator</Link></li>
                     <li><Link to="/ai-report" className="hover:text-secondary transition-colors">AI Valuation Report</Link></li>
                     <li><Link to="/post-property" className="hover:text-secondary transition-colors">List Your Plot</Link></li>
                   </ul>
                 </div>

                <div className="lg:col-span-4">
                  <h5 className="font-black mb-10 uppercase tracking-[0.4em] text-secondary text-[10px]">Intelligence List</h5>
                  <p className="text-sm text-white/40 mb-10 font-light leading-relaxed">Subscribe for priority access to institutional-grade horticulture estates and Bio-CNG feasibility reports.</p>
                  <div className="flex bg-white/5 p-2 rounded-[32px] border border-white/10 focus-within:border-secondary transition-all shadow-inner">
                    <input type="email" placeholder="Institutional Email" className="bg-transparent border-none outline-none px-6 py-4 text-sm w-full text-white placeholder:text-white/20" />
                    <button className="bg-secondary text-primary px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/20">Join</button>
                  </div>
                </div>
              </div>

              <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em]">© 2026 IGO AGRI ESTATES. Cultivating Sustainable Legacies.</p>
                <div className="flex space-x-12 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                  <Link to="/policy" className="hover:text-secondary transition-colors">Legal</Link>
                  <Link to="/policy" className="hover:text-secondary transition-colors">Privacy</Link>
                  <Link to="/policy" className="hover:text-secondary transition-colors">Agri-Policy</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
