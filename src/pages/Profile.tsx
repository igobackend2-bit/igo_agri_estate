import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Clock, 
  Bell, 
  History, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Inbox,
  Eye,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'activity' | 'settings'>('overview');
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load visitor logs (mock for now, but wired to localStorage)
    const logs = JSON.parse(localStorage.getItem('igo.visitor_logs') || '[]');
    setVisitorLogs(logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    // Load notifications
    const savedNotifications = JSON.parse(localStorage.getItem('igo.notifications') || '[]');
    setNotifications(savedNotifications.length ? savedNotifications : [
      { id: 1, title: 'Welcome to IGO Agriestates', message: 'Your institutional profile is now active. You can now request site visits and drone tours.', time: 'Just now', read: false },
      { id: 2, title: 'Estate Update', message: 'Mahabalipuram Teak Estate has 2 units remaining. Check updated ROI projections.', time: '2 hours ago', read: false }
    ]);
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const stats = [
    { label: 'Network Tier', value: 'Prime Investor', icon: ShieldCheck, color: 'text-secondary' },
    { label: 'Active Enquiries', value: '3 Assets', icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Site Visits', value: '1 Scheduled', icon: Clock, color: 'text-orange-500' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container-pro">
        <div className="grid lg:grid-cols-[380px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white rounded-[48px] p-10 border border-black/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-primary -z-10"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-topo opacity-10 -z-10 pointer-events-none"></div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-secondary rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-2xl relative group cursor-pointer border-4 border-white">
                  <User className="text-primary" size={64} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[36px] flex items-center justify-center">
                    <Settings className="text-white" size={24} />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-primary tracking-tighter uppercase mb-1">{user.email?.split('@')[0]}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">{user.email}</p>
                
                <div className="flex justify-center gap-4">
                  <button onClick={() => setActiveTab('settings')} className="p-4 rounded-2xl bg-gray-50 hover:bg-secondary/10 text-text-muted hover:text-primary transition-all border border-black/5">
                    <Settings size={20} />
                  </button>
                  <button onClick={handleSignOut} className="p-4 rounded-2xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-100">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                {['overview', 'inbox', 'activity', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-50 text-text-muted hover:bg-white border border-black/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      {tab === 'overview' && <Briefcase size={16} />}
                      {tab === 'inbox' && <Inbox size={16} />}
                      {tab === 'activity' && <History size={16} />}
                      {tab === 'settings' && <Settings size={16} />}
                      {tab}
                    </div>
                    <ChevronRight size={14} className={activeTab === tab ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-10 pointer-events-none"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-6">Investment Blueprint</p>
               <div className="space-y-6">
                 {stats.map((stat, i) => (
                   <div key={i} className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                       <stat.icon size={20} />
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">{stat.label}</p>
                       <p className="text-sm font-bold text-white">{stat.value}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[48px] p-10 border border-black/5 shadow-xl">
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8">Professional Profile</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Full Legal Name</label>
                          <p className="text-lg font-bold text-primary">{user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unspecified'}</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Identity Contact</label>
                          <p className="text-lg font-bold text-primary">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Investor Category</label>
                          <p className="text-lg font-bold text-primary">Institutional Agri-Investor</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Communication Hub</label>
                          <p className="text-lg font-bold text-primary">Tamil Nadu, India</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[48px] p-10 border border-black/5 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Recent Alerts</h3>
                        <Bell className="text-secondary" size={24} />
                      </div>
                      <div className="space-y-4">
                        {notifications.slice(0, 3).map((n) => (
                          <div key={n.id} className="p-5 rounded-2xl bg-gray-50 hover:bg-white border border-black/5 transition-all group">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{n.title}</p>
                            <p className="text-xs text-text-muted line-clamp-1">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-secondary rounded-[48px] p-10 shadow-xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-2">Need Assistance?</h3>
                        <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Our estate desk is live</p>
                      </div>
                      <button className="mt-8 w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                        Contact Estate Team
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
                  className="bg-white rounded-[48px] p-10 border border-black/5 shadow-xl min-h-[600px]"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">Institutional Inbox</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">Real-time updates & platform messages</p>
                    </div>
                    <div className="bg-secondary/10 px-4 py-2 rounded-full">
                       <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{notifications.length} Unread</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-8 rounded-[32px] border transition-all ${n.read ? 'bg-gray-50 border-black/5 opacity-60' : 'bg-white border-secondary/20 shadow-lg border-l-8 border-l-secondary'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.read ? 'bg-gray-200 text-gray-500' : 'bg-secondary/20 text-secondary'}`}>
                              <MessageSquare size={20} />
                            </div>
                            <h4 className="text-lg font-black text-primary uppercase tracking-tight">{n.title}</h4>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{n.time}</span>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed pl-13">{n.message}</p>
                        {!n.read && (
                          <div className="mt-6 flex justify-end">
                            <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-2">
                              Mark as read <CheckCircle2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[48px] p-10 border border-black/5 shadow-xl min-h-[600px]"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">Asset Engagement</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">Your estate browsing & interest history</p>
                    </div>
                    <Eye className="text-secondary" size={32} />
                  </div>

                  <div className="space-y-6">
                    {visitorLogs.length > 0 ? visitorLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                           <div className="w-full h-full bg-primary flex items-center justify-center text-secondary font-black text-xl">IGO</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-primary uppercase tracking-tight mb-1">{log.title}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1">
                              <Clock size={12} /> {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${log.duration > 30 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                              {log.duration > 30 ? 'High Interest' : 'Brief View'} • {log.duration}s
                            </span>
                          </div>
                        </div>
                        <button className="p-4 rounded-2xl bg-white border border-black/5 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-secondary hover:border-secondary">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                           <AlertCircle className="text-text-muted/30" size={40} />
                        </div>
                        <h4 className="text-xl font-black text-primary uppercase tracking-tighter mb-2">No activity recorded</h4>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Start exploring estates to build your portfolio</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                   key="settings"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white rounded-[48px] p-10 border border-black/5 shadow-xl min-h-[600px]"
                >
                   <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8">Security & Preferences</h3>
                   <div className="space-y-10">
                     <section>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-6">Security Layer</h4>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-black/5">
                           <div>
                             <p className="text-sm font-bold text-primary">Biometric / Password Auth</p>
                             <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">Multi-stage verification active</p>
                           </div>
                           <button className="px-6 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Change</button>
                         </div>
                         <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-black/5">
                           <div>
                             <p className="text-sm font-bold text-primary">Session Protection</p>
                             <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">Automatic logout after 24h</p>
                           </div>
                           <div className="w-12 h-6 bg-secondary rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full"></div>
                           </div>
                         </div>
                       </div>
                     </section>

                     <section>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-6">Email Governance</h4>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-black/5">
                           <div>
                             <p className="text-sm font-bold text-primary">Investment Reports</p>
                             <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-1">Monthly portfolio summaries</p>
                           </div>
                           <div className="w-12 h-6 bg-secondary rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full"></div>
                           </div>
                         </div>
                       </div>
                     </section>
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
