import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, IndianRupee, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../lib/leadsService';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from './modals/AuthRequiredModal';

interface LeadCaptureFormProps {
  propertyTitle: string;
  propertyId?: string;
}

const igoPhone = '918376883780';
const igoEmail = 'info@igoagritechfarms.com';

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ propertyTitle, propertyId }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'visit' | 'offer' | 'callback'>('visit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: '',
    email: user?.email || '',
    date: '',
    time: 'Morning (9AM - 12PM)',
    offer: '',
    purpose: 'Buy this estate'
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    
    const timeValue = formData.time === 'Custom' ? formData.customTime : formData.time;

    const lines = [
      `IGO Agritech Farms Agri Estate Enquiry`,
      `Estate: ${propertyTitle}`,
      propertyId ? `Estate ID: ${propertyId}` : '',
      `Request Type: ${activeTab}`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      activeTab === 'visit' ? `Preferred Date: ${formData.date}` : '',
      (activeTab === 'visit' || activeTab === 'callback') ? `Preferred Time: ${timeValue}` : '',
      activeTab === 'offer' ? `Approx Budget / Offer: ${formData.offer} Cr` : '',
      `Purpose: ${formData.purpose}`,
      `Please share estate details, seller process, site visit availability, documents, and next steps.`,
    ].filter(Boolean);

    const message = lines.join('\n');
    const result = await submitLead({
      type: activeTab,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      property_id: propertyId,
      property_title: propertyTitle,
      offer_amount: formData.offer ? Number(formData.offer) * 10000000 : undefined,
      preferred_date: formData.date || undefined,
      preferred_time: (activeTab === 'visit' || activeTab === 'callback') ? timeValue : undefined,
      intent: formData.purpose,
      notes: message,
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmitted(true);
      // Fixed WhatsApp phone number with + prefix
      window.open(`https://wa.me/+${igoPhone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }
  };

// ... inside state
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: '',
    email: user?.email || '',
    date: '',
    time: 'Morning (9AM - 12PM)',
    customTime: '',
    offer: '',
    purpose: 'Buy this estate'
  });

// ... inside JSX
          {activeTab === 'visit' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Preferred Date</label>
                <input 
                   type="date" 
                   required 
                   min={today}
                   value={formData.date}
                   onChange={(e) => setFormData({...formData, date: e.target.value})}
                   className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Time Preference</label>
                  <select 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary cursor-pointer"
                  >
                    <option>Morning (9AM - 12PM)</option>
                    <option>Afternoon (12PM - 4PM)</option>
                    <option>Custom</option>
                  </select>
                </div>
                {formData.time === 'Custom' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Specify Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 11:30 AM" 
                      value={formData.customTime}
                      onChange={(e) => setFormData({...formData, customTime: e.target.value})}
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'callback' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Preferred Callback Time</label>
                  <select 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary cursor-pointer"
                  >
                    <option>Immediate (ASAP)</option>
                    <option>Morning (9AM - 12PM)</option>
                    <option>Afternoon (12PM - 4PM)</option>
                    <option>Evening (4PM - 7PM)</option>
                    <option>Custom</option>
                  </select>
                </div>
                {formData.time === 'Custom' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Specify Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Monday 10AM" 
                      value={formData.customTime}
                      onChange={(e) => setFormData({...formData, customTime: e.target.value})}
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Buyer Purpose */}
          <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 mt-6">
             <div className="flex items-center space-x-2 mb-4 text-primary">
                <FileText size={16} className="text-secondary" />
                <h4 className="font-bold text-sm">Buyer Purpose</h4>
             </div>
             <select
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="w-full bg-white border border-black/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary cursor-pointer"
             >
              <option>Buy this estate</option>
              <option>Schedule site visit</option>
              <option>Discuss price</option>
              <option>Request documents</option>
              <option>Need similar estates</option>
             </select>
          </div>

          <div className="space-y-4 pt-4 border-t border-black/5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Phone Number</label>
              <input 
                type="tel" 
                required 
                placeholder="+91 XXXXX XXXXX" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" 
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-secondary px-8 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-primary-light transition-all shadow-xl shadow-primary/20 disabled:opacity-60">
            {isSubmitting ? 'Sending to Admin...' : activeTab === 'visit' ? 'Schedule Site Visit' : activeTab === 'offer' ? 'Request Estate Proposal' : 'Request Callback'}
          </button>
        </form>
        )}

        <div className="mt-6 flex items-center justify-center space-x-2 text-text-muted">
          <ShieldCheck size={14} className="text-secondary" />
          <span className="text-[9px] font-black uppercase tracking-widest">Saved in admin leads before WhatsApp follow-up</span>
        </div>
      </div>

      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        message={`Please sign in to schedule a ${activeTab === 'visit' ? 'site visit' : activeTab === 'offer' ? 'proposal' : 'callback'} for ${propertyTitle}.`}
      />
    </div>
  );
};

export default LeadCaptureForm;
