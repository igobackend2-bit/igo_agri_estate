import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Settings, Inbox, ArrowLeft, LogOut, ShieldCheck, Bell, Globe, CreditCard, ChevronRight, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'settings'>('overview');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [visitorInfo, setVisitorInfo] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const sessionId = localStorage.getItem('igo.analytics.sessionId');
    if (sessionId) {
      const visitors = JSON.parse(localStorage.getItem('igo.analytics.visitors') || '[]');
      const current = visitors.find((v: any) => v.id === sessionId);
      if (current) setVisitorInfo(current);
    }
  }, []);

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await updateProfile({ avatar_url: base64String });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      setUploading(false);
    }
  };

  const recentActivity = visitorInfo?.visitedProperties?.slice(0, 5).map((p: any) => ({
    text: `Viewed ${p.title}`,
    time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })) || [
    { text: 'Viewed Polyhouse Estate', time: '2 hours ago' },
    { text: 'Downloaded Brochure: Mushroom Project', time: '1 day ago' },
    { text: 'Signed in from Chennai, IN', time: '2 days ago' },
  ];

  const mockMessages = [
    { id: 1, title: 'Welcome to IGO Agriestates', sender: 'IGO Team', date: 'May 12, 2026', preview: 'Welcome to the premium agricultural estate network. Your account is now active.', read: false },
    { id: 2, title: 'Site Visit Scheduled', sender: 'Operations Dept', date: 'May 10, 2026', preview: 'Your visit to Polyhouse Agri Estate is confirmed for May 15th.', read: true },
    { id: 3, title: 'Market Insight Report', sender: 'IGO Research', date: 'May 08, 2026', preview: 'New report on land appreciation in Tamil Nadu corridor is now available.', read: true },
  ];

  return (
    <div className="pt-48 pb-32 bg-gray-50 min-h-screen">
      <div className="container max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-80 space-y-4">
            <div className="bg-white p-8 rounded-[48px] border border-black/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="flex flex-col items-center text-center mb-8 relative z-10">
                <div 
                  onClick={handleAvatarClick}
                  className="w-28 h-28 bg-primary rounded-[36px] flex items-center justify-center text-white font-black text-4xl mb-4 shadow-xl cursor-pointer group relative overflow-hidden border-4 border-white"
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                  ) : (
                    user?.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest">Update</span>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                
                <h2 className="text-2xl font-black text-primary truncate w-full px-2">{user?.user_metadata?.name || 'Investor'}</h2>
                <p className="text-text-muted text-sm truncate w-full px-2">{user.email}</p>
                <div className="mt-4 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20">
                  Premium Member
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'My Overview', icon: User },
                  { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 1 },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-gray-50 hover:text-primary'}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && activeTab !== item.id && (
                      <span className="w-5 h-5 bg-secondary text-primary text-[10px] rounded-full flex items-center justify-center font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
                
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                    <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-xl">
                    <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-3">
                      <User className="text-secondary" />
                      Professional Profile
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-black/5 font-bold text-primary flex items-center justify-between">
                          <span>{user?.user_metadata?.name || 'Not Provided'}</span>
                          <button className="text-secondary text-[10px] font-black uppercase">Edit</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-black/5 font-bold text-primary flex items-center gap-3">
                          <Mail size={16} className="text-secondary" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Phone Number</label>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-black/5 font-bold text-primary flex items-center justify-between">
                          <span>{user?.user_metadata?.phone || '+91 XXXXX XXXXX'}</span>
                          <button className="text-secondary text-[10px] font-black uppercase">Edit</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Account Role</label>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-black/5 font-bold text-primary flex items-center justify-between">
                          <span className="capitalize">{user?.user_metadata?.role || 'Estate Buyer / Investor'}</span>
                          <button className="text-secondary text-[10px] font-black uppercase">Change</button>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Permanent Address</label>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-black/5 font-bold text-primary flex items-center justify-between">
                          <span className="text-sm">{user?.user_metadata?.address || 'Address not set for official documentation'}</span>
                          <button className="text-secondary text-[10px] font-black uppercase flex-shrink-0 ml-4">Edit Address</button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 p-8 bg-primary/5 rounded-[32px] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                          <ShieldCheck size={24} className="text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">Identity Verified</h4>
                          <p className="text-xs text-text-muted">Your profile is verified for legal land transactions.</p>
                        </div>
                      </div>
                      <button className="bg-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-primary border border-black/5 hover:bg-gray-50 transition-all">
                        View KYC Docs
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl">
                      <h4 className="text-lg font-black text-primary mb-6">Recent Property Interests</h4>
                      <div className="space-y-4">
                        {visitorInfo?.visitedProperties?.length > 0 ? (
                          visitorInfo.visitedProperties.slice(0, 3).map((p: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-primary">{p.title}</span>
                                <span className="text-[10px] text-text-muted">Viewed for {p.duration || '0'}s</span>
                              </div>
                              <CheckCircle size={16} className="text-secondary" />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-text-muted italic py-4">No recent property views found.</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-primary p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden group">
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                      <h4 className="text-lg font-black mb-2 text-secondary">Investment Portfolio</h4>
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-4xl font-black">₹ 0.00</p>
                        <p className="text-xs font-bold opacity-60">Total Active Estates</p>
                      </div>
                      <p className="text-xs font-bold opacity-70">Start your journey by exploring our verified corridor estates.</p>
                      <button 
                        onClick={() => navigate('/listings')}
                        className="mt-8 bg-secondary text-primary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                      >
                        Browse Estates
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'inbox' && (
                <motion.div
                  key="inbox"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[48px] border border-black/5 shadow-xl overflow-hidden"
                >
                  <div className="p-10 border-b border-black/5 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-2xl font-black text-primary flex items-center gap-3">
                      <Inbox size={28} className="text-secondary" />
                      Investor Inbox
                    </h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-secondary border-b-2 border-secondary">Mark All as Read</button>
                  </div>
                  
                  <div className="divide-y divide-black/5">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className={`p-8 hover:bg-gray-50 transition-colors cursor-pointer flex gap-6 ${!msg.read ? 'bg-primary/[0.02]' : ''}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${!msg.read ? 'bg-secondary text-primary shadow-lg' : 'bg-gray-100 text-text-muted'}`}>
                          <MessageSquare size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-lg font-bold truncate ${!msg.read ? 'text-primary' : 'text-text-muted'}`}>{msg.title}</h4>
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex-shrink-0 ml-4">{msg.date}</span>
                          </div>
                          <p className="text-xs font-black text-secondary uppercase tracking-widest mb-2">{msg.sender}</p>
                          <p className="text-sm text-text-muted line-clamp-1">{msg.preview}</p>
                        </div>
                        {!msg.read && (
                          <div className="w-2.5 h-2.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-10 bg-gray-50/50 text-center border-t border-black/5">
                    <p className="text-sm text-text-muted mb-4 font-bold italic">End of messages. You are all caught up!</p>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all">View Archive</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-xl">
                    <h3 className="text-2xl font-black text-primary mb-10 flex items-center gap-3">
                      <Settings size={28} className="text-secondary" />
                      Account Settings
                    </h3>

                    <div className="space-y-10">
                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                          <Bell size={14} className="text-secondary" /> Notifications
                        </h4>
                        <div className="space-y-4">
                          {[
                            { label: 'Market Alerts', desc: 'New estate launches and price drops', enabled: true },
                            { label: 'Project Updates', desc: 'Updates on your viewed or saved estates', enabled: true },
                            { label: 'Newsletter', desc: 'Weekly digest of agri-investment news', enabled: false },
                          ].map((pref, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-black/5">
                              <div>
                                <p className="font-bold text-primary">{pref.label}</p>
                                <p className="text-xs text-text-muted">{pref.desc}</p>
                              </div>
                              <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${pref.enabled ? 'bg-secondary' : 'bg-gray-200'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${pref.enabled ? 'left-6' : 'left-0.5'}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                          <Globe size={14} className="text-secondary" /> Preferences
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 rounded-3xl border border-black/5 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Currency</p>
                              <p className="font-bold text-primary">Indian Rupee (₹)</p>
                            </div>
                            <ChevronRight size={18} className="text-text-muted" />
                          </div>
                          <div className="p-6 bg-gray-50 rounded-3xl border border-black/5 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Language</p>
                              <p className="font-bold text-primary">English (US)</p>
                            </div>
                            <ChevronRight size={18} className="text-text-muted" />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                          <CreditCard size={14} className="text-secondary" /> Billing & Tiers
                        </h4>
                        <div className="p-6 bg-primary text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary">
                              <CheckCircle size={24} />
                            </div>
                            <div>
                              <p className="font-black">Investor Premium</p>
                              <p className="text-xs opacity-60">Active until Dec 2026</p>
                            </div>
                          </div>
                          <button className="bg-secondary text-primary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg">Manage Plan</button>
                        </div>
                      </section>
                    </div>

                    <div className="mt-12 pt-10 border-t border-black/5 flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all shadow-xl">Save All Changes</button>
                      <button className="flex-1 border border-red-200 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-all">Deactivate Account</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
