import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Maximize, TrendingUp, ArrowRight, Sprout, Heart, BarChart2, Clock, Lock } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  image?: string;
  title?: string;
  location?: string;
  size?: string;
  price?: string;
  roi?: string;
  status?: 'Available' | 'Sold' | 'Reserved';
  type?: string;
  soldAt?: string;
  bookedAt?: string;
  onFavorite?: (id: string) => void;
  onCompare?: (id: string) => void;
  isFavorited?: boolean;
  isComparing?: boolean;
}

const getDaysRemaining = (soldAt?: string): number => {
  if (!soldAt) return 5;
  const elapsed = Date.now() - new Date(soldAt).getTime();
  const remaining = 5 - Math.floor(elapsed / (24 * 60 * 60 * 1000));
  return Math.max(0, remaining);
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  id, image, title, location, size, price, roi,
  status = 'Available', type, soldAt, bookedAt,
  onFavorite, onCompare, isFavorited = false, isComparing = false
}) => {
  const safeImage = image || 'https://images.unsplash.com/photo-1528154291481-66ca7b6ead04?auto=format&fit=crop&w=900&q=80';
  const safeTitle = title || 'Verified Agricultural Estate';
  const safeLocation = location || 'Location available on request';
  const safeSize = size || '0 Acres';
  const safePrice = price || 'On Request';
  const safeRoi = roi || 'NA';
  const areaValue = safeSize.split(' ')[0] || safeSize;
  const estateText = `${safeTitle} ${type || ''}`.toLowerCase();

  const estate = estateText.includes('dairy') || estateText.includes('livestock')
    ? { name: 'Livestock Agri Estate', note: 'Suitable for shed, fodder, water, and animal-care review' }
    : estateText.includes('teak') || estateText.includes('timber') || estateText.includes('agroforestry')
    ? { name: 'Agroforestry Estate', note: 'Long-hold land with tree, boundary, and soil review' }
    : estateText.includes('vineyard')
    ? { name: 'Vineyard Estate', note: 'Grape crop, irrigation, access, and market review' }
    : estateText.includes('organic')
    ? { name: 'Organic Agri Estate', note: 'Soil condition, water, certification, and buyer review' }
    : estateText.includes('mango') || estateText.includes('horticulture') || estateText.includes('plantation')
    ? { name: 'Horticulture Agri Estate', note: 'Fruit crop, water, spacing, and harvest review' }
    : { name: type || 'Agri Estate', note: 'Land size, title, water, access, and buyer suitability review' };

  const isSold = status === 'Sold';
  const isBooked = status === 'Reserved';
  const daysLeft = isSold ? getDaysRemaining(soldAt) : 0;

  const CardWrapper = isSold
    ? ({ children }: { children: React.ReactNode }) => <div className="h-full flex flex-col">{children}</div>
    : ({ children }: { children: React.ReactNode }) => (
        <Link to={`/properties/${id}`} className="h-full flex flex-col">
          {children}
        </Link>
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group bg-white rounded-[40px] overflow-hidden border transition-all duration-500 h-full flex flex-col relative
        ${isSold ? 'border-red-200 opacity-80 grayscale-[30%]' : isBooked ? 'border-orange-200 hover:border-orange-400' : 'border-black/5 hover:border-primary/20 hover:shadow-[0_32px_64px_-16px_rgba(6,78,59,0.1)]'}`}
    >
      {/* SOLD diagonal ribbon */}
      {isSold && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[40px]">
          <div className="absolute top-8 -right-10 bg-red-500 text-white text-xs font-black uppercase tracking-widest px-12 py-2 rotate-45 shadow-xl">
            SOLD
          </div>
          <div className="absolute inset-0 bg-red-900/10 rounded-[40px]" />
        </div>
      )}

      <CardWrapper>
        <div className="relative aspect-[16/11] overflow-hidden bg-primary/5">
          <img
            src={safeImage}
            alt={safeTitle}
            className={`w-full h-full object-cover transition-transform duration-1000 ${!isSold ? 'group-hover:scale-110' : ''}`}
          />

          {/* Status badge */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
              status === 'Available' ? 'bg-green-500/90 text-white' :
              status === 'Sold' ? 'bg-red-500 text-white' :
              'bg-orange-500/90 text-white'
            }`}>
              {status === 'Reserved' ? 'Booked' : status}
            </span>

            {/* Sold countdown */}
            {isSold && soldAt && (
              <span className="flex items-center gap-1 bg-black/70 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                <Clock size={10} />
                {daysLeft === 0 ? 'Removing soon' : `Removes in ${daysLeft}d`}
              </span>
            )}

            {/* Booked timestamp */}
            {isBooked && bookedAt && (
              <span className="flex items-center gap-1 bg-orange-600/80 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                <Lock size={10} />
                Booking Active
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {!isSold && (
            <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
              {onFavorite && (
                <button
                  onClick={(e) => { e.preventDefault(); onFavorite(id); }}
                  className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isFavorited ? 'bg-red-500 text-white' : 'bg-white/80 text-primary hover:bg-white'
                  }`}
                >
                  <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
              )}
              {onCompare && (
                <button
                  onClick={(e) => { e.preventDefault(); onCompare(id); }}
                  className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isComparing ? 'bg-secondary text-primary' : 'bg-white/80 text-primary hover:bg-white'
                  }`}
                >
                  <BarChart2 size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-8 flex-grow flex flex-col">
          <div className="flex items-center text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <MapPin size={14} className="mr-2 text-secondary" />
            <span>{safeLocation}</span>
          </div>

          <div className="text-[9px] font-black uppercase tracking-[0.24em] text-secondary mb-3">
            {estate.name}
          </div>
          <h3 className={`text-2xl font-bold text-primary mb-6 leading-tight transition-colors ${!isSold ? 'group-hover:text-secondary' : ''}`}>
            {safeTitle}
          </h3>

          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sprout size={15} className="text-secondary" />
              <span className="text-[9px] font-black uppercase tracking-widest">Buyer Review Notes</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{estate.note}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-black/5">
            <div>
              <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Area</span>
              <span className="flex items-center text-sm font-bold text-primary">
                <Maximize size={12} className="mr-1.5 text-secondary" />
                {areaValue} <span className="ml-1 text-[10px] opacity-40">Acres</span>
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Return</span>
              <span className="flex items-center text-sm font-bold text-primary">
                <TrendingUp size={12} className="mr-1.5 text-secondary" />
                {safeRoi}
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Land Value</span>
              <span className="flex items-center text-sm font-bold text-primary">
                {safePrice.toLowerCase().includes('quote') ? safePrice : <><span className="mr-1 text-secondary">Rs.</span>{safePrice}</>}
              </span>
            </div>
          </div>

          {isSold ? (
            <div className="mt-auto flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-xs font-black uppercase tracking-widest">
              <Lock size={14} />
              This Estate Has Been Sold
            </div>
          ) : (
            <div className="mt-auto flex items-center justify-between group/link">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary group-hover/link:text-secondary transition-colors">
                View Estate Details
              </span>
              <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-white transition-all">
                <ArrowRight size={18} />
              </div>
            </div>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
};

export default PropertyCard;
