export interface Property {
  id: string;
  created_at?: string;
  title: string;
  location: string;
  size: string;
  price: string;
  roi: string;
  image: string;
  status: 'Available' | 'Sold' | 'Reserved';
  type?: string;
  description?: string;
  features?: string[];
  projectUrl?: string;
  projectAddress?: string;
  projectOffice?: string;
  crops?: string[];
  setupScope?: string[];
  revenueModel?: string;
  costRange?: string;
  breakEven?: string;
  customerNeeds?: string[];
  igoSupport?: string[];

  // Numeric values for filtering/sorting
  priceValue?: number;
  roiValue?: number;
  sizeValue?: number;

  // Additional property details
  waterSource?: string;
  soilType?: string;
  intention?: 'Buy' | 'Sell' | 'Rent' | 'Lease';
  soilData?: {
    ph: number;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicCarbon: string;
  };
  infrastructure?: {
    marketDistance: string;
    highwayDistance: string;
    coldStorageDistance: string;
    waterSource: string;
    powerAvailability: string;
    waterTableDepth?: string;
    marketYardDistance?: string;
  };
  reraNumber?: string;
  totalUnits?: number;
  availableUnits?: number;
  faqs?: { question: string; answer: string }[];
  images?: string[];
  brochureUrl?: string;
  soldAt?: string;      // ISO timestamp when marked Sold — auto-removes after 5 days
  bookedAt?: string;    // ISO timestamp when marked Booked
}

export type PropertyInput = Omit<Property, 'id' | 'created_at'>;
