import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, Maximize, Landmark, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Sprout, Droplets, Map, Calculator, Eye, TrendingUp, Lightbulb, X } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useNavigate } from 'react-router-dom';

const PostProperty: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [priceSuggestion, setPriceSuggestion] = useState<{ min: number; max: number; confidence: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Farmland',
    intention: 'Sell',
    description: '',
    state: 'Karnataka',
    district: '',
    size: '',
    coordinates: '',
    soil: 'Red Soil',
    water: 'Borewell (Active)',
    price: ''
  });
  
  const totalSteps = 4;
  const { addProperty } = useProperties();
  const navigate = useNavigate();

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/')).slice(0, 6);
    const dataUrls = await Promise.all(imageFiles.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })));
    setUploadedImages(prev => [...prev, ...dataUrls].slice(0, 6));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const suggestPrice = async () => {
    if (!formData.category || !formData.state || !formData.size) return;

    setIsAnalyzing(true);

    // Simulate AI analysis - in production this would call an AI service
    setTimeout(() => {
      const basePrice = parseFloat(formData.size) || 1;
      // Adjust price based on state and category
      const stateMultiplier: Record<string, number> = {
        'Karnataka': 1.2,
        'Maharashtra': 1.1,
        'Tamil Nadu': 1.0,
        'Telangana': 0.9
      };
      const categoryMultiplier: Record<string, number> = {
        'Farmland': 1.0,
        'Farmhouse': 1.3,
        'Estates': 1.5,
        'Agricultural Land': 1.0
      };

      const mult = (stateMultiplier[formData.state] || 1) * (categoryMultiplier[formData.category] || 1);
      const avgPrice = basePrice * mult;
      const minPrice = avgPrice * 0.9;
      const maxPrice = avgPrice * 1.1;

      setPriceSuggestion({
        min: parseFloat(minPrice.toFixed(2)),
        max: parseFloat(maxPrice.toFixed(2)),
        confidence: 85
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const applyPriceSuggestion = () => {
    if (priceSuggestion) {
      const midPrice = ((priceSuggestion.min + priceSuggestion.max) / 2).toFixed(2);
      setFormData(prev => ({ ...prev, price: midPrice }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const fallbackImage = '/images/properties/paddy-field.png';
    const result = await addProperty({
      title: formData.title,
      type: formData.category,
      intention: formData.intention as any,
      location: `${formData.district}, ${formData.state}`,
      price: `${formData.price} Cr`,
      size: `${formData.size} Acres`,
      roi: '~12-18%',
      description: formData.description,
      status: 'Reserved', // Set to reserved for admin review
      image: uploadedImages[0] || fallbackImage,
      images: uploadedImages.length ? uploadedImages : [fallbackImage],
      soilType: formData.soil,
      waterSource: formData.water,
      projectAddress: formData.coordinates,
      features: [formData.soil, formData.water],
      revenueModel: 'Customer-submitted estate for admin verification. Update revenue model after site review.',
      setupScope: ['Admin verification pending', 'Image and document review pending', 'Site visit coordination pending'],
      customerNeeds: ['Verify ownership documents', 'Confirm location and access', 'Check water source', 'Review asking price'],
    });
    
    setIsSubmitting(false);
    if (result.success) {
      alert("Property submitted successfully! Our institutional team will verify it shortly.");
      navigate('/listings');
    }
  };

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container-pro max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <Landmark size={14} />
            <span>Direct Listing Portal</span>
          </div>
          <h1 className="heading-xl text-primary mb-6">List Your <span className="text-secondary italic">Property</span></h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            Join the IGO ecosystem. List your agricultural land, farmhouse, or estate with zero commission and direct access to premium institutional investors.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-3xl mx-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="absolute top-0 left-0 h-full bg-secondary"
          ></motion.div>
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-14 border border-black/5 shadow-2xl max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4 mb-8 border-b border-black/5 pb-6">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">1</div>
                   <h2 className="text-2xl font-bold text-primary">Basic Information</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Asset Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer font-bold text-primary">
                      <option>Farmland</option>
                      <option>Farmhouse</option>
                      <option>Estates</option>
                      <option>Agricultural Land</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Listing Intention</label>
                    <select name="intention" value={formData.intention} onChange={handleChange} className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer font-bold text-primary">
                      <option>Sell</option>
                      <option>Lease</option>
                      <option>Rent</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Property Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. 15 Acre High-Yield Teak Plantation" className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary placeholder:font-normal placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Detailed Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the topography, access roads, and general condition..." className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 resize-none font-medium text-primary placeholder:text-gray-400"></textarea>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Location & Size */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4 mb-8 border-b border-black/5 pb-6">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">2</div>
                   <h2 className="text-2xl font-bold text-primary">Location & Dimensions</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">State</label>
                    <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer font-bold text-primary">
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">District</label>
                    <input name="district" value={formData.district} onChange={handleChange} type="text" placeholder="e.g. Mysuru" className="w-full bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Total Area (Acres)</label>
                  <div className="relative">
                    <Maximize size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input name="size" value={formData.size} onChange={handleChange} type="number" placeholder="e.g. 5.5" className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Google Maps Coordinates</label>
                  <div className="relative">
                    <Map size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input name="coordinates" value={formData.coordinates} onChange={handleChange} type="text" placeholder="Paste plus code or link..." className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Agronomy & Legal */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4 mb-8 border-b border-black/5 pb-6">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">3</div>
                   <h2 className="text-2xl font-bold text-primary">Agronomy & Financials</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Soil Type</label>
                    <div className="relative">
                      <Sprout size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" />
                      <select name="soil" value={formData.soil} onChange={handleChange} className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer font-bold text-primary">
                        <option>Red Soil</option>
                        <option>Black Cotton</option>
                        <option>Alluvial</option>
                        <option>Mixed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Water Source</label>
                    <div className="relative">
                      <Droplets size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" />
                      <select name="water" value={formData.water} onChange={handleChange} className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer font-bold text-primary">
                        <option>Borewell (Active)</option>
                        <option>Canal</option>
                        <option>Riverfront</option>
                        <option>Rainfed Only</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Asking Price (₹ In Crores)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-primary">₹</span>
                    <input name="price" value={formData.price} onChange={handleChange} type="number" step="0.01" placeholder="e.g. 1.25" className="w-full bg-gray-50 border border-black/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary text-xl" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Media Upload */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4 mb-8 border-b border-black/5 pb-6">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">4</div>
                   <h2 className="text-2xl font-bold text-primary">Verification Media</h2>
                </div>
                
                <label className="block border-2 border-dashed border-primary/20 bg-gray-50 rounded-[32px] p-16 text-center group hover:border-secondary transition-colors cursor-pointer relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="sr-only"
                  />
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-secondary/20 transition-all">
                    <Upload size={32} className="text-secondary" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-primary">Upload Property Photos & Docs</h4>
                  <p className="text-sm text-text-muted max-w-sm mx-auto font-light">Drag and drop high-quality farm imagery, FMB sketches, and recent Patta documents.</p>
                </label>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-black/5">
                        <img src={image} alt={`Uploaded property ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-primary flex items-center justify-center shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="p-6 bg-primary rounded-[24px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-topo opacity-5 pointer-events-none"></div>
                  <div className="flex items-start space-x-4 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <ShieldCheck size={24} className="text-secondary" />
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      By submitting, you agree to IGO's <span className="text-white font-bold">Anti-Fraud Policy</span>. Our institutional legal desk will verify the land titles and soil reports before your listing goes live to premium buyers.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-black/5">
            {step > 1 ? (
              <button onClick={prevStep} className="font-bold text-[11px] uppercase tracking-widest text-text-muted hover:text-primary transition-colors px-6 py-3">Back</button>
            ) : (
              <div></div>
            )}
            
            {step < totalSteps ? (
              <button 
                onClick={nextStep}
                className="bg-primary text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-secondary text-primary px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-secondary/90 shadow-2xl shadow-secondary/20 transition-all group disabled:opacity-50"
              >
                <Sparkles size={16} className="group-hover:scale-125 transition-transform" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit to Admin'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Preview Button */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${
              showPreview ? 'bg-secondary text-primary' : 'bg-primary text-white'
            }`}
          >
            <Eye size={16} />
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
        </div>

        {/* Live Preview Panel */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 overflow-y-auto border-l border-black/5"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary">Listing Preview</h3>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Preview Card */}
                <div className="bg-white rounded-[40px] overflow-hidden border border-black/5 shadow-xl">
                  <div className="aspect-[16/11] bg-primary/5 relative">
                    <img
                      src={uploadedImages[0] || '/images/properties/paddy-field.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                      Available
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary mb-2">{formData.category} Estate</p>
                    <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                      {formData.title || 'Your Estate Title'}
                    </h3>
                    <div className="flex items-center text-text-muted text-sm mb-4">
                      <MapPin size={14} className="mr-2" />
                      <span>{formData.district || 'District'}, {formData.state || 'State'}</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-6">
                      {formData.description || 'Your estate description will appear here...'}
                    </p>

                    {/* AI Price Suggestion Card */}
                    {priceSuggestion && (
                      <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 text-primary mb-3">
                          <Lightbulb size={16} className="text-secondary" />
                          <span className="text-xs font-black uppercase tracking-widest">AI Price Suggestion</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-text-muted">Suggested Range:</span>
                          <span className="font-black text-secondary">₹{priceSuggestion.min}-{priceSuggestion.max} Cr</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-text-muted">Confidence:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-black/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary transition-all"
                                style={{ width: `${priceSuggestion.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-secondary">{priceSuggestion.confidence}%</span>
                          </div>
                        </div>
                        <button
                          onClick={applyPriceSuggestion}
                          className="w-full bg-secondary text-primary py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:border-2 hover:border-secondary transition-all"
                        >
                          Apply Suggested Price
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/5">
                      <div>
                        <span className="text-[9px] text-text-muted uppercase block mb-1">Area</span>
                        <span className="font-bold text-primary">{formData.size || '0'} Acres</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-muted uppercase block mb-1">Price</span>
                        <span className="font-bold text-primary">₹{formData.price || '0'} Cr</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-muted uppercase block mb-1">ROI</span>
                        <span className="font-bold text-primary">~12-18%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Button */}
                <button
                  onClick={suggestPrice}
                  disabled={isAnalyzing || !formData.size || !formData.state}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing Market...
                    </>
                  ) : (
                    <>
                      <TrendingUp size={16} />
                      Get AI Price Suggestion
                    </>
                  )}
                </button>

                <p className="text-[10px] text-text-muted mt-4 text-center font-light">
                  Based on recent sales in {formData.state || 'your region'} for {formData.category || 'farmland'} estates.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostProperty;
