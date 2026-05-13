import type { Property } from '../types';
import { normalizeProperty } from '../data/properties';
import type { LeadData } from './leadsService';

export const PROPERTIES_KEY = 'igo.admin.properties';
export const LEADS_KEY = 'igo.admin.leads';
export const SETTINGS_KEY = 'igo.admin.settings';
export const BLOGS_KEY = 'igo.admin.blogs';
export const VIDEOS_KEY = 'igo.admin.videos';

export const PROPERTY_SYNC_EVENT = 'igo:properties-sync';
export const LEAD_SYNC_EVENT = 'igo:leads-sync';
export const SETTINGS_SYNC_EVENT = 'igo:settings-sync';
export const BLOG_SYNC_EVENT = 'igo:blogs-sync';
export const VIDEO_SYNC_EVENT = 'igo:videos-sync';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const dispatchSync = (eventName: string) => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(eventName));
};

export const subscribeLocalSync = (eventName: string, callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const storageListener = (event: StorageEvent) => {
    if (isLocalSyncStorageKey(event.key)) callback();
  };

  window.addEventListener(eventName, callback);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener('storage', storageListener);
  };
};

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from local storage`, error);
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T, eventName: string) => {
  if (!canUseStorage()) return;

  window.localStorage.setItem(key, JSON.stringify(value));
  dispatchSync(eventName);
};

export const getLocalProperties = (): Property[] => {
  const stored = readJson<Partial<Property>[] | null>(PROPERTIES_KEY, null);
  if (!stored || stored.length === 0) return [];
  return stored.map((property, index) => normalizeProperty(property, index));
};

export const saveLocalProperties = (properties: Property[]) => {
  writeJson(PROPERTIES_KEY, properties, PROPERTY_SYNC_EVENT);
};

export const upsertLocalProperty = (property: Property) => {
  const properties = getLocalProperties();
  const index = properties.findIndex((item) => item.id === property.id);
  const next = index >= 0
    ? properties.map((item) => item.id === property.id ? property : item)
    : [property, ...properties];
  saveLocalProperties(next);
  return property;
};

export const deleteLocalProperty = (id: string) => {
  saveLocalProperties(getLocalProperties().filter((property) => property.id !== id));
};

export const getLocalLeads = (fallback: LeadData[] = []): LeadData[] => readJson<LeadData[]>(LEADS_KEY, fallback);

export const saveLocalLeads = (leads: LeadData[]) => {
  writeJson(LEADS_KEY, leads, LEAD_SYNC_EVENT);
};

export const addLocalLead = (lead: LeadData, fallback: LeadData[] = []) => {
  const nextLead = { ...lead, id: lead.id || String(Date.now()), created_at: lead.created_at || new Date().toISOString() };
  const next = [nextLead, ...getLocalLeads(fallback)];
  writeJson(LEADS_KEY, next, LEAD_SYNC_EVENT);
  return nextLead;
};

export interface BlogItem {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  content?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  views: string;
  thumb: string;
  url?: string;
}

const defaultBlogs: BlogItem[] = [
  {
    id: '1',
    title: "Why 2026 is the Golden Year for Farmland Investment",
    category: "Market Insights",
    author: "Dr. Aris",
    date: "May 10, 2026",
    image: "/images/blog/farmland.png"
  },
  {
    id: '2',
    title: "Sustainable Irrigation: Maximizing Yield in Arid Regions",
    category: "Agri-Tech",
    author: "Sarah Chen",
    date: "May 08, 2026",
    image: "/images/blog/irrigation.png"
  }
];

const defaultVideos: VideoItem[] = [
  { id: '1', title: "Top 5 Estates in Tamil Nadu", views: "12k", thumb: "/images/blog/drone-audit.png", url: "https://www.youtube.com/results?search_query=agricultural+estate+drone+tour+tamil+nadu" },
  { id: '2', title: "Investing in Teak: 10 Year ROI", views: "8.5k", thumb: "/images/properties/teak-estate.png", url: "https://www.youtube.com/results?search_query=teak+plantation+investment+returns+india" }
];

export const getLocalBlogs = (): BlogItem[] => readJson<BlogItem[]>(BLOGS_KEY, defaultBlogs);
export const saveLocalBlogs = (blogs: BlogItem[]) => writeJson(BLOGS_KEY, blogs, BLOG_SYNC_EVENT);

export const getLocalVideos = (): VideoItem[] => readJson<VideoItem[]>(VIDEOS_KEY, defaultVideos);
export const saveLocalVideos = (videos: VideoItem[]) => writeJson(VIDEOS_KEY, videos, VIDEO_SYNC_EVENT);

export interface AdminSettings {
  siteName: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  adminPassword: string;
  enableAI: boolean;
  enableChat: boolean;
  maintenanceMode: boolean;
}

export const defaultAdminSettings: AdminSettings = {
  siteName: 'IGO Agriestates',
  contactPhone: '+91 98400 00000',
  contactEmail: 'admin@igoagriestates.com',
  whatsappNumber: '919840000000',
  adminPassword: 'Admin@123',
  enableAI: true,
  enableChat: true,
  maintenanceMode: false,
};

export const getLocalSettings = (): AdminSettings => readJson<AdminSettings>(SETTINGS_KEY, defaultAdminSettings);

export const saveLocalSettings = (settings: AdminSettings) => {
  writeJson(SETTINGS_KEY, settings, SETTINGS_SYNC_EVENT);
};

export const isLocalSyncStorageKey = (key: string | null) =>
  key === PROPERTIES_KEY || key === LEADS_KEY || key === SETTINGS_KEY || key === BLOGS_KEY || key === VIDEOS_KEY;
