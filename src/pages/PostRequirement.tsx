import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, LandPlot, Phone, Mail, User } from 'lucide-react';
import { submitLead } from '../lib/leadsService';

const PostRequirement: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    budget: '',
    size: '',
    landType: '',
    waterSource: '',
    powerAccess: '',
    estateCategory: '',
    intent: 'Buy',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitLead({
        ...formData,
        type: 'requirement'
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-48 pb-32 text-center">
        <div className="container-pro">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl mx-auto glass p-16 rounded-[40px] border-[#00814a]/20">
            <div className="w-20 h-20 bg-[#00814a] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
              <Send size={32} />
            </div>
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-4">Requirement Posted</h2>
            <p className="text-text-muted">Our team will review your buying requirement and connect you with suitable Agri Estate options.</p>
            <button onClick={() => setIsSuccess(false)} className="mt-10 text-[10px] font-black uppercase tracking-widest text-[#00814a] hover:underline">Post Another</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container-pro">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5 space-y-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[10px] font-black text-[#00814a] uppercase tracking-[0.5em] mb-6">Concierge Service</p>
              <h1 className="text-6xl font-black text-primary uppercase tracking-tighter leading-[0.9] mb-8">
                Tell Us Your <br />Agri Estate <br /><span className="text-secondary italic font-serif">Requirement</span>
              </h1>
              <p className="text-lg text-text-muted font-light leading-relaxed">
                Share your preferred location, budget, land size, water needs, estate type, and buying timeline. IGO will help shortlist suitable agricultural estates.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { label: 'Buyer Requirement', desc: 'We capture budget, acreage, state, preferred use, water needs, and purchase timeline.' },
                { label: 'Estate Shortlisting', desc: 'We help compare agricultural land, horticulture farms, plantation farms, livestock farms, and protected farms.' },
                { label: 'Seller Connection', desc: 'We support site visit, enquiry handoff, document review, and next-step coordination.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 p-6 bg-white rounded-3xl border border-black/5">
                   <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0" />
                   <div>
                     <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">{item.label}</h4>
                     <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleSubmit}
              className="bg-white p-12 rounded-[40px] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] border border-black/5 space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                    />
                    <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Phone Number</label>
                  <div className="relative">
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                    />
                    <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Land Type</label>
                  <select
                    value={formData.landType}
                    onChange={(e) => setFormData({...formData, landType: e.target.value})}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all"
                  >
                    <option value="">Select land type</option>
                    <option>Agricultural Land</option>
                    <option>Horticulture Farm</option>
                    <option>Plantation Farm</option>
                    <option>Livestock Farm</option>
                    <option>Dry Land</option>
                    <option>Rooftop / Indoor Space</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Preferred Estate Category</label>
                  <select
                    value={formData.estateCategory}
                    onChange={(e) => setFormData({...formData, estateCategory: e.target.value})}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all"
                  >
                    <option value="">Any suitable Agri Estate</option>
                    <option>Agricultural Land</option>
                    <option>Horticulture Farm</option>
                    <option>Plantation Farm</option>
                    <option>Livestock Farm</option>
                    <option>Protected Farm</option>
                    <option>Dry Land</option>
                    <option>Organic Farm</option>
                    <option>Fisheries Land</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Water Source</label>
                  <input
                    type="text"
                    value={formData.waterSource}
                    onChange={(e) => setFormData({...formData, waterSource: e.target.value})}
                    placeholder="Borewell, open well, pond, pipeline..."
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Power Access</label>
                  <select
                    value={formData.powerAccess}
                    onChange={(e) => setFormData({...formData, powerAccess: e.target.value})}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all"
                  >
                    <option value="">Select power status</option>
                    <option>Available</option>
                    <option>Nearby</option>
                    <option>Needs setup</option>
                    <option>Solar preferred</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Target Location</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                    />
                    <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Budget Range (INR)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="e.g. 5Cr - 10Cr"
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Additional Requirements</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  placeholder="Tell us about road access, soil condition, fencing, crop use, title preference, or buying timeline..."
                  className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-[#00814a] transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Post Requirement</span>
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRequirement;
