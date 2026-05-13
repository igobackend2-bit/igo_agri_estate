import { useMemo } from 'react';
import { Property } from '../types';

const RECENT_VIEWS_KEY = 'igo_recent_views';
const MAX_RECENT = 6;

export const useRecentlyViewed = (properties: Property[]) => {
  const recentIds: string[] = useMemo(() => {
    try {
      const stored = localStorage.getItem(RECENT_VIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const recentProperties = useMemo(() => {
    return properties
      .filter(p => recentIds.includes(p.id))
      .slice(0, MAX_RECENT);
  }, [properties, recentIds]);

  const addView = (id: string) => {
    try {
      const existing = localStorage.getItem(RECENT_VIEWS_KEY);
      const ids: string[] = existing ? JSON.parse(existing) : [];
      const filtered = ids.filter((pid: string) => pid !== id);
      const updated = [id, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  return { recentProperties, addView };
};

export const getRecommendations = (properties: Property[], currentId?: string): Property[] => {
  // Simple recommendation: return random properties not equal to current, limited to 4
  return properties
    .filter(p => p.id !== currentId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
};
