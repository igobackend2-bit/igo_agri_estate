import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PropertyInput, Property } from '../../types';
import { 
  Save, 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Tag, 
  Maximize, 
  TrendingUp, 
  Info, 
  Plus, 
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Database,
  IndianRupee,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, getProperty, addProperty, updateProperty, refresh } = useProperties();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState<PropertyInput>({
    title: '',
    location: '',
    size: '',
    price: '',
    roi: '',
    image: '',
    images: [],
    status: 'Available',
    description: '',
    type: 'Teak Plantation Estate',
    features: [],
    crops: [],
    setupScope: [],
    customerNeeds: [],
    igoSupport: [],
    revenueModel: '',
    costRange: '',
    breakEven: '',
    projectAddress: '',
    projectOffice: '',
    priceValue: 0,
    sizeValue: 0,
    roiValue: 0
  });

  // Reset initialized when ID changes
  useEffect(() => {
    setInitialized(false);
  }, [id]);

  // Load property data once when component mounts or id changes
  useEffect(() => {
    if (!id || initialized) return;

    const loadProperty = async () => {
      // Try local state first (fast)
      const localProp = properties.find(p => p.id === id);
      if (localProp) {
        const { id: _, created_at: __, ...rest } = localProp as any;
        setFormData(rest);
        setInitialized(true);
        return;
      }

      // Fetch from database
      setLoading(true);
      const data = await getProperty(id);
      if (data) {
        const { id: __id, created_at: ___c, ...rest } = data as any;
        setFormData(rest);
      }
      setLoading(false);
      setInitialized(true);
    };

    loadProperty();
  }, [id, properties, initialized, getProperty]);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNew = !id;
    const confirmMessage = isNew 
      ? "Are you sure you want to initialize this new estate asset? This will make it live in the marketplace."
      : `Are you sure you want to commit these updates to "${formData.title}"? Changes will reflect immediately on the live website.`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);

    // Auto-set timestamps based on status
    const now = new Date().toISOString();
    const patch: Partial<Property> = { ...formData };
    if (formData.status === 'Sold') {
      patch.soldAt = formData.soldAt || now;
    }
    if (formData.status === 'Reserved') {
      patch.bookedAt = formData.bookedAt || now;
    }
    // Clear timestamps if Available
    if (formData.status === 'Available') {
      patch.soldAt = undefined;
      patch.bookedAt = undefined;
    }

    const result = id 
      ? await updateProperty(id, patch)
      : await addProperty(patch);

    if (result.success) {
      // Force refresh from database to ensure consistency
      await refresh();
      navigate('/admin/dashboard');
    } else {
      alert('Failed to save estate records. Please check your cloud connection and try again.');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleArrayChange = (field: 'images' | 'features' | 'crops' | 'setupScope' | 'customerNeeds' | 'igoSupport', index: number, value: string) => {
     const newArr = [...(formData[field] || [])];
     newArr[index] = value;
     setFormData(prev => ({ ...prev, [field]: newArr }));
   };

   const handleObjectChange = (field: 'soilData' | 'infrastructure', key: string, value: string | number) => {
     setFormData(prev => ({
       ...prev,
       [field]: { ...(prev[field] as any || {}), [key]: value }
     }));
   };

  const addArrayItem = (field: 'images' | 'features' | 'crops' | 'setupScope' | 'customerNeeds' | 'igoSupport') => {
    setFormData(prev => ({ ...prev, [field]: [...(formData[field] || []), ''] }));
  };

  const removeArrayItem = (field: 'images' | 'features' | 'crops' | 'setupScope' | 'customerNeeds' | 'igoSupport', index: number) => {
    setFormData(prev => ({ ...prev, [field]: (formData[field] || []).filter((_, i) => i !== index) }));
  };

  const readImageFiles = async (files: FileList | null) => {
    if (!files) return [];
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/')).slice(0, 8);
    return Promise.all(imageFiles.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })));
  };

  const handlePrimaryUpload = async (files: FileList | null) => {
    const [image] = await readImageFiles(files);
    if (image) setFormData(prev => ({ ...prev, image }));
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    const images = await readImageFiles(files);
    if (images.length) setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...images].slice(0, 8) }));
  };

  if (loading && id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Header Navigation */}
      <header className="bg-primary text-white py-8 border-b border-white/5 sticky top-0 z-40">
        <div className="container-pro flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-secondary hover:text-primary transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">{id ? 'Edit Estate Intelligence' : 'Initialize New Asset'}</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Administrative Resource Planning</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <button 
              form="property-form"
              type="submit"
              disabled={loading}
              className="bg-secondary text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 shadow-xl shadow-secondary/10 hover:bg-white hover:text-primary transition-all disabled:opacity-50"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div> : <Save size={18} />}
              <span>{id ? 'Commit Updates' : 'Authorize Asset'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-pro mt-16">
        <form id="property-form" onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-10">
            {/* Core Identification */}
            <section className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">Identity & Narrative</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Asset Title</label>
                  <input 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Mahabalipuram Premium Teak Estate"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-8 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all font-bold text-primary"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Market Narrative</label>
                  <textarea 
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed investment thesis for this estate..."
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-6 px-8 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all resize-none font-medium text-text-muted leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* Asset Gallery */}
            <section className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-primary">Visual Assets</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => addArrayItem('images')}
                  className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Perspective</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Primary Hero Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePrimaryUpload(e.target.files)}
                    className="mb-3 block w-full text-xs font-bold text-text-muted file:mr-4 file:rounded-xl file:border-0 file:bg-secondary file:px-4 file:py-3 file:font-black file:uppercase file:tracking-widest file:text-primary"
                  />
                  <input 
                    name="image"
                    required
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Primary URL"
                    className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                    className="block w-full text-xs font-bold text-text-muted file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-3 file:font-black file:uppercase file:tracking-widest file:text-white"
                  />
                  {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="flex-1">
                        {img && (
                          <img src={img} alt="" className="mb-2 h-20 w-28 rounded-xl object-cover border border-black/5" />
                        )}
                        <input 
                          value={img}
                          onChange={(e) => handleArrayChange('images', idx, e.target.value)}
                          placeholder={`Gallery perspective ${idx + 1}`}
                          className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeArrayItem('images', idx)}
                        className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Investment Parameters */}
            <section className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">Financial Parameters</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Asset Valuation</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                    <input 
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 2.8 Cr"
                      className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 pl-14 pr-8 focus:ring-2 focus:ring-secondary/50 outline-none font-black text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Scale / Area</label>
                  <div className="relative">
                    <Maximize className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                    <input 
                      name="size"
                      required
                      value={formData.size}
                      onChange={handleChange}
                      placeholder="e.g. 5 Acres"
                      className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 pl-14 pr-8 focus:ring-2 focus:ring-secondary/50 outline-none font-black text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Projected ROI</label>
                  <input 
                    name="roi"
                    required
                    value={formData.roi}
                    onChange={handleChange}
                    placeholder="e.g. 18-22% CAGR"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-8 focus:ring-2 focus:ring-secondary/50 outline-none font-black text-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Asset Type</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-8 focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary appearance-none cursor-pointer"
                  >
                    <option>Teak Plantation Estate</option>
                    <option>Mango Horticulture Orchard</option>
                    <option>Polyhouse Protected Farm</option>
                    <option>Open Field Paddy Estate</option>
                    <option>Urban Vertical Farm</option>
                  </select>
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-6 pt-4 border-t border-black/5">
                  <div>
                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3">Calc: Price (Cr)</label>
                    <input 
                      type="number" step="0.01" name="priceValue"
                      value={formData.priceValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-secondary/5 border border-secondary/20 rounded-2xl py-4 px-6 font-black text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3">Calc: Size (Acres)</label>
                    <input 
                      type="number" step="0.1" name="sizeValue"
                      value={formData.sizeValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, sizeValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-secondary/5 border border-secondary/20 rounded-2xl py-4 px-6 font-black text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-3">Calc: ROI (%)</label>
                    <input 
                      type="number" step="0.1" name="roiValue"
                      value={formData.roiValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, roiValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-secondary/5 border border-secondary/20 rounded-2xl py-4 px-6 font-black text-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Public Page Content */}
            <section className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <Sprout size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">Public Estate Page Values</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Revenue Model</label>
                  <textarea
                    name="revenueModel"
                    rows={4}
                    value={formData.revenueModel || ''}
                    onChange={handleChange}
                    placeholder="How this estate can earn..."
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-6 focus:ring-2 focus:ring-secondary/50 outline-none resize-none font-medium text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Setup / Development Scope</label>
                  <textarea
                    value={(formData.setupScope || []).join('\n')}
                    onChange={(e) => setFormData(prev => ({ ...prev, setupScope: e.target.value.split('\n').filter(Boolean) }))}
                    rows={4}
                    placeholder="One setup item per line"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-6 focus:ring-2 focus:ring-secondary/50 outline-none resize-none font-medium text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Crops / Use Plan</label>
                  <textarea
                    value={(formData.crops || []).join('\n')}
                    onChange={(e) => setFormData(prev => ({ ...prev, crops: e.target.value.split('\n').filter(Boolean) }))}
                    rows={4}
                    placeholder="One crop or use item per line"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-6 focus:ring-2 focus:ring-secondary/50 outline-none resize-none font-medium text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Customer Requirements</label>
                  <textarea
                    value={(formData.customerNeeds || []).join('\n')}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerNeeds: e.target.value.split('\n').filter(Boolean) }))}
                    rows={4}
                    placeholder="One buyer requirement per line"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-6 focus:ring-2 focus:ring-secondary/50 outline-none resize-none font-medium text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Cost Range</label>
                  <input
                    name="costRange"
                    value={formData.costRange || ''}
                    onChange={handleChange}
                    placeholder="e.g. Setup from 12L to 18L"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-8 focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Break-even View</label>
                  <input
                    name="breakEven"
                    value={formData.breakEven || ''}
                    onChange={handleChange}
                    placeholder="e.g. 24-30 months"
                    className="w-full bg-gray-50 border border-black/5 rounded-[24px] py-5 px-8 focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Config */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Status & Compliance */}
            <section className="bg-primary rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-10 pointer-events-none"></div>
               <div className="relative z-10 space-y-8">
                 <div>
                   <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Availability Status</label>
                   <div className="flex gap-2">
                     {['Available', 'Reserved', 'Sold'].map(status => (
                       <button
                         key={status}
                         type="button"
                         onClick={() => setFormData(prev => ({ ...prev, status: status as any }))}
                         className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === status ? 'bg-secondary text-primary' : 'bg-white/5 border border-white/10 text-white/40'}`}
                       >
                         {status}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Regulatory Compliance</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                      <input 
                        name="reraNumber"
                        value={formData.reraNumber || ''}
                        onChange={handleChange}
                        placeholder="RERA Number"
                        className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-14 pr-8 focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-white placeholder:text-white/20"
                      />
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                   <div className="flex items-center space-x-3 text-secondary text-[10px] font-black uppercase tracking-widest">
                     <CheckCircle2 size={16} />
                     <span>Verified Asset Record</span>
                   </div>
                 </div>
               </div>
            </section>

            {/* Geographical Context */}
            <section className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm space-y-8">
               <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">Location Profile</h3>
              </div>

<div className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Corridor / City</label>
                   <input
                     name="location"
                     required
                     value={formData.location}
                     onChange={handleChange}
                     placeholder="e.g. Mahabalipuram, TN"
                     className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Site Address</label>
                   <input
                     name="projectAddress"
                     value={formData.projectAddress || ''}
                     onChange={handleChange}
                     placeholder="Detailed site location..."
                     className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Soil Type</label>
                   <input
                     name="soilType"
                     value={formData.soilType || ''}
                     onChange={handleChange}
                     placeholder="e.g. Red Soil"
                     className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Water Source</label>
                   <input
                     name="waterSource"
                     value={formData.waterSource || ''}
                     onChange={handleChange}
                     placeholder="e.g. Borewell, canal, rainfed"
                     className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                   />
                 </div>

                 {/* Soil Data Sub-fields */}
                 <div className="grid grid-cols-2 gap-4 border border-primary/10 rounded-2xl p-4 bg-primary/5">
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">pH Level</label>
                     <input
                       value={formData.soilData?.ph || ''}
                       onChange={(e) => handleObjectChange('soilData', 'ph', Number(e.target.value))}
                       type="number" step="0.1"
                       placeholder="e.g. 6.5"
                       className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Nitrogen</label>
                     <input
                       value={formData.soilData?.nitrogen || ''}
                       onChange={(e) => handleObjectChange('soilData', 'nitrogen', e.target.value)}
                       placeholder="e.g. Medium"
                       className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Phosphorus</label>
                     <input
                       value={formData.soilData?.phosphorus || ''}
                       onChange={(e) => handleObjectChange('soilData', 'phosphorus', e.target.value)}
                       placeholder="e.g. High"
                       className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Potassium</label>
                     <input
                       value={formData.soilData?.potassium || ''}
                       onChange={(e) => handleObjectChange('soilData', 'potassium', e.target.value)}
                       placeholder="e.g. Medium"
                       className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Organic Carbon</label>
                     <input
                       value={formData.soilData?.organicCarbon || ''}
                       onChange={(e) => handleObjectChange('soilData', 'organicCarbon', e.target.value)}
                       placeholder="e.g. 0.65%"
                       className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                 </div>

                 {/* Infrastructure Fields */}
                 <div className="border border-primary/10 rounded-2xl p-4 bg-secondary/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Infrastructure Details</p>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Market Distance</label>
                       <input
                         value={formData.infrastructure?.marketDistance || ''}
                         onChange={(e) => handleObjectChange('infrastructure', 'marketDistance', e.target.value)}
                         placeholder="e.g. 10-15 km"
                         className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Highway Distance</label>
                       <input
                         value={formData.infrastructure?.highwayDistance || ''}
                         onChange={(e) => handleObjectChange('infrastructure', 'highwayDistance', e.target.value)}
                         placeholder="e.g. 2.5 km"
                         className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Cold Storage Distance</label>
                       <input
                         value={formData.infrastructure?.coldStorageDistance || ''}
                         onChange={(e) => handleObjectChange('infrastructure', 'coldStorageDistance', e.target.value)}
                         placeholder="e.g. 15 km"
                         className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Power Supply</label>
                       <input
                         value={formData.infrastructure?.powerAvailability || ''}
                         onChange={(e) => handleObjectChange('infrastructure', 'powerAvailability', e.target.value)}
                         placeholder="e.g. 3-Phase Agri"
                         className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Water Table Depth</label>
                       <input
                         value={formData.infrastructure?.waterTableDepth || ''}
                         onChange={(e) => handleObjectChange('infrastructure', 'waterTableDepth', e.target.value)}
                         placeholder="e.g. 120 ft"
                         className="w-full bg-white border border-black/5 rounded-[16px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                       />
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Total Units</label>
                     <input
                       name="totalUnits"
                       type="number"
                       value={formData.totalUnits || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, totalUnits: e.target.value ? Number(e.target.value) : undefined }))}
                       className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">Available</label>
                     <input
                       name="availableUnits"
                       type="number"
                       value={formData.availableUnits || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, availableUnits: e.target.value ? Number(e.target.value) : undefined }))}
                       className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 ml-1">RERA Number</label>
                   <input
                     name="reraNumber"
                     value={formData.reraNumber || ''}
                     onChange={handleChange}
                     placeholder="e.g. TNRERA/LAYOUT/4104/2024"
                     className="w-full bg-gray-50 border border-black/5 rounded-[20px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/50 outline-none"
                   />
                 </div>
               </div>
            </section>

            <div className="bg-white/50 p-8 rounded-[40px] border border-black/5 flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary shadow-lg">
                <Database size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Persistence</p>
                <p className="text-xs font-bold text-primary">Live Sync Enabled</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
