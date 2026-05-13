import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, LandPlot, Sprout, TreePine, Building2, CloudSun, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const [searchType, setSearchType] = useState('Buy');
  const [state, setState] = useState('');
  const [locality, setLocality] = useState('');
  const navigate = useNavigate();
  
  const categories = [
    { label: 'Agricultural Land', filter: 'Open Field', icon: <LandPlot size={24} /> },
    { label: 'Horticulture Farm', filter: 'Horticulture', icon: <TreePine size={24} /> },
    { label: 'Plantation Farm', filter: 'Nursery', icon: <Leaf size={24} /> },
    { label: 'Livestock Farm', filter: 'Livestock', icon: <Building2 size={24} /> },
    { label: 'Protected Farm', filter: 'Protected', icon: <Sprout size={24} /> },
  ];

  const topSearches = [
    { label: 'Agricultural Land', category: 'Open Field' },
    { label: 'Horticulture Farm', category: 'Horticulture' },
    { label: 'Plantation Farm', category: 'Nursery' },
    { label: 'Livestock Farm', category: 'Livestock' },
    { label: 'Protected Farm', category: 'Protected' },
    { label: 'Hydroponic Farm', category: 'Hydroponic' },
    { label: 'Mushroom Farm', category: 'Mushroom' },
    { label: 'Microgreens Farm', category: 'Microgreens' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchType) params.append('intent', searchType.toLowerCase());
    if (state) params.append('state', state);
    if (locality) params.append('query', locality);
    navigate(`/listings?${params.toString()}`);
  };

  const handleCategoryClick = (filter: string) => {
    navigate(`/listings?category=${encodeURIComponent(filter)}`);
  };

  return (
    <>
      <section className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden pb-20">
        {/* Landscape Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Agricultural Landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60"></div>
        </div>
        
        <div className="container-pro relative z-10 w-full pt-40 pb-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Tabs */}
            <div className="flex justify-start mb-0 ml-4 md:ml-0">
               <div className="flex rounded-t-2xl overflow-hidden shadow-2xl">
                  <button 
                    onClick={() => setSearchType('Buy')}
                    className={`px-10 py-4 text-xs font-black uppercase tracking-widest transition-all ${searchType === 'Buy' ? 'bg-[#00814a] text-white' : 'bg-white text-primary hover:bg-gray-100'}`}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => setSearchType('Rent')}
                    className={`px-10 py-4 text-xs font-black uppercase tracking-widest transition-all ${searchType === 'Rent' ? 'bg-[#00814a] text-white' : 'bg-white text-primary hover:bg-gray-100'}`}
                  >
                    Rent/Lease
                  </button>
               </div>
            </div>

            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                Agricultural Estate <span className="text-secondary italic font-serif drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">India</span>
              </h1>
              <p className="mt-5 text-white/90 text-lg md:text-xl font-medium max-w-3xl mx-auto drop-shadow-md">
                Buy, sell, rent, or lease agricultural estates with clear land details, buyer enquiries, and seller listing support.
              </p>
            </div>

            {/* Search Console */}
            <div className="bg-white p-2.5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center gap-0 w-full border border-black/5 rounded-b-2xl rounded-tr-2xl">
              <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-black/10 relative">
                <select 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-transparent px-8 py-5 text-sm font-bold text-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="">Select State</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Tamil Nadu</option>
                  <option>Andhra Pradesh</option>
                  <option>Kerala</option>
                  <option>Haryana</option>
                  <option>Rajasthan</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                  <MapPin size={16} />
                </div>
              </div>
              <div className="w-full md:flex-1 border-b md:border-b-0 md:border-r border-black/10">
                <input 
                  type="text" 
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Select or Search Locality" 
                  className="w-full bg-transparent px-8 py-5 text-sm font-medium text-primary outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="w-full md:w-1/4 bg-[#3d444d] text-white px-10 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all rounded-r-xl"
              >
                Search Estates
              </button>
            </div>

            {/* Top Searches */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pb-8">
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] mr-2">Quick Search:</span>
              {topSearches.map((tag, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(`/listings?category=${encodeURIComponent(tag.category)}`)}
                  className="px-5 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black text-white hover:bg-secondary hover:text-primary transition-all uppercase tracking-widest"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Icon Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-black/5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="container-pro">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-black/5">
              {categories.map((cat, i) => (
                <button 
                  key={i} 
                  onClick={() => handleCategoryClick(cat.filter)}
                  className="flex flex-col items-center justify-center py-10 px-4 hover:bg-gray-50 transition-all cursor-pointer group border-b-2 border-transparent hover:border-secondary"
                >
                  <div className="text-primary/40 group-hover:text-secondary transition-all mb-4 group-hover:scale-110">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary text-center group-hover:tracking-[0.3em] transition-all">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* BUY & SELL PROPERTIES Headline */}
      <div className="bg-white py-24 text-center border-b border-black/5">
        <div className="container-pro">
          <p className="text-[10px] font-black text-[#00814a] uppercase tracking-[0.4em] mb-4">Buy, Sell, Rent, Lease</p>
          <h2 className="text-5xl md:text-6xl font-black text-primary uppercase tracking-tighter leading-none">
            Agricultural <span className="text-secondary italic font-serif">Estates Only</span>
          </h2>
          <p className="mt-8 text-lg text-text-muted max-w-2xl mx-auto font-light">
            A focused marketplace for customers who want to buy agricultural estates, sell farmland, post requirements, or list land for serious buyers.
          </p>
          <div className="grid md:grid-cols-4 gap-5 mt-14 text-left">
            {[
              { title: 'Buy Estates', desc: 'Search agricultural land, horticulture farms, plantation farms, livestock farms, protected farms, and dry land.' },
              { title: 'Sell Estates', desc: 'Post your property with location, size, water, access, title status, price, and photos.' },
              { title: 'Post Requirement', desc: 'Tell us your budget, preferred state, land size, crop use, and buying timeline.' },
              { title: 'Get Qualified Leads', desc: 'Connect buyers and sellers through clear estate information and direct enquiry options.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 border border-black/5 rounded-[24px] p-6">
                <h3 className="text-lg font-black text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
