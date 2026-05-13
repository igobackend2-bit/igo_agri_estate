import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Plus, Settings, Users, LogOut, Search, Edit, Trash2, TrendingUp, MapPin, IndianRupee, ShieldCheck, Phone, Mail, RefreshCw, Eye, EyeOff, Save, CheckCircle, Bell, Globe, Lock, Clock, CheckSquare, Square, MinusSquare, FileText, Video, X, Calendar, User, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { fetchLeads, LeadData } from '../../lib/leadsService';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import DeleteModal from './DeleteModal';
import {
  getLocalSettings,
  LEAD_SYNC_EVENT,
  saveLocalSettings,
  SETTINGS_SYNC_EVENT,
  subscribeLocalSync,
  getLocalBlogs,
  saveLocalBlogs,
  getLocalVideos,
  saveLocalVideos,
  BlogItem,
  VideoItem,
  BLOG_SYNC_EVENT,
  VIDEO_SYNC_EVENT
} from '../../lib/localSync';

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
const daysLeft = (soldAt?: string) => {
  if (!soldAt) return 5;
  return Math.max(0, 5 - Math.floor((Date.now() - new Date(soldAt).getTime()) / 86400000));
};
const TYPE_COLORS: Record<string, string> = {
  visit: 'bg-blue-50 text-blue-600 border-blue-100',
  offer: 'bg-green-50 text-green-600 border-green-100',
  callback: 'bg-orange-50 text-orange-600 border-orange-100',
  requirement: 'bg-purple-50 text-purple-600 border-purple-100',
  contact: 'bg-gray-50 text-gray-600 border-gray-100',
};

import { getVisitors, VisitorSession } from '../../lib/trackingService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { properties, updateStatus, deleteProperty, refresh } = useProperties();
  const [search, setSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [tab, setTab] = useState<'inventory' | 'leads' | 'blogs' | 'videos' | 'analytics' | 'settings'>('inventory');
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [leadsNotification, setLeadsNotification] = useState(0);
  const [settings, setSettings] = useState(getLocalSettings);
  
  // Blog and Video state
  const [blogs, setBlogs] = useState<BlogItem[]>(getLocalBlogs());
  const [videos, setVideos] = useState<VideoItem[]>(getLocalVideos());
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [uploading, setUploading] = useState(false);

  // Analytics state
  const [visitors, setVisitors] = useState<VisitorSession[]>([]);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    const data = await fetchLeads();
    setLeads(data);
    setLeadsLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'leads') {
      setLeadsNotification(0); // Clear notifications when viewing
      loadLeads();
    }
    if (tab === 'analytics') {
      setVisitors(getVisitors());
    }
  }, [tab, loadLeads]);

  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const imageFile = (e.currentTarget.elements.namedItem('imageFile') as HTMLInputElement).files?.[0];
    
    let imageUrl = formData.get('image') as string;
    if (imageFile) {
      imageUrl = await handleFileUpload(imageFile);
    }

    const blog: BlogItem = {
      id: editingBlog?.id || String(Date.now()),
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      author: formData.get('author') as string,
      date: formData.get('date') as string,
      image: imageUrl || editingBlog?.image || '',
    };

    const nextBlogs = editingBlog 
      ? blogs.map(b => b.id === editingBlog.id ? blog : b)
      : [blog, ...blogs];
    
    saveLocalBlogs(nextBlogs);
    setShowBlogModal(false);
    setEditingBlog(null);
    setUploading(false);
  };

  const handleSaveVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const thumbFile = (e.currentTarget.elements.namedItem('thumbFile') as HTMLInputElement).files?.[0];
    const videoFile = (e.currentTarget.elements.namedItem('videoFile') as HTMLInputElement).files?.[0];

    let thumbUrl = formData.get('thumb') as string;
    if (thumbFile) {
      thumbUrl = await handleFileUpload(thumbFile);
    }

    let videoUrl = formData.get('url') as string;
    if (videoFile) {
      videoUrl = await handleFileUpload(videoFile);
    }

    const video: VideoItem = {
      id: editingVideo?.id || String(Date.now()),
      title: formData.get('title') as string,
      views: formData.get('views') as string,
      thumb: thumbUrl || editingVideo?.thumb || '',
      url: videoUrl || editingVideo?.url || '',
    };

    const nextVideos = editingVideo 
      ? videos.map(v => v.id === editingVideo.id ? video : v)
      : [video, ...videos];
    
    saveLocalVideos(nextVideos);
    setShowVideoModal(false);
    setEditingVideo(null);
    setUploading(false);
  };

  const deleteBlog = (id: string) => {
    if (confirm('Delete this blog post?')) {
      saveLocalBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const deleteVideo = (id: string) => {
    if (confirm('Delete this trending video?')) {
      saveLocalVideos(videos.filter(v => v.id !== id));
    }
  };

  const NAV = [
    { id: 'inventory', label: 'Asset Inventory', icon: LayoutDashboard },
    { id: 'leads', label: 'Investment Pipeline', icon: Users },
    { id: 'blogs', label: 'Content: Blogs', icon: FileText },
    { id: 'videos', label: 'Content: Videos', icon: Video },
    { id: 'analytics', label: 'Visitor Activity', icon: Eye },
    { id: 'settings', label: 'Global Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Estates', value: properties.length, icon: LayoutDashboard, color: 'text-primary' },
    { label: 'Available', value: properties.filter(p => p.status === 'Available').length, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Booked', value: properties.filter(p => p.status === 'Reserved').length, icon: Clock, color: 'text-orange-500' },
    { label: 'Sold', value: properties.filter(p => p.status === 'Sold').length, icon: ShieldCheck, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <DeleteModal
        isOpen={!!deleteTarget}
        estateName={deleteTarget?.name || ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Blog Modal */}
      <AnimatePresence>
        {showBlogModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] w-full max-w-xl p-10 relative shadow-2xl">
              <button onClick={() => setShowBlogModal(false)} className="absolute top-8 right-8 text-text-muted hover:text-primary transition-colors"><X size={24} /></button>
              <h2 className="text-3xl font-black text-primary mb-8 uppercase tracking-tighter">{editingBlog ? 'Edit Blog' : 'Add New Blog'}</h2>
              <form onSubmit={handleSaveBlog} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Blog Title</label>
                  <input name="title" defaultValue={editingBlog?.title} required className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Category</label>
                    <input name="category" defaultValue={editingBlog?.category} placeholder="e.g. Market Insights" className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Author</label>
                    <input name="author" defaultValue={editingBlog?.author} className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Date</label>
                    <input name="date" type="text" defaultValue={editingBlog?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Image URL (Optional)</label>
                    <input name="image" defaultValue={editingBlog?.image} placeholder="/images/blog/..." className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Or Upload Image</label>
                  <input name="imageFile" type="file" accept="image/*" className="w-full text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/5 file:text-primary hover:file:bg-primary/10 transition-all cursor-pointer" />
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-xl disabled:opacity-50">
                  {uploading ? 'Processing...' : editingBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] w-full max-w-xl p-10 relative shadow-2xl">
              <button onClick={() => setShowVideoModal(false)} className="absolute top-8 right-8 text-text-muted hover:text-primary transition-colors"><X size={24} /></button>
              <h2 className="text-3xl font-black text-primary mb-8 uppercase tracking-tighter">{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
              <form onSubmit={handleSaveVideo} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Video Title</label>
                  <input name="title" defaultValue={editingVideo?.title} required className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Initial Views</label>
                    <input name="views" defaultValue={editingVideo?.views || '0'} className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Thumbnail URL (Optional)</label>
                    <input name="thumb" defaultValue={editingVideo?.thumb} placeholder="/images/blog/..." className="w-full bg-gray-50 border border-black/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Or Upload Thumb</label>
                    <input name="thumbFile" type="file" accept="image/*" className="w-full text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/5 file:text-primary hover:file:bg-primary/10 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Upload Video File</label>
                    <input name="videoFile" type="file" accept="video/*" className="w-full text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/5 file:text-primary hover:file:bg-primary/10 cursor-pointer" />
                  </div>
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-xl disabled:opacity-50">
                  {uploading ? 'Processing...' : editingVideo ? 'Update Video' : 'Publish Video'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col fixed inset-y-0 z-40">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-black text-xl">I</div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-lg tracking-tight uppercase">Igo Admin</span>
              <span className="text-[10px] text-secondary font-black uppercase italic tracking-[0.2em]">Management Portal</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-5 space-y-1 mt-4">
          {NAV.map(item => {
            const hasAlert = item.id === 'leads' && leadsNotification > 0;
            return (
              <button key={item.id} onClick={() => { setTab(item.id as any); if (item.id === 'leads') setLeadsNotification(0); }}
                className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${tab === item.id ? 'bg-secondary text-primary' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {hasAlert && (
                  <span className="ml-auto w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-primary"></span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-5 space-y-2 border-t border-white/5">
          <button onClick={() => navigate('/admin/new')}
            className="w-full flex items-center space-x-3 px-5 py-3 rounded-2xl bg-secondary text-primary font-black text-sm hover:bg-white transition-all">
            <Plus size={18} />
            <span>Add New Estate</span>
          </button>
          <button onClick={() => { localStorage.removeItem('isAdminAuthenticated'); navigate('/admin'); }}
            className="w-full flex items-center space-x-3 px-5 py-3 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all font-bold text-sm">
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-72 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter mb-1">
              {tab === 'inventory' ? 'Estate Inventory' : 
               tab === 'leads' ? 'Investment Pipeline' : 
               tab === 'blogs' ? 'Blog Management' : 
               tab === 'videos' ? 'Trending Videos' : 'Portal Settings'}
            </h1>
            <p className="text-text-muted text-sm">Live control — changes reflect immediately on the public site.</p>
          </div>
        </header>

        {!isSupabaseConfigured && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 bg-orange-50 border border-orange-100 rounded-[32px] flex items-center gap-6 shadow-sm"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
              <RefreshCw size={28} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <p className="font-black text-orange-900 text-lg uppercase tracking-tight">Local Sync Mode Active</p>
              <p className="text-orange-700 text-sm font-medium">Supabase environment variables are missing. Data is currently stored in <span className="font-bold underline">Local Storage</span> and synced across open tabs in this browser only.</p>
            </div>
            <button 
              onClick={() => window.open('https://app.supabase.com', '_blank')}
              className="ml-auto bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
            >
              Configure Database
            </button>
          </motion.div>
        )}

        {/* INVENTORY */}
        {tab === 'inventory' && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-5">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] border border-black/5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center"><s.icon size={20} className={s.color} /></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
             </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/10 border-2 border-secondary rounded-2xl p-4 mb-4 flex items-center gap-6"
              >
                <div className="flex items-center gap-3">
                  <button onClick={clearSelection} className="p-2 hover:bg-white/50 rounded-lg transition-all">
                    <MinusSquare size={20} className="text-primary" />
                  </button>
                  <span className="font-black text-primary">{selectedIds.size} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => bulkUpdateStatus('Available')} className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all">
                    Mark Available
                  </button>
                  <button onClick={() => bulkUpdateStatus('Reserved')} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                    Mark Reserved
                  </button>
                  <button onClick={() => bulkUpdateStatus('Sold')} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                    Mark Sold
                  </button>
                  <button onClick={bulkDelete} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-light transition-all">
                    Delete
                  </button>
                </div>
              </motion.div>
            )}

            <div className="bg-white rounded-[32px] border border-black/5 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="relative w-80">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search estates..." value={search} onChange={e => setSearch(e.target.value)}
                      className="w-full bg-white border border-black/10 rounded-2xl py-3 pl-12 pr-5 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                  {selectedIds.size > 0 && (
                    <button onClick={clearSelection} className="px-4 py-2 bg-gray-200 text-text-muted rounded-xl text-xs font-bold hover:bg-gray-300 transition-all">
                      Clear Selection
                    </button>
                  )}
                </div>
                <button onClick={() => navigate('/admin/new')}
                  className="flex items-center gap-2 bg-secondary text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg">
                  <Plus size={16} /> Add Estate
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 w-12">
                        <button onClick={toggleSelectAll} className="text-text-muted hover:text-secondary transition-all">
                          {selectedIds.size === filtered.length ? <CheckSquare size={20} /> : selectedIds.size > 0 ? <MinusSquare size={20} /> : <Square size={20} />}
                        </button>
                      </th>
                      {['Estate', 'Location', 'Price', 'Status', 'Quick Actions'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-text-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filtered.map(p => {
                      const isSold = p.status === 'Sold';
                      const isUpdating = statusUpdating === p.id;
                      const isSelected = selectedIds.has(p.id);
                      return (
                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className={`transition-colors ${isSold ? 'bg-red-50/30' : isSelected ? 'bg-secondary/10' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-6 py-4">
                            <button onClick={() => toggleSelect(p.id)} className="text-secondary hover:text-primary transition-all">
                              {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0">
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                <p className="font-bold text-primary text-sm">{p.title}</p>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{p.type}</p>
                                {isSold && p.soldAt && (
                                  <p className="text-[9px] text-red-500 font-black flex items-center gap-1 mt-1">
                                    <Clock size={9} /> Removes in {daysLeft(p.soldAt)}d
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-text-muted">
                              <MapPin size={13} className="text-secondary" />
                              <span className="text-xs font-bold">{p.location.split(',')[0]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <IndianRupee size={13} className="text-secondary" />
                              <span className="font-black text-primary text-sm">{p.price}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {(['Available', 'Reserved', 'Sold'] as const).map(s => (
                                <button key={s} disabled={isUpdating}
                                  onClick={() => handleStatusChange(p.id, s)}
                                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                    p.status === s
                                      ? s === 'Available' ? 'bg-green-500 text-white border-green-500'
                                        : s === 'Sold' ? 'bg-red-500 text-white border-red-500'
                                        : 'bg-orange-500 text-white border-orange-500'
                                      : 'bg-white text-text-muted border-black/10 hover:border-primary'
                                  } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}>
                                  {s === 'Reserved' ? 'Book' : s}
                                </button>
                              ))}
                            </div>
                          </td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <button onClick={() => navigate(`/admin/edit/${p.id}`)}
                                 className="p-2 bg-white border border-black/10 rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all">
                                 <Edit size={15} />
                               </button>
                               <button onClick={() => setDeleteTarget({ id: p.id, name: p.title })}
                                 className="p-2 bg-white border border-black/10 rounded-xl text-text-muted hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all">
                                 <Trash2 size={15} />
                               </button>
                             </div>
                           </td>
                        </motion.tr>
                      );
                    })}
                     {filtered.length === 0 && (
                       <tr><td colSpan={6} className="text-center py-16 text-text-muted font-bold">No estates found.</td></tr>
                     )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LEADS */}
        {tab === 'leads' && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-5">
              {[
                { label: 'Total Leads', value: leads.length, color: 'text-primary' },
                { label: 'Site Visits', value: leads.filter(l => l.type === 'visit').length, color: 'text-blue-600' },
                { label: 'Offers', value: leads.filter(l => l.type === 'offer').length, color: 'text-green-600' },
                { label: 'Requirements', value: leads.filter(l => l.type === 'requirement').length, color: 'text-purple-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color}`}>{leadsLoading ? '—' : s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[32px] border border-black/5 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
                <div className="relative w-80">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="text" placeholder="Search leads..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-2xl py-3 pl-12 pr-5 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                </div>
                <button onClick={loadLeads}
                  className="p-3 bg-white border border-black/10 rounded-xl text-text-muted hover:text-primary transition-all">
                  <RefreshCw size={16} />
                </button>
              </div>
              {leadsLoading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        {['Investor', 'Contact', 'Type', 'Estate / Purpose', 'Budget'].map(h => (
                          <th key={h} className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredLeads.map((l, i) => (
                        <tr key={l.id || i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-secondary text-sm flex-shrink-0">
                                {l.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <span className="font-bold text-primary text-sm">{l.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs text-text-muted"><Phone size={11} className="text-secondary" /><span className="font-bold">{l.phone}</span></div>
                              {l.email && <div className="flex items-center gap-1 text-xs text-text-muted"><Mail size={11} className="text-secondary" /><span>{l.email}</span></div>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${TYPE_COLORS[l.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>{l.type}</span>
                          </td>
                          <td className="px-5 py-4">
                            {l.property_title && <p className="font-bold text-primary text-xs">{l.property_title}</p>}
                            <p className="text-[10px] text-secondary font-black uppercase tracking-widest">
                              {l.intent || l.asset_category || l.estateCategory || 'General enquiry'}
                            </p>
                            {l.preferred_date && (
                              <p className="text-[10px] text-text-muted font-bold mt-1">
                                {l.preferred_date}{l.preferred_time ? `, ${l.preferred_time}` : ''}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-xs font-black text-primary">
                              {l.investment_size ? `₹${l.investment_size} Cr` : l.budget ? l.budget : l.offer_amount ? `₹${(l.offer_amount / 10000000).toFixed(2)} Cr` : '—'}
                            </span>
                          </td>

                        </tr>
                      ))}
                       {filteredLeads.length === 0 && (
                         <tr><td colSpan={5} className="text-center py-16 text-text-muted font-bold">No leads found.</td></tr>
                       )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BLOGS */}
        {tab === 'blogs' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="bg-white px-6 py-4 rounded-3xl border border-black/5 flex items-center gap-4">
                <FileText className="text-secondary" />
                <span className="font-black text-primary uppercase tracking-widest text-sm">{blogs.length} Published Articles</span>
              </div>
              <button onClick={() => { setEditingBlog(null); setShowBlogModal(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-secondary hover:text-primary transition-all shadow-xl">
                <Plus size={18} /> New Article
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-xl flex flex-col group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={blog.image} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/blog/farmland.png';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                    />
                    <div className="absolute top-5 left-5 bg-secondary text-primary text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">{blog.category}</div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-primary mb-4 leading-tight">{blog.title}</h3>
                    <div className="flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-widest mb-8">
                      <div className="flex items-center gap-2"><User size={14} className="text-secondary" /> {blog.author}</div>
                      <div className="flex items-center gap-2"><Calendar size={14} className="text-secondary" /> {blog.date}</div>
                    </div>
                    <div className="mt-auto flex gap-3 pt-6 border-t border-black/5">
                      <button onClick={() => { setEditingBlog(blog); setShowBlogModal(true); }} className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border border-black/10 py-3 rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all font-black text-[10px] uppercase tracking-widest">
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => deleteBlog(blog.id)} className="p-3 bg-gray-50 border border-black/10 rounded-xl text-text-muted hover:text-red-500 hover:border-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="col-span-3 text-center py-24 bg-white rounded-[40px] border border-dashed border-black/20 text-text-muted font-bold">No blog posts found.</div>
              )}
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {tab === 'videos' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="bg-white px-6 py-4 rounded-3xl border border-black/5 flex items-center gap-4">
                <Video className="text-secondary" />
                <span className="font-black text-primary uppercase tracking-widest text-sm">{videos.length} Trending Videos</span>
              </div>
              <button onClick={() => { setEditingVideo(null); setShowVideoModal(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-secondary hover:text-primary transition-all shadow-xl">
                <Plus size={18} /> New Video
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-xl flex flex-col group">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={video.thumb} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/properties/polyhouse.png';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"><Play className="text-white fill-white" size={24} /></div>
                    </div>
                  </div>
                  <div className="p-8 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{video.title}</h3>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{video.views} Views • Featured</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingVideo(video); setShowVideoModal(true); }} className="p-3 bg-gray-50 border border-black/10 rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteVideo(video.id)} className="p-3 bg-gray-50 border border-black/10 rounded-xl text-text-muted hover:text-red-500 hover:border-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="col-span-2 text-center py-24 bg-white rounded-[40px] border border-dashed border-black/20 text-text-muted font-bold">No trending videos found.</div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-5">
              {[
                { label: 'Total Sessions', value: visitors.length, icon: Users, color: 'text-primary' },
                { label: 'Avg. Page Views', value: visitors.length ? (visitors.reduce((acc, v) => acc + v.pageViews, 0) / visitors.length).toFixed(1) : 0, icon: TrendingUp, color: 'text-secondary' },
                { label: 'Active Today', value: visitors.filter(v => new Date(v.lastVisit).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'text-green-600' },
                { label: 'Identified Users', value: visitors.filter(v => v.name).length, icon: ShieldCheck, color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] border border-black/5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center"><s.icon size={20} className={s.color} /></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[32px] border border-black/5 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-black text-primary uppercase tracking-tight">Recent Visitor Activity</h3>
                <button onClick={() => setVisitors(getVisitors())} className="p-3 bg-white border border-black/10 rounded-xl text-text-muted hover:text-primary transition-all">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      {['Visitor', 'Last Active', 'Page Views', 'Interests (Lands Visited)', 'Browser'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-text-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {visitors.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary">
                              {v.name?.[0] || 'V'}
                            </div>
                            <div>
                              <p className="font-bold text-primary text-sm">{v.name || 'Anonymous Visitor'}</p>
                              {v.email && <p className="text-[10px] text-text-muted">{v.email}</p>}
                              <p className="text-[9px] text-text-muted font-mono">{v.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-primary">{new Date(v.lastVisit).toLocaleTimeString()}</p>
                          <p className="text-[10px] text-text-muted">{new Date(v.lastVisit).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-black">{v.pageViews}</span>
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="flex flex-wrap gap-2">
                            {v.visitedProperties.map((p, i) => (
                              <span key={i} className="px-2 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold border border-primary/10">
                                {p.title}
                              </span>
                            ))}
                            {v.visitedProperties.length === 0 && <span className="text-[10px] text-text-muted italic">No properties viewed yet</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[10px] text-text-muted truncate w-32" title={v.browser}>{v.browser}</p>
                        </td>
                      </tr>
                    ))}
                    {visitors.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-16 text-text-muted font-bold">No visitor activity recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><Globe size={18} /></div>
                <h3 className="font-black text-primary text-lg">Site Identity</h3>
              </div>
              {[
                { label: 'Site Name', key: 'siteName' },
                { label: 'Contact Phone', key: 'contactPhone' },
                { label: 'Contact Email', key: 'contactEmail' },
                { label: 'WhatsApp Number', key: 'whatsappNumber' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">{f.label}</label>
                  <input value={(settings as any)[f.key]} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><Lock size={18} /></div>
                  <h3 className="font-black text-primary text-lg">Security</h3>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Admin Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={settings.adminPassword}
                      onChange={e => setSettings(s => ({ ...s, adminPassword: e.target.value }))}
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-3 pl-5 pr-12 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><Bell size={18} /></div>
                  <h3 className="font-black text-primary text-lg">System Settings</h3>
                </div>
                 {[
                   { label: 'Maintenance Mode', key: 'maintenanceMode', icon: Settings },
                 ].map(t => (
                  <div key={t.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><t.icon size={14} /></div>
                      <span className="font-bold text-primary text-sm">{t.label}</span>
                    </div>
                    <button onClick={() => setSettings(s => ({ ...s, [t.key]: !(s as any)[t.key] }))}
                      className={`w-12 h-6 rounded-full relative transition-all ${(settings as any)[t.key] ? 'bg-secondary' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${(settings as any)[t.key] ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <button onClick={() => { saveLocalSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-xl">
                {saved ? <><CheckCircle size={20} /><span>Settings Saved!</span></> : <><Save size={20} /><span>Save Configuration</span></>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
