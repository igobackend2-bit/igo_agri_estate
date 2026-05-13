import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Maximize, Home, ChevronRight, Search } from 'lucide-react';
import { locations } from '../data/locationEstates';

const Locations: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/5 via-primary/2 to-background py-20 border-b border-black/5">
        <div className="container-pro text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-primary mb-6 leading-tight">
            Estates by <span className="text-secondary italic">Location</span>
          </h1>
          <p className="text-xl text-text-muted font-light leading-relaxed">
            Explore verified agricultural estates in Tamil Nadu's most promising agricultural corridors.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container-pro mt-16">
        <div className="grid grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <p className="text-4xl font-black text-primary">15+</p>
            <p className="text-sm text-text-muted uppercase tracking-wider">Estates</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-secondary">5</p>
            <p className="text-sm text-text-muted uppercase tracking-wider">Locations</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-green-600">18%</p>
            <p className="text-sm text-text-muted uppercase tracking-wider">Avg ROI</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-primary">100%</p>
            <p className="text-sm text-text-muted uppercase tracking-wider">Verified</p>
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {locations.map((loc, idx) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[40px] overflow-hidden border border-black/5 hover:border-secondary/30 hover:shadow-2xl transition-all duration-500 relative"
            >
              {/* Hero Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={loc.heroImage}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-secondary" />
                    <h3 className="text-3xl font-black">{loc.name}</h3>
                  </div>
                  <p className="text-sm opacity-80">{loc.estateCount} Premium Estates</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-text-muted text-sm leading-relaxed mb-6">{loc.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-black/5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Avg Price</p>
                    <p className="font-bold text-primary text-lg">{loc.avgPrice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Avg ROI</p>
                    <p className="font-bold text-green-600 text-lg">{loc.avgRoi}</p>
                  </div>
                </div>

                <Link
                  to={`/listings?location=${loc.id}`}
                  className="block w-full bg-secondary text-primary text-center py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group"
                >
                  Explore {loc.name} Estates
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="mt-24 bg-primary rounded-3xl p-12 md:p-16 text-white">
        <div className="container-pro flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-3xl font-black mb-2">Need help choosing the right location?</h3>
            <p className="text-white/70">Our location advisors can match your goals with the best estate corridor.</p>
          </div>
          <Link
            to="/contact"
            className="bg-white text-primary px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-lg"
          >
            Talk to Advisor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Locations;
