import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Maximize, TrendingUp, Home, ChevronRight, Heart, BarChart2, X, Droplets, Sprout, Building, Factory, Leaf, Trees } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { locations, getEstatesByLocation, allEstates as staticEstates } from '../data/locationEstates';
import { useProperties } from '../hooks/useProperties';
import type { Property } from '../types';

type EstateWithUI = Property & { isFavorited: boolean; isComparing: boolean };

// Keywords used to match a location tab's id against each estate's free-text `location` field.
// Plain substring matching on the raw id breaks for ids like "chennai_suburban" (the underscore
// never appears in "Chromepet, Chennai" / "Thoraipakam, Chennai"), and "chennai" alone would also
// wrongly match those suburban estates. Explicit keywords keep each tab scoped to the right estates.
const LOCATION_MATCH_KEYWORDS: Record<string, string[]> = {
  mahabalipuram: ['mahabalipuram'],
  maduranthagam: ['maduranthagam'],
  chennai: ['chennai city'],
  kanchipuram: ['kanchipuram'],
  chennai_suburban: ['chromepet', 'thoraipakam'],
};

// Keywords used to match a category filter (from the homepage category tiles / quick-search tags)
// against each estate's `type`/`title`/`description`. The site has two estate datasets with
// different naming ("Open Field Agri Estate" vs "Paddy & Vegetable Field", "Teak Plantation Estate"
// vs "Nursery Agri Estate", etc.), so a single literal keyword misses one dataset and shows
// "No Estates Found" until the other dataset loads in. Listing every real-world synonym here means
// the correct estates show up immediately, regardless of which dataset is currently active.
const CATEGORY_MATCH_KEYWORDS: Record<string, string[]> = {
  'open field': ['open field', 'paddy', 'vegetable field', 'sugarcane', 'open cultivation', 'field farming'],
  'horticulture': ['horticulture', 'mango', 'orchard', 'fruit'],
  'nursery': ['nursery', 'plantation', 'teak', 'agroforestry', 'sapling', 'floriculture'],
  'livestock': ['livestock', 'goat', 'dairy', 'cattle', 'poultry', 'animal'],
  'protected': ['protected', 'polyhouse', 'greenhouse', 'net house', 'shade net'],
  'hydroponic': ['hydroponic', 'soilless', 'vertical farming', 'urban agri'],
  'mushroom': ['mushroom'],
  'microgreens': ['microgreens'],
};

const Listings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const { publicProperties, loading: propertiesLoading } = useProperties();

  // Combine database properties (filtered) with static estates, prioritize DB
  const allProperties = useMemo(() => {
    // Start with database properties (already filtered for auto-expiry)
    const properties = publicProperties.length > 0 ? publicProperties : staticEstates;
    return properties;
  }, [publicProperties]);

  // Get estates based on selection
  const displayEstates = useMemo(() => {
    let estates: Property[] = [];

    if (selectedLocation === 'all') {
      estates = allProperties;
    } else {
      const keywords = LOCATION_MATCH_KEYWORDS[selectedLocation] || [selectedLocation.replace(/_/g, ' ').toLowerCase()];
      estates = allProperties.filter(p =>
        keywords.some(keyword => p.location?.toLowerCase().includes(keyword))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryKeywords = CATEGORY_MATCH_KEYWORDS[selectedCategory.toLowerCase()] || [selectedCategory.toLowerCase()];
      estates = estates.filter(estate => {
        const haystack = `${estate.type || ''} ${estate.title || ''} ${estate.description || ''}`.toLowerCase();
        return categoryKeywords.some(keyword => haystack.includes(keyword));
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      estates = estates.filter(estate =>
        estate.title.toLowerCase().includes(query) ||
        estate.location.toLowerCase().includes(query) ||
        (estate.type?.toLowerCase().includes(query) ?? false) ||
        (estate.description?.toLowerCase().includes(query) ?? false)
      );
    }

    return estates.map(prop => ({
      ...prop,
      isFavorited: favorites.has(prop.id),
      isComparing: compareIds.includes(prop.id)
    })) as EstateWithUI[];
  }, [selectedLocation, selectedCategory, searchQuery, allProperties, favorites, compareIds]);

   const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    if (loc === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ location: loc });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <SEO
        title="Buy Agricultural Land & Farms for Sale Across India"
        description="Explore verified agricultural estates for sale across Tamil Nadu, Karnataka, Maharashtra, Andhra Pradesh & Telangana. Filter by location, crop type, size, and price. Teak plantations, polyhouse farms, mango orchards, and more."
        canonical="/locations"
        keywords="agricultural land for sale India, farmland for sale Tamil Nadu, Karnataka farm land, Maharashtra agri estate, Andhra Pradesh agricultural land, Telangana farmland, buy estate Mahabalipuram, Kanchipuram agri land, horticulture farm sale, plantation land India, polyhouse farm sale, mango orchard India"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Agricultural Estates for Sale — IGO Agri Estates',
          description: 'Verified agricultural land listings across Tamil Nadu, Karnataka and Maharashtra',
          url: 'https://www.igoagriestate.com/locations',
          numberOfItems: 15,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Mahabalipuram Teak Estate', url: 'https://www.igoagriestate.com/properties/mahabalipuram-teak-estate' },
            { '@type': 'ListItem', position: 2, name: 'Mahabalipuram Mango Orchard', url: 'https://www.igoagriestate.com/properties/mahabalipuram-mango-orchard' },
            { '@type': 'ListItem', position: 3, name: 'Chennai Vertical Farm', url: 'https://www.igoagriestate.com/properties/chennai-vertical-farm' },
            { '@type': 'ListItem', position: 4, name: 'Kanchipuram Herbal Garden', url: 'https://www.igoagriestate.com/properties/kanchipuram-herbal-garden' },
          ]
        }}
      />
      {/* Hero Section - Location Selector */}
      <div className="relative bg-gradient-to-b from-primary/5 to-background py-20 border-b border-black/5">
        <div className="container-pro">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-primary mb-6 leading-tight">
              Estates by <span className="text-secondary italic">Location</span>
            </h1>
            <p className="text-xl text-text-muted font-light leading-relaxed">
              Explore premium agricultural estates in Mahabalipuram, Maduranthagam, Chennai, Kanchipuram & more — each with verified titles, clear ROI, and IGO's managed support.
            </p>
          </div>

          {/* Location Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => handleLocationChange('all')}
              className={`px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                selectedLocation === 'all'
                  ? 'bg-secondary text-primary shadow-xl shadow-secondary/20'
                  : 'bg-white border border-black/5 text-primary hover:border-secondary'
              }`}
            >
              All Estates
            </button>
            {locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => handleLocationChange(loc.id)}
                className={`px-6 py-4 rounded-full text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  selectedLocation === loc.id
                    ? 'bg-secondary text-primary shadow-lg'
                    : 'bg-white border border-black/5 text-primary hover:border-secondary'
                }`}
              >
                <MapPin size={16} />
                {loc.name}
                <span className="text-[10px] opacity-60">({loc.estateCount})</span>
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
            <input
              type="text"
              placeholder="Search by estate name, crop, or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-full py-5 pl-16 pr-6 text-lg font-bold shadow-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Location Stats Bar (if specific location selected) */}
      {selectedLocation !== 'all' && (() => {
        const loc = locations.find(l => l.id === selectedLocation);
        if (!loc) return null;
        return (
          <div className="bg-secondary/10 py-8 border-b border-black/5">
            <div className="container-pro">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Location</p>
                  <p className="text-2xl font-black text-primary">{loc.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Estates Available</p>
                  <p className="text-2xl font-black text-secondary">{loc.estateCount}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Average ROI</p>
                  <p className="text-2xl font-black text-green-600">{loc.avgRoi}</p>
                </div>
              </div>
              <p className="mt-4 text-text-muted max-w-3xl">{loc.description}</p>
            </div>
          </div>
        );
      })()}

      {/* Results */}
      <div className="container-pro mt-16">
        {displayEstates.length === 0 && propertiesLoading ? (
          <div className="py-32 text-center">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Search size={40} className="text-primary/20" />
            </div>
            <h3 className="text-xl font-bold text-primary/60">Loading estates...</h3>
          </div>
        ) : displayEstates.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search size={40} className="text-primary/20" />
            </div>
            <h3 className="text-3xl font-black text-primary mb-4">No Estates Found</h3>
            <p className="text-text-muted mb-8">Try adjusting your search or explore other locations.</p>
            <button
              onClick={() => { setSelectedLocation('all'); setSearchQuery(''); }}
              className="text-secondary font-bold uppercase tracking-widest border-b-2 border-secondary pb-1"
            >
              View All Estates
            </button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-10">
              <p className="text-lg text-text-muted">
                Showing <span className="font-black text-primary">{displayEstates.length}</span> estate{displayEstates.length !== 1 ? 's' : ''}
                {selectedLocation !== 'all' && ` in ${locations.find(l => l.id === selectedLocation)?.name}`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    showMap ? 'bg-secondary text-primary' : 'bg-black/5 text-primary/60 hover:bg-black/10'
                  }`}
                >
                  {showMap ? 'Show Grid' : 'View Map'}
                </button>
                {compareIds.length > 0 && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-red-50 rounded-full border border-red-100">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Comparing {compareIds.length}/3
                    </span>
                    <button onClick={() => setCompareIds([])} className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Estate Grid */}
            {!showMap ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
                {displayEstates.map((estate) => (
                  <EstateCard
                    key={estate.id}
                    estate={estate}
                    onFavorite={() => toggleFavorite(estate.id)}
                    onCompare={() => toggleCompare(estate.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-[40px] h-[600px] mb-12 border border-black/5">
                {/* Simple map placeholder - can integrate with Leaflet */}
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Interactive Map View</p>
                    <p className="text-sm">(Integrate with Leaflet/Mapbox)</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface EstateCardProps {
  estate: Property & { isFavorited: boolean; isComparing: boolean };
  onFavorite: () => void;
  onCompare: () => void;
}

const EstateCard: React.FC<EstateCardProps> = ({ estate, onFavorite, onCompare }) => {
  const locationName = estate.location.split(',')[0];
  const iconMap: Record<string, any> = {
    'Teak': Trees,
    'Mango': Leaf,
    'Polyhouse': Factory,
    'Paddy': Sprout,
    'Sugarcane': Leaf,
    'Vertical': Building,
    'Mushroom': Sprout,
    'Silk': Leaf,
    'Herbal': Leaf,
    'Flower': Leaf,
    'Organic': Leaf,
    'default': Home
  };

   const EstateIcon = iconMap[estate.type?.split(' ')[0] ?? ''] || Home;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[40px] overflow-hidden border border-black/5 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden bg-primary/5">
        <img src={estate.image} alt={estate.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="bg-green-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            {estate.status}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <button
            onClick={onFavorite}
            aria-label={estate.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={estate.isFavorited}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              estate.isFavorited ? 'bg-red-500 text-white' : 'bg-white/90 text-primary hover:bg-white'
            }`}
          >
            <Heart size={18} fill={estate.isFavorited ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onCompare}
            aria-label={estate.isComparing ? 'Remove from comparison' : 'Add to comparison'}
            aria-pressed={estate.isComparing}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              estate.isComparing ? 'bg-secondary text-primary' : 'bg-white/90 text-primary'
            }`}
          >
            <BarChart2 size={18} />
          </button>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-2 text-white">
            <MapPin size={16} className="text-secondary" />
            <span className="font-black text-sm uppercase tracking-wider">{locationName}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary mb-3">
          <EstateIcon size={16} />
          {estate.type}
        </div>

        <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors line-clamp-2">
          {estate.title}
        </h3>

        <p className="text-sm text-text-muted leading-relaxed mb-6 line-clamp-2">
          {estate.description}
        </p>

        {/* Key Specs */}
        <div className="grid grid-cols-3 gap-4 py-6 border-y border-black/5 mb-6">
          <div>
            <p className="text-[9px] uppercase text-text-muted mb-1">Area</p>
            <p className="font-bold text-primary flex items-center gap-1">
              <Maximize size={14} className="text-secondary" />{estate.sizeValue || estate.size}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-text-muted mb-1">ROI</p>
            <p className="font-bold text-primary flex items-center gap-1">
              <TrendingUp size={14} className="text-secondary" />{estate.roiValue ? `${estate.roiValue}%` : (estate.roi ? estate.roi.split('%')[0] + '%' : 'NA')}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-text-muted mb-1">Price</p>
            <p className="font-bold text-secondary">{estate.price}</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {estate.features?.slice(0, 3).map((feature: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-bold uppercase rounded-full">
              {feature}
            </span>
          ))}
        </div>

        <Link
          to={`/properties/${estate.id}`}
          className="mt-auto block w-full bg-primary text-white text-center py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all"
        >
          View Estate
        </Link>
      </div>
    </motion.div>
  );
};

export default Listings;