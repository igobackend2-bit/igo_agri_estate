import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Eye,
  MessageCircle,
  TrendingUp,
  Plus,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Home,
  Edit,
  Trash2,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';
import { useProperties } from '../hooks/useProperties';

const SellerDashboard: React.FC = () => {
  const { properties: allProperties } = useProperties();
  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'analytics'>('listings');

  // Mock data for seller's own properties - in real app this would come from auth context
  const myPropertyIds = ['polyhouse-project', 'hydroponic-project', 'open-cultivation-project'];
  const myListings = allProperties.filter(p => myPropertyIds.includes(p.id));

  const stats = {
    totalListings: myListings.length,
    activeListings: myListings.filter(p => p.status === 'Available').length,
    totalViews: 1240,
    totalLeads: 32,
    pendingVerification: 1
  };

  const mockLeads = [
    { id: 1, property: 'Polyhouse Agri Estate', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 9876543210', date: '2026-05-10', status: 'New' },
    { id: 2, property: 'Hydroponic Agri Estate', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211', date: '2026-05-09', status: 'Contacted' },
    { id: 3, property: 'Open Cultivation Estate', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 9876543212', date: '2026-05-08', status: 'Converted' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-yellow-100 text-yellow-700';
      case 'Converted': return 'bg-green-100 text-green-700';
      case 'Reserved': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container-pro max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="heading-xl text-primary mb-2">Seller <span className="text-secondary italic">Dashboard</span></h1>
            <p className="text-text-muted">Manage your listings, track leads, and monitor performance.</p>
          </div>
          <Link to="/post-property" className="btn-premium flex items-center gap-2">
            <Plus size={18} />
            List New Property
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {[
            { label: 'Total Listings', value: stats.totalListings, icon: <Home size={20} className="text-secondary" /> },
            { label: 'Active', value: stats.activeListings, icon: <CheckCircle size={20} className="text-green-600" /> },
            { label: 'Page Views', value: stats.totalViews.toLocaleString(), icon: <Eye size={20} className="text-blue-500" /> },
            { label: 'Leads', value: stats.totalLeads, icon: <MessageCircle size={20} className="text-purple-500" /> },
            { label: 'Pending', value: stats.pendingVerification, icon: <Clock size={20} className="text-orange-500" /> }
          ].map((stat, idx) => (
            <div key={idx} className="glass rounded-[32px] p-6 border-white/60 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-primary transition-colors">
                {stat.icon}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 border-b border-black/10 pb-1">
          {(['listings', 'leads', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-t-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-transparent text-text-muted hover:text-primary hover:bg-black/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myListings.map(prop => (
                  <div key={prop.id} className="bg-white rounded-[40px] border border-black/5 shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
                    <div className="aspect-[16/11] overflow-hidden bg-primary/5 relative">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        prop.status === 'Available' ? 'bg-green-500 text-white' :
                        prop.status === 'Reserved' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {prop.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{prop.title}</h3>
                      <p className="text-sm text-text-muted mb-4">{prop.location}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-black/5">
                        <div className="text-xs text-text-muted">
                          <span className="block font-bold text-primary">{prop.price}</span>
                          {prop.size}
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary" title="Edit">
                            <Edit size={16} />
                          </button>
                          <Link to={`/properties/${prop.id}`} className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary" title="View">
                            <ExternalLink size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add new listing card */}
                <Link to="/post-property" className="bg-gray-50 rounded-[40px] border-2 border-dashed border-black/10 flex items-center justify-center hover:border-secondary hover:bg-secondary/5 transition-all group min-h-[380px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus size={24} className="text-secondary" />
                    </div>
                    <p className="font-bold text-primary">Add New Listing</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[40px] border border-black/5 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-primary/5">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Property</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Lead</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Contact</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Date</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {mockLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-6">
                          <p className="font-bold text-primary">{lead.property}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-semibold text-primary">{lead.name}</p>
                          <p className="text-xs text-text-muted">{lead.email}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-primary">{lead.phone}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-sm text-text-muted flex items-center gap-2">
                            <Calendar size={14} />
                            {lead.date}
                          </p>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2">
                            <a href={`tel:${lead.phone}`} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                              <Phone size={16} />
                            </a>
                            <a href={`mailto:${lead.email}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                              <Mail size={16} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                  <h3 className="text-xl font-bold text-primary mb-6">Performance Overview</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-muted">Profile Views</span>
                        <span className="font-bold text-primary">1,240</span>
                      </div>
                      <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-muted">Property Views</span>
                        <span className="font-bold text-primary">3,580</span>
                      </div>
                      <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-muted">Inquiry Rate</span>
                        <span className="font-bold text-primary">2.6%</span>
                      </div>
                      <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                  <h3 className="text-xl font-bold text-primary mb-6">Revenue Estimate</h3>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Expected Deal Value</p>
                      <p className="text-3xl font-black text-secondary">₹28.5 <span className="text-lg">Cr</span></p>
                    </div>
                    <TrendingUp size={24} className="text-green-600 mb-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Polyhouse Project</span>
                      <span className="font-bold">₹8.2 Cr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Hydroponic Project</span>
                      <span className="font-bold">₹6.5 Cr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Open Cultivation</span>
                      <span className="font-bold">₹13.8 Cr</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerDashboard;
