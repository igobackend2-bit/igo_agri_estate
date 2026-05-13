import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  Heart,
  IndianRupee,
  Mail,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Share2,
  Sprout,
  TrendingUp,
  BarChart2,
  Map,
  Droplets,
  Zap,
  Truck,
  Warehouse,
  Video,
  LineChart,
  ShieldCheck,
  Plus,
  Minus,
  AlertCircle,
  Download,
  Percent,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import LeadCaptureForm from '../components/LeadCaptureForm';
import MortgageCalculator from '../components/property/MortgageCalculator';
import AuthRequiredModal from '../components/modals/AuthRequiredModal';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed, getRecommendations } from '../hooks/useRecommendations';
import type { Property } from '../types';

const igoPhone = '+918376883780';
const igoEmail = 'info@igoagritechfarms.com';
const igoWebsite = 'https://www.igoagritechfarms.com/';

const defaultCustomerNeeds = [
  'Land ownership or lease permission',
  'Water and power availability',
  'Estate budget confirmation',
  'Site inspection approval',
];

const defaultIgoSupport = [
  'Estate feasibility review',
  'Crop and layout planning',
  'Vendor and setup coordination',
  'Farm operation guidance',
  'Harvest and market support',
];

const estateFlow = [
  {
    title: '1. Estate Discussion',
    detail: 'Customer shares land size, location, water source, budget, and preferred Agri Estate model.',
  },
  {
    title: '2. Site Feasibility',
    detail: 'IGO reviews soil, water, access, climate, estate suitability, and practical development scope.',
  },
  {
    title: '3. Estate Proposal',
    detail: 'Customer receives estate scope, setup items, estimated cost, crop plan, operation plan, and revenue route.',
  },
  {
    title: '4. Setup & Execution',
    detail: 'After approval, IGO coordinates structure, irrigation, crop setup, training, and farm implementation.',
  },
  {
    title: '5. Operations & Revenue',
    detail: 'Farm output is tracked through crop cycles, harvesting, grading, buyer linkage, and owner updates.',
  },
];

import { trackVisit, updateVisitDuration } from '../lib/trackingService';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, getProperty, publicProperties } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const leadRef = useRef<HTMLDivElement>(null);

  // Visitor Tracking
  const tracked = React.useRef<string | null>(null);
  useEffect(() => {
    if (property && tracked.current !== property.id) {
      trackVisit({ id: property.id, title: property.title });
      tracked.current = property.id;
    }
  }, [property]);

  // Engagement Timer
  const [startTime] = useState(Date.now());
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (property) {
        updateVisitDuration(property.id, 5);
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [property]);

  // Personalization: track recently viewed and get recommendations
  const { addView } = useRecentlyViewed([]);

  // Get location info from property
  const locationName = property?.location?.split(',')?.[0] || 'Unknown Corridor';

  const [rentalInputs, setRentalInputs] = useState({
    monthlyRent: '',
    annualExpenses: '',
    vacancyRate: '10'
  });
  const [rentalResult, setRentalResult] = useState<{grossIncome: number, netIncome: number, yield: number, monthlyCashflow: number} | null>(null);

  useEffect(() => {
    if (!id) return;
    getProperty(id).then((data) => {
      if (data) {
        setProperty(data);
        addView(data.id);
      } else {
        // Property not found or auto-expired
        setProperty(null);
      }
      setLoading(false);
    });
  }, [id, getProperty, addView]);

  const similarEstates = useMemo(() => {
    if (!property || !property.location || !publicProperties.length) return [];
    
    // Use only public (non-expired) properties
    const availableProperties = publicProperties;
    const parts = property.location.split(',');
    if (parts.length === 0) return [];
    
    const locName = parts[0].trim().toLowerCase();
    
    // Find other estates in the same location that are active
    const sameLocation = availableProperties.filter(p =>
      p.location && p.location.toLowerCase().includes(locName) && p.id !== property.id
    );
    return sameLocation.length > 0 ? sameLocation.slice(0, 3) : getRecommendations(availableProperties, property.id).slice(0, 3);
  }, [property, publicProperties]);

  const handleShare = async () => {
    if (!property) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `IGO ${locationName} Estate: Check out ${property.title}`,
          url: window.location.href,
        });
        setShareStatus('Shared');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('Link copied');
      }
    } catch {
      setShareStatus('Share cancelled');
    }

    window.setTimeout(() => setShareStatus(''), 1800);
  };

  const enquiryText = property
    ? `Hello IGO, I am interested in the ${property.title} at ${property.location}. Please share full proposal, cost breakdown, site visit process, and next steps.`
    : 'Hello IGO, I am interested in an Agri Estate.';

  const whatsappUrl = `https://wa.me/${igoPhone.replace(/\D/g, '')}?text=${encodeURIComponent(enquiryText)}`;
  
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setAuthMessage("Please sign in to contact our estate team via WhatsApp.");
      setShowAuthModal(true);
    }
  };

  const handleDroneTourClick = () => {
    if (!user) {
      setAuthMessage("Please sign in to request a professional drone tour of this estate.");
      setShowAuthModal(true);
      return;
    }
    leadRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Note: We could potentially pass a prop to LeadCaptureForm here if we wanted to pre-select something
  };

  const mailUrl = property
    ? `mailto:${igoEmail}?subject=${encodeURIComponent(`Agri Estate enquiry - ${property.title}`)}&body=${encodeURIComponent(enquiryText)}`
    : `mailto:${igoEmail}`;

  // Compute rental yield
  const calculateRentalYield = () => {
    if (!property || !rentalInputs.monthlyRent) return;
    const monthlyRent = parseFloat(rentalInputs.monthlyRent) || 0;
    const annualExpenses = parseFloat(rentalInputs.annualExpenses) || 0;
    const vacancyRate = parseFloat(rentalInputs.vacancyRate) || 10;

    const grossIncome = monthlyRent * 12;
    const effectiveIncome = grossIncome * (1 - vacancyRate / 100);
    const netIncome = effectiveIncome - annualExpenses;

    // Estimate property value
    const priceMatch = property.price.match(/(\d+(?:\.\d+)?)/);
    const propertyValue = (property.priceValue || (priceMatch ? parseFloat(priceMatch[1]) : 1.0)) * 10000000;

    const rentalYield = propertyValue > 0 ? (netIncome / propertyValue) * 100 : 0;
    const monthlyCashflow = (netIncome / 12);

    setRentalResult({
      grossIncome,
      netIncome,
      yield: rentalYield,
      monthlyCashflow
    });
  };

  useEffect(() => {
    if (property && (property.intention === 'Rent' || property.intention === 'Lease' || property.type?.toLowerCase()?.includes('rent'))) {
      // Auto-calculate with estimated rent based on property value
      const priceValue = property.priceValue || 5;
      const estimatedRent = priceValue * 0.05 * 10000000 / 12; // 0.5% monthly rent
      setRentalInputs(prev => ({
        ...prev,
        monthlyRent: Math.round(estimatedRent).toString()
      }));
    }
  }, [property]);

  useEffect(() => {
    calculateRentalYield();
  }, [rentalInputs, property]);

  const [activeImage, setActiveImage] = useState(0);
  const galleryImages = property ? (property.images || [property.image]) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl mb-4">Agri Estate Not Found</h2>
        <button onClick={() => navigate('/listings')} className="btn-primary">Back to Estates</button>
      </div>
    );
  }

  const crops = property.crops || [];
  const setupScope = property.setupScope || [];
  const customerNeeds = property.customerNeeds || defaultCustomerNeeds;
  const igoSupport = property.igoSupport || defaultIgoSupport;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container">
          <button
            onClick={() => navigate('/locations')}
            className="flex items-center text-text-muted hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Estates
          </button>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="relative rounded-[48px] overflow-hidden shadow-2xl aspect-[4/3] bg-primary/5 group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  src={galleryImages[activeImage]} 
                  alt={property.title} 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="bg-secondary text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  IGO Agri Estate
                </div>
                <div className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  {property.status}
                </div>
              </div>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveImage(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                    className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-secondary hover:text-primary transition-all shadow-2xl"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                    className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-secondary hover:text-primary transition-all shadow-2xl"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              )}

              <div className="absolute bottom-8 left-10 right-10 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-3">{property.type}</p>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">{property.title}</h1>
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative rounded-[24px] overflow-hidden aspect-square border-2 transition-all ${activeImage === idx ? 'border-secondary scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Corner ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 1 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-black uppercase text-center p-2 leading-tight">Plant Close-up</div>}
                    {idx === 2 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-black uppercase text-center p-2 leading-tight">North View</div>}
                    {idx === 3 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-black uppercase text-center p-2 leading-tight">Entrance</div>}
                    {idx === 4 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-black uppercase text-center p-2 leading-tight">Infrastructure</div>}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-7">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={12} />
                    {property.reraNumber ? 'RERA Registered' : 'Title Verified'}
                  </span>
                  {property.reraNumber && (
                    <span className="text-[10px] font-bold text-text-muted">
                      ID: {property.reraNumber}
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-primary leading-[0.9] tracking-tighter mb-4">
                  {property.title}
                </h1>
                <p className="text-xl text-text-muted leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={handleShare} className="p-3 rounded-full border border-black/10 hover:bg-black/5" aria-label="Share estate">
                  <Share2 size={20} />
                </button>
                <button
                  onClick={() => setIsSaved((value) => !value)}
                  className={`p-3 rounded-full border ${isSaved ? 'bg-red-50 border-red-100 text-red-600' : 'border-black/10 hover:bg-black/5'}`}
                  aria-label="Save estate"
                >
                  <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {shareStatus && <p className="text-xs font-bold uppercase tracking-widest text-secondary">{shareStatus}</p>}


            <div className="grid grid-cols-3 gap-4 py-6 border-y border-black/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Scale</p>
                <p className="font-black text-primary flex items-center gap-2"><Maximize size={16} className="text-secondary" />{property.sizeValue ? `${property.sizeValue} Acres` : property.size}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Quote</p>
                <p className="font-black text-primary flex items-center gap-2"><IndianRupee size={16} className="text-secondary" />{property.priceValue ? `₹${property.priceValue} Cr` : property.price}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Profit View</p>
                <p className="font-black text-primary flex items-center gap-2"><TrendingUp size={16} className="text-secondary" />{property.roiValue ? `${property.roiValue}% CAGR` : property.roi}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                onClick={handleWhatsAppClick}
                className="btn-primary px-6 py-4 rounded-2xl flex items-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp Estate Team
              </a>
              <button
                onClick={handleDroneTourClick}
                className="bg-white border border-black/10 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:border-secondary transition-all"
              >
                <Video size={18} className="text-secondary" />
                Request Drone Tour
              </button>
              <button
                className="bg-white border border-black/10 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:border-secondary transition-all"
              >
                <LineChart size={18} className="text-secondary" />
                Compare ROI
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid xl:grid-cols-[1fr_420px] gap-10 items-start">
          <main className="space-y-10">
            <section className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
              <p className="text-xs font-black uppercase tracking-widest text-secondary mb-3">Revenue Model</p>
              <h2 className="text-3xl font-bold mb-4">How This Agri Estate Can Earn</h2>
              <p className="text-text-muted text-lg leading-relaxed mb-8">{property.revenueModel}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-primary text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Development Cost</p>
                  <p className="text-sm leading-relaxed text-white/70">{property.costRange}</p>
                </div>
                <div className="p-5 rounded-3xl bg-gray-50 border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Break-even View</p>
                  <p className="text-sm font-semibold leading-relaxed text-primary">{property.breakEven}</p>
                </div>
                <div className="p-5 rounded-3xl bg-gray-50 border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Estate Type</p>
                  <p className="text-sm font-semibold leading-relaxed text-primary">{property.type}</p>
                </div>
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs mb-3">
                  <Sprout size={18} />
                  Crop Plan
                </div>
                <h2 className="text-3xl font-bold mb-6">Recommended Crops</h2>
                <div className="space-y-3">
                  {(property.crops || []).map((crop: string) => (
                    <div key={crop} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <CheckCircle2 size={18} className="text-secondary" />
                      <span className="font-bold text-primary">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                <p className="text-xs font-black uppercase tracking-widest text-secondary mb-3">Setup Scope</p>
                <h2 className="text-3xl font-bold mb-6">What IGO Will Develop</h2>
                <div className="space-y-3">
                  {(property.setupScope || []).map((item: string) => (
                    <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <CheckCircle2 size={18} className="text-secondary" />
                      <span className="font-bold text-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* NEW CX FEATURES: Soil and Infrastructure */}
            <section className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs mb-3">
                  <Droplets size={18} />
                  Soil Health Audit
                </div>
                <h2 className="text-3xl font-bold mb-6">Soil Composition</h2>
                {property.soilData ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'pH Level', value: property.soilData.ph, color: 'text-green-600' },
                      { label: 'Nitrogen', value: property.soilData.nitrogen, color: 'text-blue-600' },
                      { label: 'Phosphorus', value: property.soilData.phosphorus, color: 'text-purple-600' },
                      { label: 'Potassium', value: property.soilData.potassium, color: 'text-orange-600' },
                      { label: 'Organic Carbon', value: property.soilData.organicCarbon, color: 'text-brown-600' }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-black/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{item.label}</p>
                        <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-black/10">
                    <p className="text-sm text-text-muted">Detailed soil audit data available on request.</p>
                    <button className="mt-4 text-xs font-bold text-secondary uppercase tracking-widest border-b border-secondary">Download Sample Report</button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs mb-3">
                  <Truck size={18} />
                  Logistics & Connectivity
                </div>
                <h2 className="text-3xl font-bold mb-6">Infrastructure</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Nearest Highway', value: property.infrastructure?.highwayDistance || '2-5 km', icon: MapPin },
                    { label: 'Primary Market', value: property.infrastructure?.marketDistance || '10-15 km', icon: Warehouse },
                    { label: 'Cold Storage', value: property.infrastructure?.coldStorageDistance || 'Within 20 km', icon: Truck },
                    { label: 'Power Supply', value: property.infrastructure?.powerAvailability || '3-Phase Agri', icon: Zap }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shadow-sm">
                          <item.icon size={16} />
                        </div>
                        <span className="text-sm font-bold text-primary">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-secondary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-primary rounded-[40px] p-8 text-white shadow-xl">
              <p className="text-xs font-black uppercase tracking-widest text-secondary mb-3">Estate Development Process</p>
              <h2 className="text-3xl font-bold mb-8">From Enquiry to Agri Estate Revenue</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {estateFlow.map((step) => (
                  <div key={step.title} className="p-5 rounded-3xl bg-white/5 border border-white/10">
                    <h3 className="font-bold mb-3">{step.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                <h2 className="text-3xl font-bold mb-6">What Customer Should Keep Ready</h2>
                <div className="space-y-3">
                  {customerNeeds.map((item: string) => (
                    <div key={item} className="flex gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <FileText size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
                <h2 className="text-3xl font-bold mb-6">IGO Estate Support</h2>
                <div className="space-y-3">
                  {igoSupport.map((item: string) => (
                    <div key={item} className="flex gap-3 p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <CheckCircle2 size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">Official IGO Address Details</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-5 rounded-3xl bg-gray-50 border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Registered / Main Office</p>
                  <p className="font-semibold text-primary leading-relaxed">{property.projectAddress}</p>
                </div>
                <div className="p-5 rounded-3xl bg-gray-50 border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Estate Support Office</p>
                  <p className="font-semibold text-primary leading-relaxed">{property.projectOffice}</p>
                </div>
              </div>
            </section>

            {/* PROFITABILITY & IGO PROJECT EXPLANATION */}
            <section className="bg-gradient-to-br from-primary to-primary-light rounded-[40px] p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs mb-4">
                  <TrendingUp size={18} />
                  Investment Roadmap
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Why Choose IGO Managed Farms?</h2>
                <p className="text-white/70 text-lg mb-10 max-w-3xl">
                  IGO Agritech Farms doesn't just sell land; we build high-yielding agricultural assets. Our turnkey "Managed Farm" model ensures your land generates profit while you stay stress-free.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Scientific Setup',
                      desc: 'Soil health audit, NPK balancing, and climate-sync crop selection for maximum yield.',
                      icon: Sprout
                    },
                    {
                      title: 'Zero Maintenance',
                      desc: 'IGO handles labor, irrigation, weeding, and security. You receive monthly health reports.',
                      icon: CheckCircle2
                    },
                    {
                      title: 'Market Linkage',
                      desc: 'Direct buy-back or premium B2B linkage with retail chains ensuring guaranteed revenue.',
                      icon: Truck
                    },
                    {
                      title: 'Corridor Appreciation',
                      desc: 'Strategic selection of land in growth corridors ensures 12-15% annual land value increase.',
                      icon: IndianRupee
                    }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <item.icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 rounded-[32px] bg-white/5 border border-white/10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-2xl font-bold mb-2">Projected Annual Profit</h4>
                      <p className="text-white/60 text-sm">Combined land appreciation + managed crop revenue</p>
                    </div>
                    <div className="text-center md:text-right">
                      <span className="text-5xl font-black text-secondary tracking-tighter">{property.roi || '15-18%'}</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Estimated Annualized Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl">
              <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs mb-3">
                <AlertCircle size={18} />
                Frequently Asked Questions
              </div>
              <h2 className="text-3xl font-bold mb-8">Estate Details & Policy</h2>
              <div className="space-y-4">
                {(property.faqs || [
                  { question: 'Is the property title clear?', answer: 'Yes, all our properties have clear, marketable titles with 30-year documentation.' },
                  { question: 'What is the maintenance cost?', answer: 'Managed farming maintenance typically costs ₹2,000 - ₹5,000 per month depending on the crop.' }
                ]).map((faq, i) => (
                  <div key={i} className="border border-black/5 rounded-3xl overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-primary">{faq.question}</span>
                      {openFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-6 text-text-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside ref={leadRef} className="space-y-8 xl:sticky xl:top-28">
            <LeadCaptureForm propertyTitle={property.title} propertyId={property.id} />

            {property.availableUnits && property.totalUnits && (
              <div className="bg-white border border-black/5 p-8 rounded-[40px] shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-secondary">Inventory Status</p>
                  <p className="text-xs font-bold text-primary">{property.availableUnits} of {property.totalUnits} Units Left</p>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-secondary transition-all duration-1000" 
                    style={{ width: `${(property.availableUnits / property.totalUnits) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-text-muted italic">Selling fast. Last booking received 4 hours ago.</p>
              </div>
            )}

            <div className="bg-primary border border-black/5 p-8 rounded-[40px] shadow-xl text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Download size={20} className="text-secondary" />
                </div>
                <h4 className="text-xl font-bold">Project Brochure</h4>
              </div>
              <p className="text-white/60 text-sm mb-6">Get the detailed estate map, crop cycle, and complete financial projection in PDF.</p>
              <button className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all">
                Download Now
              </button>
            </div>
          </aside>
        </div>

        {/* Rental Yield Calculator - for Rent/Lease properties */}
        {property && (property.intention === 'Rent' || property.intention === 'Lease' || property.type?.toLowerCase()?.includes('rent') || property.type?.toLowerCase()?.includes('lease')) && (
          <section className="mt-12">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Rental Calculator</p>
                    <h2 className="text-2xl font-bold">Estimate Your Rental Yield</h2>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Inputs */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-70">Monthly Expected Rent</label>
                      <div className="relative">
                        <IndianRupee size={20} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50" />
                        <input
                          type="number"
                          value={rentalInputs.monthlyRent}
                          onChange={(e) => setRentalInputs(prev => ({ ...prev, monthlyRent: e.target.value }))}
                          placeholder="e.g. 50000"
                          className="w-full bg-white/10 border border-white/20 rounded-2xl pl-14 pr-6 py-5 text-white placeholder-white/50 text-lg font-bold outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-70">Annual Expenses</label>
                        <div className="relative">
                          <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                          <input
                            type="number"
                            value={rentalInputs.annualExpenses}
                            onChange={(e) => setRentalInputs(prev => ({ ...prev, annualExpenses: e.target.value }))}
                            placeholder="e.g. 10000"
                            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-4 text-white placeholder-white/50 font-bold outline-none focus:ring-2 focus:ring-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-70">Vacancy Rate %</label>
                        <div className="relative">
                          <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                          <input
                            type="number"
                            value={rentalInputs.vacancyRate}
                            onChange={(e) => setRentalInputs(prev => ({ ...prev, vacancyRate: e.target.value }))}
                            placeholder="10"
                            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-4 text-white placeholder-white/50 font-bold outline-none focus:ring-2 focus:ring-white/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-black/20 rounded-[32px] p-8 border border-white/10">
                    <h3 className="text-lg font-bold mb-6 pb-4 border-b border-white/10">Projected Returns</h3>

                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="opacity-70 text-sm">Gross Annual Income</span>
                        <span className="font-black text-lg">₹{rentalResult?.grossIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-70 text-sm">Net Annual Income</span>
                        <span className="font-black text-lg text-secondary">₹{rentalResult?.netIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-70 text-sm">Monthly Cashflow</span>
                        <span className={`font-black text-lg ${(rentalResult?.monthlyCashflow || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ₹{(rentalResult?.monthlyCashflow || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="h-px bg-white/10 my-4"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-wider">Net Yield</span>
                        <span className="text-3xl font-black text-secondary">{rentalResult?.yield.toFixed(2) || '0.00'}%</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <p className="text-[10px] opacity-60 leading-relaxed">
                        Based on {property?.size} estate at ₹{property?.price}. Actual returns depend on occupancy, maintenance costs, and market conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mortgage Calculator - for Buy properties */}
        {property && property.intention !== 'Rent' && property.intention !== 'Lease' && !property.type?.toLowerCase()?.includes('rent') && !property.type?.toLowerCase()?.includes('lease') && (
          <section className="mt-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 border border-black/5 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
                  <BarChart2 size={24} className="text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Finance Calculator</p>
                  <h2 className="text-2xl font-bold text-primary">Home Loan EMI Estimator</h2>
                </div>
              </div>

              <MortgageCalculator property={property} />
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/5 p-3 xl:hidden">
        <div className="container flex items-center gap-3">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noreferrer" 
            onClick={handleWhatsAppClick}
            className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold text-sm text-center"
          >
            WhatsApp
          </a>
          <a href={`tel:${igoPhone}`} className="flex-1 bg-gray-100 text-primary py-3 rounded-2xl font-bold text-sm text-center">
            Call
          </a>
          <button 
            onClick={() => {
              if (!user) {
                setAuthMessage("Please sign in to send an enquiry about this estate.");
                setShowAuthModal(true);
              } else {
                leadRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            }} 
            className="flex-1 bg-secondary text-white py-3 rounded-2xl font-bold text-sm"
          >
            Enquiry
          </button>
        </div>
      </div>

      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
      />
    </div>
  );
};

export default PropertyDetails;
