import { useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { Property } from '../types';
import { fallbackProperties, normalizeProperty } from '../data/properties';
import { allEstates } from '../data/locationEstates';
import {
  deleteLocalProperty,
  getLocalProperties,
  PROPERTY_SYNC_EVENT,
  saveLocalProperties,
  subscribeLocalSync,
  upsertLocalProperty,
} from '../lib/localSync';

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

const isAutoExpired = (p: Property): boolean => {
  if (p.status === 'Sold' && p.soldAt) {
    return Date.now() - new Date(p.soldAt).getTime() > FIVE_DAYS_MS;
  }
  return false;
};

const computeNumericValues = (prop: Property): Property => {
  let priceValue = 0;
  const priceStr = (prop.price || '').toLowerCase();
  if (priceStr.includes('quote')) {
    priceValue = 0;
  } else {
    const priceMatch = priceStr.match(/([\d.]+)\s*(l|cro?re?s?|cr?)/);
    if (priceMatch) {
      const num = parseFloat(priceMatch[1]);
      const unit = priceMatch[2];
      if (unit.startsWith('l')) priceValue = num / 100;
      else priceValue = num;
    } else {
      const numMatch = priceStr.match(/([\d.]+)/);
      priceValue = numMatch ? parseFloat(numMatch[1]) : 0;
    }
  }

  let roiValue = 0;
  const roiStr = (prop.roi || '').toLowerCase();
  const roiMatch = roiStr.match(/(\d+(?:\.\d+)?)\s*%/);
  if (roiMatch) {
    roiValue = parseFloat(roiMatch[1]);
  } else if (roiStr.includes('cycle') || roiStr.includes('production') || roiStr.includes('season')) {
    roiValue = 12;
  }

  let sizeValue = 0;
  const sizeMatch = (prop.size || '').match(/(\d+(?:\.\d+)?)\s*(acres?|ha|hectares?)/i);
  if (sizeMatch) {
    const num = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toLowerCase();
    sizeValue = (unit.startsWith('ha') || unit.startsWith('hec')) ? num * 2.471 : num;
  }

  const combinedText = [prop.description, ...(prop.features || [])].join(' ').toLowerCase();

  const waterSource = prop.waterSource || (() => {
    if (combinedText.includes('borewell')) return 'Borewell';
    if (combinedText.includes('canal')) return 'Canal';
    if (combinedText.includes('river')) return 'River';
    if (combinedText.includes('rainfed') || combinedText.includes('rain-fed')) return 'Rainfed';
    return 'Borewell';
  })();

  const soilType = prop.soilType || (() => {
    if (combinedText.includes('red soil')) return 'Red Soil';
    if (combinedText.includes('black cotton')) return 'Black Cotton';
    if (combinedText.includes('alluvial')) return 'Alluvial';
    if (combinedText.includes('loam')) return 'Loamy';
    return 'Red Soil';
  })();

  return {
    ...prop,
    priceValue,
    roiValue,
    sizeValue,
    waterSource,
    soilType,
    intention: prop.intention || 'Buy'
  } as Property;
};

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enrichProperties = useCallback((props: Property[]): Property[] => props.map(computeNumericValues), []);

  const getMergedLocalProperties = useCallback(() => {
    const localProperties = getLocalProperties();
    const localIds = new Set(localProperties.map((property) => property.id));
    return [
      ...localProperties,
      ...fallbackProperties.filter((property) => !localIds.has(property.id)),
    ];
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setProperties(enrichProperties(getMergedLocalProperties()));
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      const normalized = data && data.length > 0 ? data.map(normalizeProperty) : fallbackProperties;
      setProperties(enrichProperties(normalized));
    } catch (err: any) {
      console.warn('Supabase fetch failed, using mock data:', err.message);
      setProperties(enrichProperties(fallbackProperties));
    } finally {
      setLoading(false);
    }
  }, [enrichProperties, getMergedLocalProperties]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    return subscribeLocalSync(PROPERTY_SYNC_EVENT, fetchProperties);
  }, [fetchProperties]);

  // Daily refresh to update auto-expired status
  useEffect(() => {
    const interval = setInterval(fetchProperties, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchProperties]);

  // Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const channel = supabase
      .channel('properties-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        fetchProperties();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isSupabaseConfigured, fetchProperties]);

  const publicProperties = properties.filter(p => !isAutoExpired(p));

  const getProperty = useCallback(async (id: string) => {
    try {
      if (!isSupabaseConfigured) {
        let prop = properties.find(p => p.id === id);
        if (!prop) prop = getMergedLocalProperties().find(p => p.id === id);
        return prop ? computeNumericValues(prop) : null;
      }
      const { data, error: fetchError } = await supabase.from('properties').select('*').eq('id', id).single();
      if (fetchError) throw fetchError;
      if (isAutoExpired(data as Property)) return null;
      return computeNumericValues(normalizeProperty(data as Property));
    } catch (err: any) {
      console.warn('Supabase fetch single failed:', err.message);
      let prop = fallbackProperties.find(p => p.id === id);
      if (!prop) prop = allEstates.find(p => p.id === id);
      return prop ? computeNumericValues(prop) : null;
    }
  }, [isSupabaseConfigured, properties, getMergedLocalProperties]);

  const addProperty = useCallback(async (propertyData: Partial<Property>) => {
    try {
      if (!isSupabaseConfigured) {
        const newProp = normalizeProperty({
          status: 'Available',
          image: '/images/properties/paddy-field.png',
          roi: '~12-18%',
          ...propertyData,
          id: propertyData.id || `estate-${Date.now()}`,
          created_at: propertyData.created_at || new Date().toISOString(),
        });
        upsertLocalProperty(newProp);
        setProperties(enrichProperties(getMergedLocalProperties()));
        return { success: true, mocked: true, data: [newProp] };
      }
      const { data, error } = await supabase.from('properties').insert([propertyData]).select();
      if (error) throw error;
      if (data) setProperties(prev => [computeNumericValues(normalizeProperty(data[0])), ...prev]);
      return { success: true, data };
    } catch (err: any) {
      console.warn('Supabase insert failed:', err.message);
      return { success: true, mocked: true };
    }
  }, [isSupabaseConfigured, enrichProperties, getMergedLocalProperties]);

  const updateProperty = useCallback(async (id: string, propertyData: Partial<Property>) => {
    try {
      if (!isSupabaseConfigured) {
        const existing = getMergedLocalProperties().find(p => p.id === id);
        if (existing) {
          upsertLocalProperty(normalizeProperty({ ...existing, ...propertyData, id }));
          setProperties(enrichProperties(getMergedLocalProperties()));
        }
        return { success: true, mocked: true };
      }
      const { data, error } = await supabase.from('properties').update(propertyData).eq('id', id).select();
      if (error) throw error;
      if (data) setProperties(prev => prev.map(p => p.id === id ? computeNumericValues(normalizeProperty(data[0])) : p));
      return { success: true, data };
    } catch (err: any) {
      console.warn('Supabase update failed:', err.message);
      const next = properties.map(p => p.id === id ? computeNumericValues({ ...p, ...propertyData }) : p);
      setProperties(next);
      saveLocalProperties(next);
      return { success: true, mocked: true };
    }
  }, [isSupabaseConfigured, enrichProperties, getMergedLocalProperties, properties]);

  const updateStatus = useCallback(async (id: string, status: 'Available' | 'Sold' | 'Reserved') => {
    const now = new Date().toISOString();
    const patch: Partial<Property> = {
      status,
      soldAt: status === 'Sold' ? now : undefined,
      bookedAt: status === 'Reserved' ? now : undefined,
    };
    return updateProperty(id, patch);
  }, [updateProperty]);

  const deleteProperty = useCallback(async (id: string) => {
    try {
      if (!isSupabaseConfigured) {
        deleteLocalProperty(id);
        setProperties(enrichProperties(getMergedLocalProperties()));
        return { success: true, mocked: true };
      }
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      setProperties(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase delete failed:', err.message);
      const next = properties.filter(p => p.id !== id);
      setProperties(next);
      saveLocalProperties(next);
      return { success: true, mocked: true };
    }
  }, [isSupabaseConfigured, enrichProperties, getMergedLocalProperties, properties]);

  return {
    properties,
    publicProperties,
    loading,
    error,
    refresh: fetchProperties,
    getProperty,
    addProperty,
    updateProperty,
    updateStatus,
    deleteProperty
  };
};
