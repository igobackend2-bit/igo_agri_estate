import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Plus, Settings, Users, LogOut, Search, Edit, Trash2, TrendingUp, MapPin, IndianRupee, ShieldCheck, Phone, Mail, RefreshCw, Eye, EyeOff, Save, CheckCircle, Bell, Globe, Lock, Clock, CheckSquare, Square, MinusSquare, FileText, Video, X, Calendar, User, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { fetchLeads, LeadData } from '../../lib/leadsService';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import DeleteModal from './DeleteModal';
import {
  getLocalSettings,
  saveLocalSettings,
  getLocalBlogs,
  saveLocalBlogs,
  getLocalVideos,
  saveLocalVideos,
  BlogItem,
  VideoItem
} from '../../lib/localSync';
import { getVisitors, VisitorSession } from '../../lib/trackingService';

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
  
  const [blogs, setBlogs] = useState<BlogItem[]>(getLocalBlogs());
  const [videos, setVideos] = useState<VideoItem[]>(getLocalVideos());
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [visitors, setVisitors] = useState<VisitorSession[]>([]);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    const data = await fetchLeads();
    setLeads(data);
    setLeadsLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'leads') {
      setLeadsNotification(0);
      loadLeads();
    }
    if (tab === 'analytics') {
      setVisitors(getVisitors());
    }
  }, [tab, loadLeads]);

  const filtered = useMemo(() => {
    return properties.filter(p => 
      (p.title?.toLowerCase().includes(search.toLowerCase()) ?? false) || 
      (p.location?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  }, [properties, search]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      (l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ?? false) || 
      (l.phone?.includes(leadSearch) ?? false) ||
      (l.property_title?.toLowerCase().includes(leadSearch.toLowerCase()) ?? false)
    );
  }, [leads, leadSearch]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(p => p.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleStatusChange = async (id: string, status: any) => {
    setStatusUpdating(id);
    const success = await updateStatus(id, status);
    if (success) refresh();
    setStatusUpdating(null);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      const success = await deleteProperty(deleteTarget.id);
      if (success) {
        refresh();
        setDeleteTarget(null);
      }
    }
  };

  const bulkUpdateStatus = async (status: any) => {
    setStatusUpdating('bulk');
    for (const id of selectedIds) {
      await updateStatus(id, status);
    }
    refresh();
    setSelectedIds(new Set());
    setStatusUpdating(null);
  };

  const bulkDelete = async () => {
    if (confirm(`Delete ${selectedIds.size} selected estates?`)) {
      setStatusUpdating('bulk');
      for (const id of selectedIds) {
        await deleteProperty(id);
      }
      refresh();
      setSelectedIds(new Set());
      setStatusUpdating(null);
    }
  };

  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData(e.currentTarget);
      const imageFile = (e.currentTarget.elements.namedItem('imageFile') as HTMLInputElement).files?.[0];
      let imageUrl = formData.get('image') as string;
      if (imageFile) imageUrl = await handleFileUpload(imageFile);

      const blog: BlogItem = {
        id: editingBlog?.id || String(Date.now()),
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        author: formData.get('author') as string,
        date: formData.get('date') as string,
        image: imageUrl || editingBlog?.image || '',
      };

      const nextBlogs = editingBlog ? blogs.map(b => b.id === editingBlog.id ? blog : b) : [blog, ...blogs];
      saveLocalBlogs(nextBlogs);
      setBlogs(nextBlogs);
      setShowBlogModal(false);
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed. If uploading a large file, please note that browser storage is limited. Try using a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData(e.currentTarget);
      const thumbFile = (e.currentTarget.elements.namedItem('thumbFile') as HTMLInputElement).files?.[0];
      const videoFile = (e.currentTarget.elements.namedItem('videoFile') as HTMLInputElement).files?.[0];
      let thumbUrl = formData.get('thumb') as string;
      if (thumbFile) thumbUrl = await handleFileUpload(thumbFile);
      let videoUrl = formData.get('url') as string;
      if (videoFile) videoUrl = await handleFileUpload(videoFile);

      const video: VideoItem = {
        id: editingVideo?.id || String(Date.now()),
        title: formData.get('title') as string,
        views: formData.get('views') as string,
        thumb: thumbUrl || editingVideo?.thumb || '',
        url: videoUrl || editingVideo?.url || '',
      };

      const nextVideos = editingVideo ? videos.map(v => v.id === editingVideo.id ? video : v) : [video, ...videos];
      saveLocalVideos(nextVideos);
      setVideos(nextVideos);
      setShowVideoModal(false);
      setEditingVideo(null);
    } catch (err) {
      console.error(err);
      alert("Video upload failed. Browser storage (LocalSync) has a 5MB limit. Please provide a video URL instead for larger videos.");
    } finally {
      setUploading(false);
    }
  };

  const deleteBlog = (id: string) => {
    if (confirm('Delete this blog post?')) {
      const next = blogs.filter(b => b.id !== id);
      saveLocalBlogs(next);
      setBlogs(next);
    }
  };

  const deleteVideo = (id: string) => {
    if (confirm('Delete this trending video?')) {
      const next = videos.filter(v => v.id !== id);
      saveLocalVideos(next);
      setVideos(next);
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
      <aside className="w-72 bg-primary border-r border-white/5 flex flex-col fixed inset-y-0 shadow-2xl z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center font-black text-primary text-xl">I</div>
            <div>
              <h2 className="text-white font-black text-lg tracking-tighter leading-none">IGO ADMIN</h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV.map(item => {
            const isActive = tab === item.id;
            const hasAlert = item.id === 'leads' && leadsNotification > 0;
            return (
              <button key={item.id} onClick={() => setTab(item.id as any)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isActive ? 'bg-secondary text-primary shadow-xl shadow-secondary/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
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
               tab === 'videos' ? 'Trending Videos' : 
               tab === 'analytics' ? 'Visitor Activity' : 'Portal Settings'}
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

            {selectedIds.size > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/10 border-2 border-secondary rounded-2xl p-4 mb-4 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button onClick={clearSelection} className="p-2 hover:bg-white/50 rounded-lg transition-all"><MinusSquare size={20} className="text-primary" /></button>
                  <span className="font-black text-primary">{selectedIds.size} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => bulkUpdateStatus('Available')} className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all">Mark Available</button>
                  <button onClick={() => bulkUpdateStatus('Reserved')} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all">Mark Reserved</button>
                  <button onClick={() => bulkUpdateStatus('Sold')} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all">Mark Sold</button>
                  <button onClick={bulkDelete} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-light transition-all">Delete</button>
                </div>
              </motion.div>
            )}

            <div className="bg-white rounded-[32px] border border-black/5 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="relative w-80">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search estates..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-black/10 rounded-2xl py-3 pl-12 pr-5 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none" />
                  </div>
                </div>
                <button onClick={() => navigate('/admin/new')} className="flex items-center gap-2 bg-secondary text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg"><Plus size={16} /> Add Estate</button>
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
                        <motion.tr key={p.id} className={`transition-colors ${isSold ? 'bg-red-50/30' : isSelected ? 'bg-secondary/10' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-6 py-4"><button onClick={() => toggleSelect(p.id)}>{isSelected ? <CheckSquare size={20} /> : <Square size={20} />}</button></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                              <div><p className="font-bold text-sm">{p.title}</p><p className="text-[10px] uppercase text-secondary">{p.type}</p></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold">{p.location.split(',')[0]}</td>
                          <td className="px-6 py-4"><span className="font-black text-sm">₹{p.price}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                {['Available', 'Reserved', 'Sold'].map(s => (
                                  <button key={s} onClick={() => handleStatusChange(p.id, s)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${p.status === s ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}>{s}</button>
                                ))}
                              </div>
                              <button 
                                onClick={() => navigate(`/admin/edit/${p.id}`)}
                                className="p-2 bg-gray-100 text-primary rounded-xl hover:bg-secondary transition-all"
                                title="Edit Estate"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

{/* LEADS */}
         {tab === 'leads' && (
           <div className="space-y-8">
             <div className="bg-white rounded-[32px] border border-black/5 shadow-xl overflow-hidden">
                <div className="p-6 bg-gray-50/50 flex justify-between items-center">
                  <input type="text" placeholder="Search leads by name, phone, email, or property..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} className="bg-white border border-black/10 rounded-2xl px-6 py-3 text-sm font-bold" />
                  <button onClick={loadLeads}><RefreshCw size={16} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead><tr className="bg-gray-50/50">{['Investor', 'Contact', 'Email', 'Intent', 'Estate', 'Budget / Offer', 'Preferred Timing', 'Additional Info', 'Date'].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase text-text-muted">{h}</th>)}</tr></thead>
                     <tbody>
                        {filteredLeads.map(l => (
                         <tr key={l.id} className="hover:bg-gray-50/50 border-t border-black/5">
                           <td className="px-6 py-4">
                             <p className="font-bold text-sm text-primary">{l.name}</p>
                           </td>
                           <td className="px-6 py-4 text-xs font-bold">{l.phone}</td>
                           <td className="px-6 py-4 text-xs font-bold">{l.email || '—'}</td>
                           <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${TYPE_COLORS[l.type]}`}>{l.intent || l.type}</span></td>
                           <td className="px-6 py-4 font-bold text-xs">{l.property_title || 'General Interest'}</td>
                           <td className="px-6 py-4 font-black text-sm">
                             {l.offer_amount ? `₹${(l.offer_amount/10000000).toFixed(2)} Cr` : l.investment_size ? `₹${l.investment_size} Cr` : '—'}
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{l.preferred_date || 'ASAP'}</span>
                                <span className="text-[9px] text-text-muted font-bold">{l.preferred_time || ''}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-wrap gap-1 max-w-[180px]">
                               {l.asset_category && <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-lg text-[9px] font-bold">{l.asset_category}</span>}
                               {l.preferred_state && <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-lg text-[9px] font-bold">{l.preferred_state}</span>}
                               {l.notes && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-bold cursor-help" title={l.notes}>Read Notes</span>}
                             </div>
                           </td>
                           <td className="px-6 py-4 text-[10px] text-text-muted uppercase font-black">{new Date(l.created_at || Date.now()).toLocaleDateString()}</td>
                         </tr>
                       ))}
                     </tbody>
                  </table>
                </div>
             </div>
           </div>
         )}

        {/* BLOGS */}
        {tab === 'blogs' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center"><h3 className="font-black text-primary uppercase">{blogs.length} Articles</h3><button onClick={() => { setEditingBlog(null); setShowBlogModal(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">New Article</button></div>
            <div className="grid grid-cols-3 gap-8">
              {blogs.map(b => (
                <div key={b.id} className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-xl">
                  <img src={b.image} className="h-48 w-full object-cover" alt="" onError={e => e.currentTarget.src='/images/blog/farmland.png'} />
                  <div className="p-8">
                    <h4 className="font-bold text-lg mb-4">{b.title}</h4>
                    <div className="flex gap-2"><button onClick={() => { setEditingBlog(b); setShowBlogModal(true); }}><Edit size={16} /></button><button onClick={() => deleteBlog(b.id)}><Trash2 size={16} /></button></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {tab === 'videos' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center"><h3 className="font-black text-primary uppercase">{videos.length} Videos</h3><button onClick={() => { setEditingVideo(null); setShowVideoModal(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">New Video</button></div>
            <div className="grid grid-cols-2 gap-8">
              {videos.map(v => (
                <div key={v.id} className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-xl">
                  <img src={v.thumb} className="aspect-video w-full object-cover" alt="" onError={e => e.currentTarget.src='/images/properties/polyhouse.png'} />
                  <div className="p-8 flex justify-between items-center">
                    <div><h4 className="font-bold text-lg">{v.title}</h4><p className="text-[10px] uppercase text-secondary">{v.views} Views</p></div>
                    <div className="flex gap-2"><button onClick={() => { setEditingVideo(v); setShowVideoModal(true); }}><Edit size={16} /></button><button onClick={() => deleteVideo(v.id)}><Trash2 size={16} /></button></div>
                  </div>
                </div>
              ))}
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
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center mb-3"><s.icon size={20} className={s.color} /></div>
                  <p className="text-[10px] font-black uppercase text-text-muted">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[32px] border border-black/5 shadow-xl overflow-hidden">
               <div className="p-6 bg-gray-50/50 flex justify-between items-center"><h3 className="font-black text-primary uppercase">Recent Activity</h3><button onClick={() => setVisitors(getVisitors())}><RefreshCw size={16} /></button></div>
               <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/50">{['Visitor', 'Last Active', 'Views', 'Duration', 'Interests'].map(h => <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase text-text-muted">{h}</th>)}</tr></thead>
               <tbody className="divide-y divide-black/5">{visitors.map(v => (
                 <tr key={v.id}>
                   <td className="px-6 py-4 font-bold text-sm">
                     <div>
                       <p className="font-bold text-primary">{v.name || 'Anonymous'}</p>
                       {v.email && <p className="text-[10px] text-text-muted font-normal">{v.email}</p>}
                     </div>
                   </td>
                   <td className="px-6 py-4 text-xs font-bold text-primary">{new Date(v.lastVisit).toLocaleString()}</td>
                   <td className="px-6 py-4"><span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-black">{v.pageViews}</span></td>
                   <td className="px-6 py-4"><span className="text-[11px] font-black text-primary uppercase tracking-widest">{v.durationMinutes || 0}m</span></td>
                                       <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {v.visitedProperties.map((p, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-bold border border-primary/10">
                            <span>{p.title}</span>
                            {p.duration && p.duration > 30 && <span className="bg-secondary text-primary px-1 rounded-sm text-[8px] font-black" title={`Watched for ${p.duration}s`}>ENGAGED</span>}
                            <span className="opacity-40 font-normal">({p.duration || 0}s)</span>
                          </div>
                        ))}
                      </div>
                    </td>

                 </tr>
               ))}</tbody></table></div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-5">
              <div className="flex items-center gap-3 mb-2"><Globe size={18} /><h3 className="font-black text-primary text-lg">Site Identity</h3></div>
              {['siteName', 'contactPhone', 'contactEmail', 'whatsappNumber'].map(k => (
                <div key={k}><label className="block text-[10px] font-black text-text-muted uppercase mb-2">{k}</label><input value={(settings as any)[k]} onChange={e => setSettings(s => ({ ...s, [k]: e.target.value }))} className="w-full bg-gray-50 border border-black/5 rounded-2xl py-3 px-5 text-sm font-bold" /></div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2"><Lock size={18} /><h3 className="font-black text-primary text-lg">Security</h3></div>
                <div><label className="block text-[10px] font-black uppercase mb-2">Admin Password</label><input type="password" value={settings.adminPassword} onChange={e => setSettings(s => ({ ...s, adminPassword: e.target.value }))} className="w-full bg-gray-50 border border-black/5 rounded-2xl py-3 px-5 text-sm font-bold" /></div>
              </div>
              <button onClick={() => { saveLocalSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2500); }} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-primary transition-all shadow-xl">
                {saved ? 'Settings Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
