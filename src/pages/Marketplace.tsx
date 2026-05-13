import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Search, SlidersHorizontal, BarChart3, Activity, ShieldCheck, Wallet, Maximize2, ChevronRight } from 'lucide-react';
import CandlestickChart from '../components/charts/CandlestickChart';
import OrderBook from '../components/charts/OrderBook';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings' | 'my-orders'>('listings');

  const shares = [
    { 
      id: 'tk-1', 
      title: 'Bio-CNG Yield Token #12', 
      price: '₹5.5L', 
      change: '+8.2%', 
      vol: '500 Tokens', 
      liquidity: 'High', 
      type: 'Token',
      details: 'Backed by 50-ton daily waste-to-energy plant in Telangana. Guaranteed off-take agreement with OMCs.'
    },
    { 
      id: 'sh-1', 
      title: 'The Royal Teak - Plot 42', 
      price: '₹12.5L', 
      change: '+5.4%', 
      vol: '240 Shares', 
      liquidity: 'High', 
      type: 'Share',
      details: '15-year old premium teak plantation. Harvest cycle scheduled for Q4 2029.'
    },
    { 
      id: 'sh-2', 
      title: 'Golden Harvest - Plot 08', 
      price: '₹8.2L', 
      change: '-1.2%', 
      vol: '120 Shares', 
      liquidity: 'Medium', 
      type: 'Share',
      details: 'High-density Mango orchard in Mysore. Current season yield: 12 tons/acre.'
    },
    { 
      id: 'tk-2', 
      title: 'Solar Agri-Hub Token', 
      price: '₹2.1L', 
      change: '+15.4%', 
      vol: '1000 Tokens', 
      liquidity: 'High', 
      type: 'Token',
      details: 'Decentralized solar grid powering 200+ drip irrigation nodes. Carbon credit revenue included.'
    },
  ];

  return (
    <div className="pt-48 pb-32 bg-background min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-10 pointer-events-none"></div>
      
      <div className="container-pro relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-md border border-black/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-8 shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>Secondary Market Liquidity</span>
              <ChevronRight size={12} />
            </div>
            <h1 className="heading-xl text-primary mb-8">Fractional <br /><span className="text-secondary italic">Exchange</span></h1>
            <p className="text-xl text-text-muted font-light leading-relaxed max-w-2xl">
              Buy and sell fractional ownership shares of premium estates. Secure P2P trading with instant settlement and verified asset backing.
            </p>
          </div>
          <div className="flex items-center space-x-6 w-full lg:w-auto">
            <button className="h-16 w-16 bg-white border border-black/5 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group">
              <Wallet size={24} className="text-primary group-hover:text-secondary transition-colors" />
            </button>
            <button className="btn-premium flex-grow lg:flex-grow-0 min-w-[200px] h-16 rounded-[24px] shadow-2xl shadow-primary/20">
              List Your Assets
            </button>
          </div>
        </div>

        {/* Market Stats - Sleek Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Market Cap', val: '₹124.5 Cr', icon: <Activity className="text-blue-500" /> },
            { label: '24h Volume', val: '₹18.2 L', icon: <BarChart3 className="text-emerald-500" /> },
            { label: 'Active Traders', val: '1,240', icon: <TrendingUp className="text-accent" /> },
            { label: 'Asset Backing', val: 'Agri-Linked', icon: <ShieldCheck className="text-secondary" /> }
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[40px] border-white/60 shadow-xl group hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {stat.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Trading Interface - Fintech Style */}
        <div className="glass rounded-[60px] border-white/60 shadow-2xl overflow-hidden mb-20">
          <div className="flex border-b border-black/5 px-10">
            {['listings', 'my-orders'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-10 py-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                {tab.replace('-', ' ')}
                {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-t-full" />}
              </button>
            ))}
          </div>

          <div className="p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
              <div className="relative flex-grow max-w-md w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter by estate or token..." 
                  className="w-full bg-black/5 border-none rounded-full py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <button className="flex items-center space-x-3 px-8 py-4 bg-black/5 rounded-full font-black text-[10px] uppercase tracking-widest text-primary/60 hover:bg-black/10 transition-all">
                <SlidersHorizontal size={16} />
                <span>Advanced Metrics</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Asset List */}
              <div className="lg:w-2/3 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted border-b border-black/5">
                      <th className="pb-8 px-6">Asset / Class</th>
                      <th className="pb-8 px-6 text-right">Unit Price</th>
                      <th className="pb-8 px-6 text-right">24h Volatility</th>
                      <th className="pb-8 px-6 text-center">Liquidity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {shares.map((share) => (
                      <tr key={share.id} className="group hover:bg-black/5 transition-all cursor-pointer">
                        <td className="py-8 px-6">
                          <div>
                            <p className="font-bold text-primary text-lg">{share.title}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">{share.type} • Vol: {share.vol}</p>
                            <p className="text-[10px] text-primary/40 mt-2 max-w-xs font-light leading-relaxed">{share.details}</p>
                          </div>
                        </td>
                        <td className="py-8 px-6 text-right font-black text-primary">{share.price}</td>
                        <td className={`py-8 px-6 text-right font-black ${share.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="flex items-center justify-end">
                            {share.change.startsWith('+') ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                            {share.change}
                          </span>
                        </td>
                        <td className="py-8 px-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            share.liquidity === 'High' ? 'bg-green-100 text-green-700' : 
                            share.liquidity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {share.liquidity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Live Trading Desk */}
              <div className="lg:w-1/3">
                <div className="bg-primary text-white rounded-[48px] p-8 shadow-2xl relative overflow-hidden border border-white/10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="font-bold text-xl mb-1">The Royal Teak</h4>
                      <p className="text-secondary font-black text-sm tracking-widest">₹1.24L <span className="text-white/40 ml-2 font-light">+5.4%</span></p>
                    </div>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                      <Maximize2 size={18} />
                    </button>
                  </div>
                  
                  <div className="mb-8 bg-black/20 rounded-[32px] p-6 border border-white/5">
                    <CandlestickChart />
                  </div>

                  <div className="mb-8 bg-black/20 rounded-[32px] p-6 border border-white/5">
                    <OrderBook />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <button className="bg-secondary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                      BUY
                    </button>
                    <button className="bg-red-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-red-500 transition-all">
                      SELL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
