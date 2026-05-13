import React, { useState, useEffect } from 'react';
import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../../components/PropertyCard';
import { useAuth } from '../../context/AuthContext';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { Heart, TrendingUp, Sparkles, MapPin, FileText, Globe, CloudSun, LogOut } from 'lucide-react';
import DocumentAssistant from '../../components/ai/DocumentAssistant';
import ESGTracker from '../../components/ai/ESGTracker';
import SatelliteHeatmap from '../../components/maps/SatelliteHeatmap';
import WeatherRisk from '../../components/ai/WeatherRisk';
import SmartAgronomyAlerts from '../../components/dashboard/SmartAgronomyAlerts';
import { Link, useNavigate } from 'react-router-dom';

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string }> = ({ value, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (value) => setDisplayValue(Math.floor(value))
    });
    return () => controls.stop();
  }, [value]);

  return <>{prefix}{displayValue.toLocaleString()}{suffix}</>;
};

const InvestorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [isDocAssistantOpen, setIsDocAssistantOpen] = React.useState(false);

  // Mocked data for the dashboard
  const savedProperties = properties.slice(0, 2);
  const recommendedProperties = properties.slice(2, 5);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl mb-2">Welcome back, <span className="text-secondary italic">Investor</span></h1>
            <p className="text-text-muted">Here is an overview of your agri-investment interests.</p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl border border-black/5">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold truncate max-w-[150px]">{user?.email}</p>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Premium Member</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm"
          >
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-xl font-bold mb-1">Portfolio Value</h4>
            <p className="text-3xl font-bold text-primary">
              <Counter value={1250000} prefix="₹ " />
            </p>
            <p className="text-xs text-text-muted mt-2">Up 12.4% from last quarter.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm"
          >
            <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-6">
              <Heart size={24} />
            </div>
            <h4 className="text-xl font-bold mb-1">Saved Estates</h4>
            <p className="text-3xl font-bold text-primary">
              <Counter value={savedProperties.length} />
            </p>
            <p className="text-xs text-text-muted mt-2">Properties you are currently watching.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
              <Sparkles size={24} />
            </div>
            <h4 className="text-xl font-bold mb-1">AI Insights</h4>
            <p className="text-lg opacity-80">Based on your activity, now is a great time to explore <span className="font-bold text-secondary">Vineyards in Nashik</span>.</p>
          </motion.div>
        </div>

        {/* Smart Tools */}
        <section className="mb-16">
          <h3 className="text-3xl mb-8 flex items-center">
            <span className="w-2 h-8 bg-primary rounded-full mr-3"></span>
            Smart Tools
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              onClick={() => setIsDocAssistantOpen(true)}
              className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1">Document Assistant</h4>
                  <p className="text-text-muted">Draft lease agreements and legal MoUs with AI.</p>
                </div>
              </div>
            </div>
            
            <Link to="/valuation" className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group block">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CloudSun size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1">Yield Predictor</h4>
                  <p className="text-text-muted">Simulate harvest outcomes based on regional soil data.</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* GIS & Weather Intelligence */}
        <section className="mb-16 grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl flex items-center">
                <MapPin size={28} className="text-secondary mr-3" />
                GIS Layer Analysis
              </h3>
            </div>
            <SatelliteHeatmap />
          </div>
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl flex items-center">
                <CloudSun size={28} className="text-blue-500 mr-3" />
                Weather Risk Matrix
              </h3>
            </div>
            <WeatherRisk />
          </div>
        </section>

        {/* Agronomy Alerts */}
        <section className="mb-16">
          <SmartAgronomyAlerts />
        </section>

        <DocumentAssistant 
          isOpen={isDocAssistantOpen}
          onClose={() => setIsDocAssistantOpen(false)}
        />

        {/* Impact Ledger */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl flex items-center">
              <Globe size={28} className="text-secondary mr-3" />
              Impact Ledger
            </h3>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted italic">Verified ESG Performance</span>
          </div>
          <ESGTracker />
        </section>

        {/* Saved Properties */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl flex items-center">
              <Heart size={28} className="text-red-500 mr-3" />
              Your Wishlist
            </h3>
            <button className="text-primary font-bold border-b-2 border-primary">View All</button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
            {savedProperties.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-[32px] border border-dashed border-black/10">
                <p className="text-text-muted">You haven't saved any properties yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* AI Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl flex items-center">
              <Sparkles size={28} className="text-secondary mr-3" />
              AI Recommendations
            </h3>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Personalized for you</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedProperties.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -top-4 -right-4 z-10 bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  98% Match
                </div>
                <PropertyCard {...prop} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InvestorDashboard;
