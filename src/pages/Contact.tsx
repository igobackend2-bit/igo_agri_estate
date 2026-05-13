import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { submitLead } from '../lib/leadsService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitLead({
        ...formData,
        type: 'contact'
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-pro">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <p className="text-[10px] font-black text-[#00814a] uppercase tracking-[0.5em] mb-6">Connect With Us</p>
          <h1 className="text-6xl font-black text-primary uppercase tracking-tighter leading-none mb-8">
            The Institutional <br /><span className="text-secondary italic font-serif">Support Desk</span>
          </h1>
          <p className="text-xl text-text-muted font-light leading-relaxed">
            Have questions about a specific listing or our managed services? Our experts are here to help you navigate the landscape of agricultural investments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-10 rounded-[40px] border-black/5">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-10">Regional Offices</h3>
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary mb-1">Main Office</h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                      No 17, Kovalan Street, 2nd Main Road,<br />
                      Uthandi Kanathur, Chennai - 600119
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary mb-1">Contact Line</h4>
                    <p className="text-xs text-text-muted leading-relaxed">+91 7397789803</p>
                    <p className="text-xs text-text-muted leading-relaxed">+91 7397789804</p>
                    <p className="text-xs text-text-muted leading-relaxed">+91 7397789805</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary mb-1">Email Desk</h4>
                    <p className="text-xs text-text-muted leading-relaxed">bankingbackend.indiagreen@gmail.com</p>
                    <p className="text-xs text-text-muted leading-relaxed">bd2@igogroups.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {isSuccess ? (
              <div className="bg-emerald-50 p-16 rounded-[40px] border border-emerald-100 text-center flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8">
                  <Send size={32} />
                </div>
                <h3 className="text-3xl font-black text-emerald-900 uppercase tracking-tighter mb-4">Message Sent</h3>
                <p className="text-emerald-700/60 font-medium">Thank you for reaching out. A relationship manager will be in touch shortly.</p>
                <button onClick={() => setIsSuccess(false)} className="mt-10 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:underline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[40px] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] border border-black/5 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Inquiry about Sandalwood Estates"
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Your Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    placeholder="How can we assist you today?"
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-sm focus:ring-2 focus:ring-[#00814a] transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-[#00814a] transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
